import { NextRequest, NextResponse } from "next/server";
import { 
  generateText, 
  processConversationHistory, 
  TextGenerationRequest 
} from "@/lib/pollinationsApi";
import { createMCPSystemPrompt, parseMCPResponse } from "@/lib/mcpHelper";
import { supabase } from "@/lib/supabaseClient";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Helper to get authenticated Supabase client
async function getServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}

// Make sure we're using the newer Next.js App Router handler signature
export async function POST(req: NextRequest) {
  console.log("API route /api/chat called");
  try {
    // Parse request body
    const body = await req.json();
    const { messages, model, systemPrompt, agentId } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Invalid messages array" },
        { status: 400 }
      );
    }
    
    // Get only user messages to determine the lastUserMessage
    const userMessages = messages.filter(msg => msg.role === "user");
    if (userMessages.length === 0) {
      return NextResponse.json(
        { success: false, error: "No user messages found" },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastUserMessage = userMessages[userMessages.length - 1];
    
    // Determine the system prompt to use
    let finalSystemPrompt = systemPrompt || "You are a helpful assistant.";
    
    // If we have an agent ID, try to fetch its system prompt from Supabase
    if (agentId) {
      try {
        // Get authenticated client if possible
        const serverClient = await getServerSupabaseClient();
        
        // Fetch the agent's system prompt
        const { data, error } = await serverClient
          .from("agents")
          .select("system_prompt")
          .eq("id", agentId)
          .single();
        
        if (!error && data && data.system_prompt) {
          console.log("Using agent system prompt:", data.system_prompt.substring(0, 100) + "...");
          finalSystemPrompt = data.system_prompt;
        }
      } catch (error) {
        console.error("Error fetching agent system prompt:", error);
        // Continue with provided or default system prompt
      }
    }
    
    // Process conversation history to ensure proper format
    const { processedMessages, contextString } = processConversationHistory(messages);
    
    // Prepare request to Pollinations API
    const requestBody: TextGenerationRequest = {
      messages: processedMessages,
      model: model || "openai",
      system_prompt: createMCPSystemPrompt(finalSystemPrompt),
      temperature: 0.7,
      private: true  // Set to private to avoid appearing in public feed
    };
    
    console.log("Sending request to Pollinations API:", JSON.stringify(requestBody, null, 2));
    
    try {
      // Call Pollinations API
      const response = await generateText(requestBody);
      
      console.log("Received response from Pollinations API:", JSON.stringify(response, null, 2));
      
      if (!response || !response.text) {
        console.error("Invalid or empty response from Pollinations API:", response);
        return NextResponse.json(
          { success: false, error: "Received invalid response from AI service" },
          { status: 500 }
        );
      }
      
      // Parse MCP directives from the response
      const { message, mcpDirectives } = parseMCPResponse(response);
      
      // Return successful response with message and directives
      return NextResponse.json({
        success: true,
        message,
        mcpDirectives
      });
    } catch (apiError: any) {
      // Handle specific Pollinations API errors
      if (apiError.message && apiError.message.includes("More credits are required")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Your Pollinations account needs more credits to process this request."
          },
          { status: 402 }  // 402 Payment Required
        );
      }
      
      // Re-throw for general error handling
      throw apiError;
    }
  } catch (error: any) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "An error occurred while processing your request"
      },
      { status: 500 }
    );
  }
}