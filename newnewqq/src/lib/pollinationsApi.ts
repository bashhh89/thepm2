/**
 * Pollinations API Client
 * A comprehensive client for interacting with the Pollinations.AI API services
 */

// Types for Pollinations API requests and responses
export type TextGenerationRequest = {
  prompt?: string;
  messages?: Array<{role: string; content: string}>;
  model?: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  private?: boolean;
}

export type TextGenerationResponse = {
  text: string;
  [key: string]: any;
}

export type MCPDirective = {
  type: 'image' | 'audio';
  content: string;
}

// Available Models for Pollinations API
export const AVAILABLE_MODELS = {
  text: [
    { id: "openai", name: "OpenAI GPT-4o-mini", description: "OpenAI GPT-4o-mini", baseModel: true, vision: true, censored: true },
    { id: "openai-large", name: "OpenAI GPT-4o", description: "OpenAI GPT-4o", baseModel: true, vision: true, censored: true },
    { id: "openai-reasoning", name: "OpenAI o3-mini", description: "OpenAI o3-mini", baseModel: true, reasoning: true, censored: true },
    { id: "qwen-coder", name: "Qwen 2.5 Coder", description: "Qwen 2.5 Coder 32B", baseModel: true, censored: true },
    { id: "llama", name: "Llama 3.3", description: "Llama 3.3 70B", baseModel: true, censored: false },
    { id: "mistral", name: "Mistral Small", description: "Mistral Small 3.1 2503", baseModel: true, vision: true, censored: false },
    { id: "mistral-roblox", name: "Mistral Roblox", description: "Mistral Roblox on Scaleway", baseModel: true, censored: false },
    { id: "roblox-rp", name: "Roblox Roleplay", description: "Roblox Roleplay Assistant", baseModel: true, censored: true },
    { id: "unity", name: "Unity", description: "Unity with Mistral Large by Unity AI Lab", baseModel: false, censored: false },
    { id: "midijourney", name: "Midijourney", description: "Midijourney musical transformer", baseModel: false, censored: true },
    { id: "rtist", name: "Rtist", description: "Rtist image generator by @bqrio", baseModel: false, censored: true },
    { id: "searchgpt", name: "SearchGPT", description: "SearchGPT with realtime news and web search", baseModel: false, censored: true },
    { id: "evil", name: "Evil Mode", description: "Evil Mode - Experimental", baseModel: false, censored: false },
    { id: "deepseek", name: "DeepSeek-V3", description: "DeepSeek-V3", baseModel: true, censored: true },
    { id: "deepseek-r1", name: "DeepSeek-R1 Distill", description: "DeepSeek-R1 Distill Qwen 32B", baseModel: true, reasoning: true, censored: true },
    { id: "deepseek-reasoner", name: "DeepSeek R1 Full", description: "DeepSeek R1 - Full", baseModel: true, reasoning: true, censored: true },
    { id: "deepseek-r1-llama", name: "DeepSeek R1 Llama", description: "DeepSeek R1 - Llama 70B", baseModel: true, reasoning: true, censored: true },
    { id: "qwen-reasoning", name: "Qwen QWQ", description: "Qwen QWQ 32B - Advanced Reasoning", baseModel: true, reasoning: true, censored: true },
    { id: "llamalight", name: "Llama 3.1 Light", description: "Llama 3.1 8B Instruct", baseModel: true, maxTokens: 7168, censored: false },
    { id: "llamaguard", name: "Llamaguard", description: "Llamaguard 7B AWQ", baseModel: false, maxTokens: 4000, censored: false },
    { id: "phi", name: "Phi-4", description: "Phi-4 Instruct", baseModel: true, censored: true },
    { id: "phi-mini", name: "Phi-4 Mini", description: "Phi-4 Mini Instruct", baseModel: true, censored: true },
    { id: "llama-vision", name: "Llama 3.2 Vision", description: "Llama 3.2 11B Vision", baseModel: true, vision: true, censored: false },
    { id: "pixtral", name: "Pixtral", description: "Pixtral 12B", baseModel: true, vision: true, censored: false },
    { id: "gemini", name: "Gemini 2.0", description: "Gemini 2.0 Flash", baseModel: true, censored: true },
    { id: "gemini-thinking", name: "Gemini Thinking", description: "Gemini 2.0 Flash Thinking", baseModel: true, censored: true },
    { id: "hormoz", name: "Hormoz", description: "Hormoz 8b by Muhammadreza Haghiri", baseModel: true, censored: false },
    { id: "hypnosis-tracy", name: "Hypnosis Tracy", description: "Hypnosis Tracy 7B - Self-help AI assistant", baseModel: false, censored: false },
    { id: "sur", name: "Sur AI", description: "Sur AI Assistant", baseModel: false, censored: true },
    { id: "sur-mistral", name: "Sur AI (Mistral)", description: "Sur AI Assistant (Mistral)", baseModel: false, censored: true },
    { id: "llama-scaleway", name: "Llama (Scaleway)", description: "Llama (Scaleway)", baseModel: true, censored: false },
    { id: "openai-audio", name: "OpenAI Audio", description: "OpenAI GPT-4o-audio-preview", baseModel: true, audio: true, censored: true }
  ],
  image: [
    { id: "flux", name: "Flux", description: "General purpose image generation" },
    { id: "turbo", name: "Turbo", description: "Fast image generation" }
  ],
  voices: [
    { id: "alloy", name: "Alloy", description: "Neutral voice" },
    { id: "echo", name: "Echo", description: "Echo voice" },
    { id: "fable", name: "Fable", description: "Fable voice" },
    { id: "onyx", name: "Onyx", description: "Deep, serious voice" },
    { id: "nova", name: "Nova", description: "Female voice" },
    { id: "shimmer", name: "Shimmer", description: "Soft, calming voice" },
    { id: "coral", name: "Coral", description: "Coral voice" },
    { id: "verse", name: "Verse", description: "Verse voice" },
    { id: "ballad", name: "Ballad", description: "Ballad voice" },
    { id: "ash", name: "Ash", description: "Ash voice" },
    { id: "sage", name: "Sage", description: "Sage voice" },
    { id: "amuch", name: "Amuch", description: "Amuch voice" },
    { id: "dan", name: "Dan", description: "Dan voice" }
  ],
  audio: [
    { id: "openai-audio", name: "OpenAI TTS", description: "Text-to-speech by OpenAI" }
  ],
  voice: [
    { id: "elevenlabs", name: "ElevenLabs", description: "ElevenLabs TTS" },
    { id: "openai", name: "OpenAI TTS", description: "OpenAI Text-to-Speech" }
  ]
};

