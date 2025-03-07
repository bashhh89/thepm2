/// <reference types="vite/client" />

interface Window {
  puter: {
    ai: {
      chat: (prompt: string) => Promise<string>;
    };
  };
}
