import { API_URL } from '../constants';

export interface GenerationContext {
    messages: Array<{
        role: string;
        content: string;
    }>;
    context: Record<string, any>;
    options: {
        model: string;
        stream: boolean;
    };
}

export interface GenerationRequest {
    prompt: string;
    type: string;
    context?: Record<string, any>;
    style_preferences?: Record<string, any>;
}

export const generateDocumentContent = async (request: GenerationRequest): Promise<string> => {
    try {
        // Get generation context from backend
        const contextResponse = await fetch(`${API_URL}/routes/documents/generate/context`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            credentials: 'include',
        });

        if (!contextResponse.ok) {
            throw new Error('Failed to get generation context');
        }

        const context: GenerationContext = await contextResponse.json();

        // Generate content using Puter.js
        const response = await window.puter.ai.chat(
            context.messages,
            false, // testMode = false
            {
                model: request.style_preferences?.model || context.options.model,
                stream: false
            }
        );

        return typeof response === 'string' ? response : response.message?.content || '';
    } catch (error) {
        console.error('Document generation error:', error);
        throw error;
    }
};

// Add TypeScript interface for Puter global object
declare global {
    interface Window {
        puter: {
            ai: {
                chat: (
                    messages: Array<{ role: string; content: string }> | string,
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
                ) => Promise<string>;
            };
        };
    }
}