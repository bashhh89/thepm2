/// <reference types="vite/client" />

interface Window {
  puter?: {
    ai: {
      chat: (
        prompt: string | object[] | any, 
        imageOrTestMode?: string | boolean | string[], 
        testModeOrOptions?: boolean | object,
        options?: object
      ) => Promise<any>;
    };
    print: (text: any) => void;
  };
}
