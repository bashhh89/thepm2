/// <reference types="vite/client" />

interface Window {
    puter: {
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
            ) => Promise<string | { message: { content: string; tool_calls?: any[] }; text?: string } | AsyncIterator<any>>;
            generateImage: (options: { prompt: string; size: string }) => Promise<{ url: string }>;
            analyzeImage: (options: { image: string }) => Promise<{ description: string }>;
            generateSpeech: (options: { text: string; voice: string }) => Promise<{ url: string }>;
            transcribeAudio: (options: { audio: string }) => Promise<{ text: string }>;
            print: (text: string) => void;
        };
        fs: {
            mkdir: (path: string) => Promise<void>;
            write: (path: string, content: string | Blob) => Promise<void>;
            read: (path: string) => Promise<string>;
            readdir: (path: string) => Promise<string[]>;
            exists: (path: string) => Promise<boolean>;
            remove: (path: string) => Promise<void>;
            rename: (oldPath: string, newPath: string) => Promise<void>;
        };
        ui: {
            alert: (options: { title: string; message: string }) => Promise<void>;
            confirm: (options: { title: string; message: string }) => Promise<boolean>;
            prompt: (options: { title: string; message: string }) => Promise<string>;
        };
    };
}
