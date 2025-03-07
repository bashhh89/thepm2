interface PuterAIResponse {
  message?: {
    content: string;
    role?: string;
  };
  text?: string;
  content?: string | Record<string, any>;
}

interface PuterAI {
  chat: (messages: Array<{ role: string; content: string }>) => Promise<PuterAIResponse>;
}

interface PuterWindow {
  ai: PuterAI;
}

declare global {
  interface Window {
    puter?: PuterWindow;
  }
}

export {}; 