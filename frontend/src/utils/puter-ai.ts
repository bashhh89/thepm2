export interface PuterAIOptions {
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

declare global {
    interface Window {
        puter: {
            ai: {
                chat: (
                    prompt: string | Array<{ role: string; content: string }>,
                    options?: PuterAIOptions
                ) => Promise<any>;
            };
        };
    }
}

export const chatWithAI = async (
    prompt: string,
    options: PuterAIOptions = { model: 'gpt-4o-mini' }
) => {
    try {
        return await window.puter.ai.chat(prompt, options);
    } catch (error) {
        console.error('Puter AI Chat Error:', error);
        throw error;
    }
};

export const streamChat = async (
    prompt: string,
    options: PuterAIOptions = { model: 'gpt-4o-mini', stream: true }
) => {
    try {
        return await window.puter.ai.chat(prompt, { ...options, stream: true });
    } catch (error) {
        console.error('Puter AI Stream Chat Error:', error);
        throw error;
    }
};