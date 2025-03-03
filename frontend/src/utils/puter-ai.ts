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

interface PuterUIToast {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface PuterUIAlertButton {
    text: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
}

interface PuterUIAlert {
    title: string;
    message: string;
    buttons?: PuterUIAlertButton[];
}

declare global {
    interface Window {
        puter: {
            token: string;
            ai: {
                chat: (
                    prompt: string | Array<{ role: string; content: string }>,
                    optionsOrTestMode?: PuterAIOptions | boolean,
                    options?: PuterAIOptions
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
                toast: (options: PuterUIToast) => void;
                alert: (options: PuterUIAlert) => void;
            };
        };
    }
}

interface ChatOptions {
    model?: string;
    stream?: boolean;
    tools?: any[];
    messages?: Array<{ role: string; content: string }>;
}

interface ChatResponse {
    message?: {
        content: string;
        tool_calls?: any[];
    };
    text?: string;
}

// Export the ensurePuterScriptLoaded function
export const ensurePuterScriptLoaded = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (window.puter) {
            resolve();
            return;
        }

        const existingScript = document.getElementById('puter-js');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () => reject());
            return;
        }

        const script = document.createElement('script');
        script.id = 'puter-js';
        script.src = 'https://js.puter.com/v2/';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
    });
};

// Update the list of available models
const AVAILABLE_MODELS = {
    DEFAULT: 'gpt-4o-mini',
    GPT4O: 'gpt-4o',
    O3MINI: 'o3-mini',
    O1MINI: 'o1-mini',
    CLAUDE: 'claude-3-5-sonnet',
    DEEPSEEK_CHAT: 'deepseek-chat',
    DEEPSEEK_REASONER: 'deepseek-reasoner',
    GEMINI_20: 'gemini-2.0-flash',
    GEMINI_15: 'gemini-1.5-flash',
    LLAMA_8B: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    LLAMA_70B: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    LLAMA_405B: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
    MISTRAL: 'mistral-large-latest',
    PIXTRAL: 'pixtral-large-latest',
    CODESTRAL: 'codestral-latest',
    GEMMA: 'google/gemma-2-27b-it',
    GROK: 'grok-beta'
};

// Update the chatWithAI function to handle both streaming and non-streaming cases
export async function chatWithAI(
    prompt: string | Array<{ role: string; content: string }>,
    options: ChatOptions = {}
): Promise<ChatResponse> {
    try {
        await ensurePuterScriptLoaded();
        
        if (options.stream) {
            return streamChat(prompt, options) as Promise<ChatResponse>;
        }

        const response = await window.puter.ai.chat(
            prompt,
            false, // testMode = false
            {
                model: options.model || AVAILABLE_MODELS.DEFAULT,
                stream: false,
                tools: options.tools
            }
        );

        // If it's a string, wrap it in a message object
        if (typeof response === 'string') {
            return {
                message: {
                    content: response
                }
            };
        }

        return response;
    } catch (error) {
        console.error('AI chat failed:', error);
        throw error;
    }
}

// Update the streamChat function to properly handle streaming
export async function streamChat(
    message: string | Array<{ role: string; content: string }>,
    options: ChatOptions = {}
): Promise<AsyncIterable<any>> {
    try {
        await ensurePuterScriptLoaded();

        const response = await window.puter.ai.chat(
            message,
            false, // testMode = false
            {
                model: options.model || AVAILABLE_MODELS.DEFAULT,
                stream: true,
                tools: options.tools
            }
        );

        // Return the AsyncIterator directly from the response
        // The response is already an async iterable when stream is true
        return response;
    } catch (error) {
        console.error('Streaming chat failed:', error);
        throw new Error('Failed to communicate with AI service. Please try again later.');
    }
}

export async function generateImage(prompt: string, size: string = '512x512'): Promise<string> {
    try {
        await ensurePuterScriptLoaded();
        const response = await window.puter.ai.generateImage({
            prompt,
            size
        });
        return response.url;
    } catch (error) {
        console.error('Image generation failed:', error);
        throw new Error('Failed to generate image. Please try again.');
    }
}

export async function uploadImage(file: File): Promise<string> {
    try {
        await ensurePuterScriptLoaded();
        const fileName = `${Date.now()}-${file.name}`;
        await window.puter.fs.write(`/uploads/${fileName}`, file);
        return `/uploads/${fileName}`;
    } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error('Failed to upload image. Please try again.');
    }
}

