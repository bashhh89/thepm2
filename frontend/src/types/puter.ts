export interface PuterWindow extends Window {
  puter: {
    token: string;
    ai: {
      chat: (
        prompt: string | Array<{ role: string; content: string }>,
        testMode?: boolean,
        options?: {
          model?: string;
          stream?: boolean;
          tools?: Array<{
            type: "function";
            function: {
              name: string;
              description: string;
              parameters: object;
              strict: boolean;
            };
          }>;
        }
      ) => Promise<any>;
      generateImage: (options: { prompt: string; size: string }) => Promise<{ url: string }>;
      analyzeImage: (options: { image: string }) => Promise<{ description: string }>;
      generateSpeech: (options: { text: string; voice: string }) => Promise<{ url: string }>;
      transcribeAudio: (options: { audio: string }) => Promise<{ text: string }>;
      print: (text: string) => void;
    };
    fs: {
      write: (path: string, content: any) => Promise<void>;
      mkdir: (path: string) => Promise<void>;
      readdir: (path: string) => Promise<string[]>;
      readFile: (path: string) => Promise<any>;
      delete: (path: string) => Promise<void>;
      exists: (path: string) => Promise<boolean>;
    };
    ui: {
      toast: (options: {
        message: string;
        type?: 'success' | 'error' | 'warning' | 'info';
        duration?: number;
      }) => void;
      alert: (options: {
        title: string;
        message: string;
        buttons?: Array<{
          text: string;
          variant?: 'primary' | 'secondary' | 'danger';
          onClick?: () => void;
        }>;
      }) => Promise<void>;
      confirm: (options: { title: string; message: string }) => Promise<boolean>;
      prompt: (options: { title: string; message: string }) => Promise<string | null>;
    };
  };
}

export interface PuterAIMessage {
  role: string;
  content: string;
}

export interface PuterAIResponse {
  message?: {
    content: string;
  };
  text?: string;
  content?: string;
}

export interface PuterAI {
  chat: (prompt: string | Array<{ role: string; content: string }>) => Promise<PuterAIResponse>;
}

declare global {
  interface Window {
    puter?: {
      ai: PuterAI;
    };
  }
}