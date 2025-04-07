import { NextRequest, NextResponse } from "next/server";
import { 
  generateText, 
  processConversationHistory, 
  TextGenerationRequest,
  AVAILABLE_MODELS 
} from "@/lib/pollinationsApi";
import { createMCPSystemPrompt, parseMCPResponse } from "@/lib/mcpHelper";
import { supabase } from "@/lib/supabaseClient";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { TextModelId } from "@/store/settingsStore";

// Define known image generation models
const IMAGE_MODELS = ['flux.schnell', 'turbo', 'flux']; // Add known image models here

// Helper to get authenticated Supabase client
async function getServerSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name, value, options) {
          const cookieStore = await cookies();
          cookieStore.set({ name, value, ...options });
        },
        async remove(name, options) {
          const cookieStore = await cookies();
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}

// Helper function to ensure text messages are properly formatted
function sanitizeMessage(message: any): string {
  try {
    // If message is already a string, return it
    if (typeof message === 'string') return message;
    
    // If message is an array of content objects
    if (Array.isArray(message)) {
      return message
        .filter((item: { type: string; content: string }) => item.type === 'text')
        .map((item: { type: string; content: string }) => item.content)
        .join('\n');
    }
    
    // If message is a single content object
    if (message.type === 'text') {
      return message.content;
    }
    
    // If message is an object with content property
    if (message.content) {
      if (Array.isArray(message.content)) {
        return message.content
          .filter((item: { type: string; content: string }) => item.type === 'text')
          .map((item: { type: string; content: string }) => item.content)
          .join('\n');
      }
      return String(message.content);
    }
    
    // Fallback: convert to string
    return String(message);
  } catch (e) {
    console.error("Error sanitizing message:", e);
    return String(message);
  }
}

