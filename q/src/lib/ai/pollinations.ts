export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  model?: string;
}

/**
 * Calls the Pollinations chat API to generate a response.
 * 
 * @param options The chat completion options including messages and parameters
 * @returns A promise that resolves to the generated text
 */
export async function callPollinationsChat(
  options: ChatCompletionOptions
): Promise<string> {
  try {
    const apiKey = process.env.POLLINATIONS_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not found. Please set POLLINATIONS_API_KEY or OPENAI_API_KEY environment variable.');
    }

    const endpoint = process.env.POLLINATIONS_API_ENDPOINT || 'https://api.pollinations.ai/v1/chat/completions';
    const model = options.model || process.env.POLLINATIONS_MODEL || 'gpt-4-turbo';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2000,
        top_p: options.top_p ?? 1,
        frequency_penalty: options.frequency_penalty ?? 0,
        presence_penalty: options.presence_penalty ?? 0
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error calling Pollinations API:', error);
    
    // Fallback to a generic response
    if (process.env.NODE_ENV === 'development') {
      return `[API Error: ${error.message}] Fallback response for: ${options.messages[options.messages.length - 1]?.content.substring(0, 100)}...`;
    } else {
      return 'Sorry, I encountered an issue processing your request. Please try again later.';
    }
  }
}

/**
 * Generates an image using the Pollinations API
 * 
 * @param prompt The text prompt for image generation
 * @param options Additional options for image generation
 * @returns A promise that resolves to the image URL
 */
export async function generateImage(
  prompt: string,
  options?: {
    model?: string;
    size?: string;
    style?: string;
    n?: number;
  }
): Promise<string> {
  try {
    const apiKey = process.env.POLLINATIONS_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not found. Please set POLLINATIONS_API_KEY or OPENAI_API_KEY environment variable.');
    }

    const endpoint = process.env.POLLINATIONS_IMAGE_ENDPOINT || 'https://api.pollinations.ai/v1/images/generations';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        model: options?.model || process.env.POLLINATIONS_IMAGE_MODEL || 'dalle-3',
        n: options?.n || 1,
        size: options?.size || '1024x1024',
        style: options?.style || 'vivid',
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Image generation failed with status ${response.status}: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error: any) {
    console.error('Error generating image with Pollinations API:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
} 