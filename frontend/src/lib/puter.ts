interface PuterAIMessage {
  role: string;
  content: string;
}

interface PuterAIResponse {
  message?: {
    content: string;
  };
  text?: string;
  content?: string;
}

interface PuterAI {
  chat: (prompt: string | PuterAIMessage[]) => Promise<PuterAIResponse>;
}

export async function callPuterAI(messages: PuterAIMessage[] | string): Promise<string> {
  const puter = (window as any).puter;
  if (!puter?.ai?.chat) {
    throw new Error('Puter AI is not initialized');
  }

  try {
    const response = await puter.ai.chat(messages);
    
    if (response.message?.content) {
      return response.message.content;
    }
    if (response.text) {
      return response.text;
    }
    if (response.content) {
      return response.content;
    }
    
    throw new Error('Invalid response format from AI');
  } catch (error) {
    console.error('Error calling Puter AI:', error);
    throw error;
  }
}

export type { PuterAIMessage, PuterAIResponse, PuterAI }; 