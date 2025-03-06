interface PuterConfig {
  apiKey: string;
  apiHost: string;
  debug: boolean;
  modules: string[];
  onInit: () => void;
  onError: (error: unknown) => void;
}

interface Message {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string;
  tool_call_id?: string;
}

interface PuterAIResponse {
  message: {
    content: string | { type: string; text: string };
    tool_calls?: Array<{
      id: string;
      function: {
        name: string;
        arguments: string;
      };
    }>;
  };
}

interface PuterAIOptions {
  model?: 
    | 'gpt-4o-mini' 
    | 'gpt-4o'
    | 'o3-mini'
    | 'o1-mini'
    | 'claude-3-5-sonnet'
    | 'deepseek-chat'
    | 'deepseek-reasoner'
    | 'gemini-2.0-flash'
    | 'gemini-1.5-flash'
    | 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
    | 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
    | 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo'
    | 'mistral-large-latest'
    | 'pixtral-large-latest'
    | 'codestral-latest'
    | 'google/gemma-2-27b-it'
    | 'grok-beta';
  stream?: boolean;
  tools?: Array<{
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
      };
      strict?: boolean;
    };
  }>;
}

interface PuterAI {
  chat(
    prompt: string | Message[],
    testMode?: boolean,
    options?: PuterAIOptions
  ): Promise<PuterAIResponse>;
}

interface Puter {
  config?: PuterConfig;
  isReady?: boolean;
  ai: PuterAI;
  print: (text: string) => void;
}

declare global {
  interface Window {
    puter?: Puter;
  }
}

export type { Puter, Message, PuterAI, PuterAIResponse, PuterAIOptions, PuterConfig };