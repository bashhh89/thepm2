import type { PuterAIResponse } from '../types/puter';

interface PuterAIOptions {
  model?: string;
  stream?: boolean;
  tools?: Array<{
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: Record<string, any>;
      strict: boolean;
    };
  }>;
}

declare global {
  interface Window {
    puter: {
      isReady: boolean;
      ai: {
        chat(
          prompt: string | Array<{ role: string; content: string }>,
          options?: PuterAIOptions
        ): Promise<PuterAIResponse>;
      };
    };
  }
}

export const waitForPuter = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.puter?.isReady) {
      resolve();
      return;
    }

    window.addEventListener('puterready', () => {
      resolve();
    });
  });
};

export const chat = async (
  prompt: string | Array<{ role: string; content: string }>,
  options: PuterAIOptions = {}
): Promise<PuterAIResponse> => {
  await waitForPuter();
  const { model, stream, tools } = options;
  return window.puter.ai.chat(prompt, false, { model, stream, tools });
};

// Default model to use
export const DEFAULT_MODEL = 'claude-3-5-sonnet';

// Helper function to create a chat message
export const createChatMessage = (role: 'system' | 'user' | 'assistant' | 'function', content: string) => ({
  role,
  content,
});

// Example function to get AI assistance with error handling
export const getAIAssistance = async (
  prompt: string,
  options: PuterAIOptions = {}
): Promise<string> => {
  try {
    const response = await chat(prompt, {
      model: DEFAULT_MODEL,
      ...options,
    });
    return response.message.content;
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again later.';
  }
};

export default {
  chat,
  waitForPuter,
  DEFAULT_MODEL,
  createChatMessage,
  getAIAssistance,
}; 