/**
 * Generate text using the Pollinations API
 */
export async function generateText(options: TextGenerationRequest): Promise<TextGenerationResponse> {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: options.prompt,
        messages: options.messages,
        model: options.model || "openai",
        system_prompt: options.system_prompt,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        private: options.private || false
      }),
      signal: controller.signal
    });
    
    // Clear the timeout as we got a response
    clearTimeout(timeoutId);

    // First handle non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      
      // Check for common error patterns
      if (errorText.includes("More credits are required") || errorText.includes("credits")) {
        throw new Error("More credits are required to run this request. Please check your Pollinations account.");
      }
      
      if (errorText.includes("rate limit") || errorText.includes("ratelimit")) {
        throw new Error("Rate limit exceeded. Please try again later or switch to a different model.");
      }
      
      if (errorText.includes("unavailable") || errorText.includes("not available")) {
        throw new Error("The selected model is currently unavailable. Please try another model.");
      }
      
      throw new Error(`Error ${response.status}: ${errorText.substring(0, 100)}`);
    }

    // Now handle successful responses
    const contentType = response.headers.get("content-type");
    const textContent = await response.text();
    
    // Handle empty responses
    if (!textContent || textContent.trim() === '') {
      throw new Error("Received empty response from Pollinations API");
    }
    
    try {
      // Always try to parse as JSON first, regardless of content-type
      // This handles cases where the content-type header is incorrect
      const jsonData = JSON.parse(textContent);
      
      // Check if the JSON response has the expected structure
      if (!jsonData.text && !jsonData.result && !jsonData.message && !jsonData.response) {
        console.warn("JSON response missing expected fields:", jsonData);
        // Try to find any property that could contain the response text
        const possibleTextFields = Object.keys(jsonData).find(key => typeof jsonData[key] === 'string' && jsonData[key].length > 10);
        if (possibleTextFields) {
          return { text: jsonData[possibleTextFields] };
        } else {
          throw new Error("Invalid response structure from Pollinations API");
        }
      }
      
      // Normalize response structure
      return {
        text: jsonData.text || jsonData.result || jsonData.message || jsonData.response || "",
        ...jsonData
      };
    } catch (e) {
      console.warn("Response is not valid JSON, handling as plain text");
      
      // If it contains "As of my last" or similar AI preface responses
      if (textContent.match(/As of my (last|knowledge|training|current)/i)) {
        // It's probably a non-JSON text response from the model
        return { text: textContent };
      }
      
      // If it contains any error-like text
      if (
        textContent.toLowerCase().includes("error") || 
        textContent.toLowerCase().includes("credits") || 
        textContent.toLowerCase().includes("limit") ||
        textContent.toLowerCase().includes("unavailable")
      ) {
        throw new Error(textContent.trim());
      }
      
      // Otherwise, just return as text
      return { text: textContent };
    }
  } catch (error: any) {
    console.error("Error generating text:", error);
    
    // Handle timeout errors
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. The Pollinations API is taking too long to respond.");
    }
    
    // Re-throw with a more descriptive message
    throw error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Process conversation history into a format accepted by Pollinations API
 */