// Make sure we're using the newer Next.js App Router handler signature
export async function POST(req: NextRequest) {
  try {
    const { messages, model, systemPrompt, agent, isImageGeneration, imagePrompt, enhanceOnly, promptToEnhance } = await req.json();

    // === Handle Prompt Enhancement Request ===
    if (enhanceOnly) {
      if (!promptToEnhance || typeof promptToEnhance !== 'string') {
        return NextResponse.json({ error: 'Invalid prompt provided for enhancement' }, { status: 400 });
      }

      const enhancementSystemPrompt = `Rewrite the following user input as a highly detailed prompt suitable for an AI image generator. Focus on subject, setting, lighting, style (e.g., photorealistic, cinematic, illustration), mood, and composition. Output ONLY the rewritten prompt. Do not include any conversational text, greetings, or explanations. Just the prompt.`;
      const enhancementMessages = [
        { role: 'system', content: enhancementSystemPrompt },
        { role: 'user', content: promptToEnhance },
      ];

      // Use a reasonably fast model for enhancement, passed in or default to 'phi'
      const enhancementModel = model || 'phi'; 
      console.log(`API Route: Handling ENHANCE request for model: ${enhancementModel}`);

      // Reusing the text generation logic structure
      try {
        console.log(`Making ENHANCE request to Pollinations API with payload:`, {
          model: enhancementModel,
          messageCount: enhancementMessages.length,
          firstMessagePreview: enhancementMessages[0].content.substring(0, 50) + '...'
        });

        const response = await fetch('https://text.pollinations.ai/openai', { // Assuming this is the correct endpoint
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: enhancementModel, messages: enhancementMessages }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Pollinations API error for enhancement: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const enhancedPromptText = data.choices[0].message.content.trim();
        console.log('Received enhanced prompt from Pollinations API:', enhancedPromptText);

        return NextResponse.json({ success: true, enhancedPrompt: enhancedPromptText });

      } catch (error) {
        console.error(`Enhancement request failed:`, error);
        // Throw the error to be caught by the outer try-catch
        throw error;
      }
    }

    // === Handle Image Generation Request ===
    if (isImageGeneration) {
      console.log(`API Route: Constructing IMAGE URL for model: ${model}`);
      
      // Use the explicit imagePrompt if provided, otherwise fallback to the last message content
      const prompt = imagePrompt || (messages && messages.length > 0 ? sanitizeMessage(messages[messages.length - 1].content) : "a default image");
      
      if (!prompt) {
        return NextResponse.json({ error: 'Image prompt is missing' }, { status: 400 });
      }
      
      // Use the provided model or default to flux.schnell
      const imageModel = model || 'flux.schnell';
      
      // Construct the image URL based on the documentation
      const encodedPrompt = encodeURIComponent(prompt);
      const width = 1024; // Or get from request if needed
      const height = 1024; // Or get from request if needed
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${imageModel}&nologo=true&t=${Date.now()}`;
      
      console.log(`Constructed Pollinations IMAGE URL: ${imageUrl}`);

      // Return the constructed URL
      return NextResponse.json({
        success: true,
        imageUrl: imageUrl, // The URL to be used by the frontend
        model: imageModel  // Confirm which model was used for URL construction
      });
    }

    // === Handle Text Generation Request (Existing Logic) ===
    console.log(`API Route: Handling TEXT generation request for model: ${model || 'default'}`);
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format for text generation' }, { status: 400 });
    }

    // Set default model if none provided
    const activeModel = model || 'openai';
    console.log('API Route: Received request with model:', activeModel);

    // Get agent details
    let agentDetails = agent;
    if (!agentDetails) {
      console.log('API Route - Using direct agent object: Default Assistant');
      agentDetails = {
        name: 'Default Assistant',
        systemPrompt: systemPrompt || 'You are a helpful AI assistant.',
        modelPreference: model || 'openai'  // Use provided model or default to openai
      };
    } else {
      console.log('API Route - Using agent:', agentDetails.name, 'with model preference:', agentDetails.modelPreference);
    }

    // Only use agent preference if no explicit model was provided
    const finalModel = model || agentDetails.modelPreference || 'openai';
    console.log('API Route - Final model being used:', finalModel);

    // Look for a thinking system prompt in the messages
    const hasThinkingPrompt = messages.some(msg => 
      msg.role === 'system' && 
      typeof msg.content === 'string' && 
      msg.content.includes('THINKING:') && 
      msg.content.includes('ANSWER:')
    );

    // Combine system prompt with knowledge base
    let finalSystemPrompt = agentDetails.systemPrompt || systemPrompt || 'You are a helpful AI assistant.';
    
    // Add thinking instructions if not already present
    if (!hasThinkingPrompt) {
      finalSystemPrompt = `${finalSystemPrompt}\n\nPlease provide your thinking process and reasoning separately before giving your final answer. Format your response with a "THINKING:" section followed by your reasoning process, and then an "ANSWER:" section with your final response.`;
    }
    
    console.log('Final system prompt being used:', finalSystemPrompt);

    // Format messages for API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: Array.isArray(msg.content) 
        ? msg.content.map((c: any) => typeof c === 'string' ? c : c.content).join(' ')
        : msg.content
    }));

    // Add system prompt as first message if not already a system message
    if (formattedMessages.length === 0 || formattedMessages[0].role !== 'system') {
      formattedMessages.unshift({
        role: 'system',
        content: finalSystemPrompt
      });
    }

    // Try Pollinations API with retries
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        console.log(`Making request to Pollinations API (attempt ${attempts + 1}) with payload:`, {
          model: finalModel,
          messageCount: formattedMessages.length,
          firstMessagePreview: formattedMessages[0].content.substring(0, 50) + '...'
        });

        const response = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: finalModel,
            messages: formattedMessages
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Pollinations API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        console.log('Received response from Pollinations API:', {
          success: true,
          messagePreview: aiResponse.substring(0, 50) + '...'
        });

        // Extract thinking and answer from the response
        let thinking = '';
        let answer = aiResponse;
        
        // Check if the response contains the THINKING and ANSWER sections
        const thinkingMatch = aiResponse.match(/THINKING:([\s\S]*?)(?=ANSWER:|$)/i);
        const answerMatch = aiResponse.match(/ANSWER:([\s\S]*?)$/i);
        
        if (thinkingMatch && answerMatch) {
          thinking = thinkingMatch[1].trim();
          answer = answerMatch[1].trim();
          console.log('Successfully separated thinking and answer sections');
        } else {
          console.log('Could not identify separate thinking and answer sections');
        }

        return NextResponse.json({
          success: true,
          message: answer,
          thinking: thinking,
          model: finalModel
        });

      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        lastError = error;
        attempts++;
        
        // If we've tried all attempts, throw the last error
        if (attempts === maxAttempts) {
          throw lastError;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }

    throw lastError;

  } catch (error) {
    console.error("Error in /api/chat:", error);
    // Ensure a generic error is returned if specific handling fails
    return NextResponse.json({
      success: false,
      message: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      thinking: '', // No thinking available on error
    }, { status: 500 });
  }
}