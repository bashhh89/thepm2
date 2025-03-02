import { useState } from 'react';
import { DocumentType } from '../types/documents';
import { chatWithAI, extractJSONFromMarkdown } from '../utils/puter-ai';

interface GeneratedContent {
  content: string;
  images?: string[];
  charts?: any[];
  tables?: any[];
}

export function useAIAssistant() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (prompt: string, type: string): Promise<GeneratedContent> => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await chatWithAI(prompt, {
        model: 'gpt-4o-mini',
        stream: false
      });

      const content = response.message?.content || '';
      try {
        const parsed = extractJSONFromMarkdown(content);
        return parsed;
      } catch {
        return { content };
      }
    } catch (error) {
      console.error('Content generation failed:', error);
      setError('Failed to generate content. Please try again.');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIAction = async (action: string, content: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      switch (action) {
        case 'generate_outline':
          const outlinePrompt = `Create a detailed outline for this topic and return it as a JSON object with 'sections' array:\n\n${content}`;
          const outlineResponse = await chatWithAI(outlinePrompt);
          return extractJSONFromMarkdown(outlineResponse.message?.content || '{}');

        case 'generate_section':
          const sectionPrompt = `Generate detailed content for this topic and section. Include relevant examples, data, and explanations. Return as JSON with 'content', 'images', 'charts', and 'tables' properties:\n\n${content}`;
          const sectionResponse = await chatWithAI(sectionPrompt);
          return extractJSONFromMarkdown(sectionResponse.message?.content || '{}');

        case 'enhance_style':
          const stylePrompt = `Enhance and improve this text while maintaining its meaning. Return improved version directly:\n\n${content}`;
          const styleResponse = await chatWithAI(stylePrompt);
          return styleResponse.message?.content;

        case 'suggest_improvements':
          const improvementPrompt = `Analyze this content and suggest specific improvements. Return as bulleted list:\n\n${content}`;
          const improvementResponse = await chatWithAI(improvementPrompt);
          return improvementResponse.message?.content?.split('\n').filter(Boolean);

        case 'add_visuals':
          const visualsPrompt = `Suggest visuals for this content. Return as JSON with 'images', 'charts', and 'tables' arrays:\n\n${content}`;
          const visualsResponse = await chatWithAI(visualsPrompt);
          return extractJSONFromMarkdown(visualsResponse.message?.content || '{}');

        case 'summarize':
          const summaryPrompt = `Create a concise summary of this content:\n\n${content}`;
          const summaryResponse = await chatWithAI(summaryPrompt);
          return summaryResponse.message?.content;

        default:
          throw new Error('Unknown AI action');
      }
    } catch (error) {
      console.error('AI action failed:', error);
      setError(error instanceof Error ? error.message : 'AI action failed');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    handleAIAction,
    isGenerating,
    error
  };
}