export function processConversationHistory(messages: any[]): {
  processedMessages: Array<{role: string; content: string}>;
  contextString: string;
} {
  // Process messages to extract text content
  const processedMessages = messages.map(message => {
    if (message.role === "user" || message.role === "assistant") {
      // Extract text content from structured messages
      if (Array.isArray(message.content)) {
        const textContent = message.content
          .filter((item: any) => item.type === "text")
          .map((item: any) => item.content)
          .join("\n");
        
        return {
          role: message.role,
          content: textContent
        };
      } else if (typeof message.content === "string") {
        // Handle if content is already a string
        return {
          role: message.role,
          content: message.content
        };
      }
    }
    return message;
  });

  // Create context string from conversation history
  const contextString = processedMessages.map(msg => 
    `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
  ).join("\n\n");

  return { processedMessages, contextString };
}

/**
 * Generate an image URL based on a prompt
 */
export function generateImageUrl(
  prompt: string, 
  options: { 
    width?: number; 
    height?: number; 
    seed?: number; 
    model?: string;
    nologo?: boolean;
  } = {}
): string {
  const { width = 512, height = 512, seed, model = 'flux', nologo } = options;
  
  let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}`;
  
  if (seed !== undefined) {
    url += `&seed=${seed}`;
  }
  
  if (model) {
    url += `&model=${model}`;
  }
  
  if (nologo) {
    url += `&nologo=true`;
  }
  
  return url;
}

/**
 * Generate an audio URL based on text
 * Ensures proper encoding and URL validity
 */
export function generateAudioUrl(text: string, voice?: string): string {
  // Ensure text is not empty
  if (!text || text.trim() === '') {
    console.error("Empty text passed to generateAudioUrl");
    text = "Audio generation requires text input";
  }
  
  // Truncate extremely long texts to avoid URL length issues
  // 2000 chars is a safe limit for most modern browsers and servers
  if (text.length > 2000) {
    console.warn("Text too long for audio URL, truncating to 2000 chars");
    text = text.substring(0, 1997) + "...";
  }
  
  try {
    // Build the URL with proper query parameters using URLSearchParams
    const params = new URLSearchParams();
    params.append('text', text); 
    params.append('model', 'openai-audio');
    
    // Add voice parameter if provided
    if (voice && voice.trim()) {
      params.append('voice', voice.trim());
    } else {
      // Default voice if none is provided
      params.append('voice', 'alloy');
    }
    
    // Add cache-busting parameter to prevent browser caching issues
    params.append('t', Date.now().toString());
    
    // Construct the final URL - use POST endpoint for more reliable handling
    const url = `https://text.pollinations.ai/audio?${params.toString()}`;
    
    console.log("Generated audio URL:", url);
    return url;
  } catch (error) {
    console.error("Error generating audio URL:", error);
    
    // Fallback to a simple encoding method if the above fails
    const fallbackUrl = `https://text.pollinations.ai/audio?text=${encodeURIComponent(text.substring(0, 1000))}&voice=${voice || 'alloy'}&t=${Date.now()}`;
    console.log("Using fallback audio URL:", fallbackUrl);
    return fallbackUrl;
  }
}

/**
 * Subscribe to the image feed
 * Returns an EventSource that can be used to listen for new images
 */
export function subscribeToImageFeed(
  onMessage: (data: any) => void,
  onError?: (error: Event) => void
): EventSource {
  const eventSource = new EventSource('https://image.pollinations.ai/feed');
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing image feed data:', error);
    }
  };
  
  if (onError) {
    eventSource.onerror = onError;
  } else {
    eventSource.onerror = (error) => {
      console.error('Image feed error:', error);
    };
  }
  
  return eventSource;
}

/**
 * Subscribe to the text feed
 * Returns an EventSource that can be used to listen for new text generations
 */
export function subscribeToTextFeed(
  onMessage: (data: any) => void,
  onError?: (error: Event) => void
): EventSource {
  const eventSource = new EventSource('https://text.pollinations.ai/feed');
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing text feed data:', error);
    }
  };
  
  if (onError) {
    eventSource.onerror = onError;
  } else {
    eventSource.onerror = (error) => {
      console.error('Text feed error:', error);
    };
  }
  
  return eventSource;
}