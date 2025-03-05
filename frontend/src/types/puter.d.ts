interface PuterConfig {
  apiKey: string;
  apiHost: string;
  debug: boolean;
  modules: string[];
  onInit: () => void;
  onError: (error: unknown) => void;
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
  model?: string;
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
    prompt: string | Array<{ role: string; content: string }>,
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

export type { Puter, PuterConfig, PuterAI, PuterAIResponse };