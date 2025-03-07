// Gemini API configuration and types
export const GEMINI_API_KEY = 'AIzaSyCfWiKmGabI7xh6AdwSvVaQ2EEtu-o_NKo';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/openai';

export interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export const callGeminiAPI = async (prompt: string) => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: {
          text: prompt
        },
        temperature: 0.7,
        candidate_count: 1
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No valid response from Gemini API');
    }

    return textContent;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

// Helper function to clean AI responses
export const cleanAIResponse = (content: string) => {
  // Remove markdown formatting
  let cleaned = content.replace(/```json\n?|```/g, '').trim();
  
  // Remove any leading/trailing quotes
  cleaned = cleaned.replace(/^\s*"|"\s*$/g, '');
  
  return cleaned;
};

// Helper to parse JSON or fallback to text parsing
export const parseJSONOrText = (content: string) => {
  try {
    // Try to parse as JSON first
    return JSON.parse(content);
  } catch {
    // Fallback to text parsing - split by lines and clean up
    return content
      .split('\n')
      .map(line => line.replace(/^[-*\d.\s]+/, '').trim())
      .filter(Boolean);
  }
};