export async function analyzeImage(imageUrl: string): Promise<{
    description: string;
    tags: string[];
    objects: string[];
}> {
    try {
        await ensurePuterScriptLoaded();
        const response = await window.puter.ai.analyzeImage({
            image: imageUrl
        });
        
        // Parse response to extract more detailed information
        const analysis = {
            description: response.description,
            tags: [],
            objects: []
        };

        try {
            const parsed = JSON.parse(response.description);
            if (parsed.tags) analysis.tags = parsed.tags;
            if (parsed.objects) analysis.objects = parsed.objects;
        } catch {
            // If response is not JSON, use it as plain description
            analysis.tags = response.description.split(',').map(tag => tag.trim());
        }

        return analysis;
    } catch (error) {
        console.error('Image analysis failed:', error);
        throw new Error('Failed to analyze image. Please try again.');
    }
}

export async function generateSpeech(text: string): Promise<string> {
    try {
        const response = await window.puter.ai.generateSpeech({
            text,
            voice: 'en-US-Neural2-F'
        });
        return response.url;
    } catch (error) {
        console.error('Speech generation failed:', error);
        throw error;
    }
}

export async function transcribeAudio(audioUrl: string): Promise<string> {
    try {
        const response = await window.puter.ai.transcribeAudio({
            audio: audioUrl
        });
        return response.text;
    } catch (error) {
        console.error('Audio transcription failed:', error);
        throw error;
    }
}

export async function enhanceText(text: string, style?: string): Promise<string> {
    const prompt = style
        ? `Enhance and improve this text using ${style} style:\n\n${text}`
        : `Enhance and improve this text:\n\n${text}`;

    try {
        const response = await chatWithAI(prompt);
        return response.message?.content || text;
    } catch (error) {
        console.error('Text enhancement failed:', error);
        throw error;
    }
}

export async function summarizeText(text: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
    const prompt = `Create a ${length} summary of this text:\n\n${text}`;

    try {
        const response = await chatWithAI(prompt);
        return response.message?.content || text;
    } catch (error) {
        console.error('Text summarization failed:', error);
        throw error;
    }
}

export async function extractKeyPoints(text: string): Promise<string[]> {
    const prompt = `Extract key points from this text and return them as a JSON array:\n\n${text}`;

    try {
        const response = await chatWithAI(prompt);
        return JSON.parse(response.message?.content || '[]');
    } catch (error) {
        console.error('Key points extraction failed:', error);
        throw error;
    }
}

export const extractJSONFromMarkdown = (text: string): any => {
    try {
        // Try direct JSON parse first
        return JSON.parse(text);
    } catch {
        // If that fails, try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch {
                // If parsing fails, throw with more context
                throw new Error('Failed to parse JSON from markdown response');
            }
        }
        // If no JSON found in markdown, split by lines and try to find a JSON object
        const lines = text.split('\n');
        const jsonLines = lines.filter(line => line.trim().startsWith('{') || line.trim().startsWith('['));
        if (jsonLines.length > 0) {
            try {
                return JSON.parse(jsonLines[0]);
            } catch {
                throw new Error('No valid JSON found in response');
            }
        }
        throw new Error('No JSON content found in response');
    }
};

export async function generateOutline(topic: string, depth: number = 2): Promise<any> {
    const prompt = `Generate a ${depth}-level deep outline for this topic and return it as a JSON object:\n\n${topic}`;

    try {
        const response = await chatWithAI(prompt);
        return extractJSONFromMarkdown(response.message?.content || '{}');
    } catch (error) {
        console.error('Outline generation failed:', error);
        throw error;
    }
}

export async function suggestVisuals(text: string): Promise<{
    images: string[];
    charts: any[];
    tables: any[];
}> {
    const prompt = `Analyze this text and suggest relevant visuals (images, charts, tables). Return as JSON:\n\n${text}`;

    try {
        const response = await chatWithAI(prompt);
        const result = extractJSONFromMarkdown(response.message?.content || '{ "images": [], "charts": [], "tables": [] }');
        return {
            images: result.images || [],
            charts: result.charts || [],
            tables: result.tables || []
        };
    } catch (error) {
        console.error('Visual suggestions failed:', error);
        return { images: [], charts: [], tables: [] };
    }
}

export async function checkGrammar(text: string): Promise<{
    corrected: string;
    errors: Array<{ text: string; suggestion: string; explanation: string }>;
}> {
    const prompt = `Check this text for grammar and style issues. Return as JSON with corrections and explanations:\n\n${text}`;

    try {
        const response = await chatWithAI(prompt);
        return extractJSONFromMarkdown(response.message?.content || '{ "corrected": "", "errors": [] }');
    } catch (error) {
        console.error('Grammar check failed:', error);
        throw error;
    }
}