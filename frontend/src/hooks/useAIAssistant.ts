import { useState, useCallback } from 'react';
import { chatWithAI, extractJSONFromMarkdown, generateImage, generateOutline, suggestVisuals } from '../utils/puter-ai';
import { DocumentType } from '../types/documents';

export interface AIAction {
  type: string;
  payload: any;
}

export interface Block {
  id: string;
  type: string;
  content: string;
}

export function useAIAssistant() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (prompt: string, type: string = 'text') => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await chatWithAI(prompt);
      const content = response.message?.content || '';

      if (type === 'json' || type === 'template') {
        try {
          return extractJSONFromMarkdown(content);
        } catch (err) {
          setError('Failed to parse AI response as JSON');
          return null;
        }
      }
      
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleAIAction = useCallback(async (action: string, context: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      switch (action) {
        case 'generate_outline':
          const outlineResponse = await chatWithAI(
            `Create an outline for: ${context}. Return as a JSON array of section titles.`
          );
          try {
            const content = outlineResponse.message?.content || '';
            return extractJSONFromMarkdown(content);
          } catch (err) {
            // If JSON extraction fails, try to split by lines
            const content = outlineResponse.message?.content || '';
            return { sections: content.split('\n').filter(line => line.trim()) };
          }
          
        case 'generate_section':
          const sectionResponse = await chatWithAI(context);
          return {
            content: sectionResponse.message?.content || ''
          };
          
        case 'enhance_text':
          const enhanceResponse = await chatWithAI(
            `Enhance and improve this text while maintaining its main points and length: ${context}`
          );
          return enhanceResponse.message?.content || context;
          
        case 'check_grammar':
          const grammarResponse = await chatWithAI(
            `Check this text for grammar and style issues. Return as JSON with corrections and explanations: ${context}`
          );
          try {
            const content = grammarResponse.message?.content || '';
            return extractJSONFromMarkdown(content);
          } catch (err) {
            setError('Failed to parse grammar check response');
            return { corrected: context, errors: [] };
          }
          
        case 'suggest_visuals':
          const visualsResponse = await suggestVisuals(context);
          return visualsResponse;
          
        default:
          setError(`Unknown AI action: ${action}`);
          return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform AI action';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateChart = useCallback(async (data: any, topic: string, chartType?: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = `
        Generate a ${chartType || 'chart'} based on this topic: "${topic}".
        Use this existing data structure as a starting point: ${JSON.stringify(data)}
        Enhance the data and return a complete chart configuration as JSON.
        Include title, axis labels, and improved data points if possible.
      `;
      
      const response = await chatWithAI(prompt);
      try {
        const content = response.message?.content || '';
        return extractJSONFromMarkdown(content);
      } catch (err) {
        setError('Failed to parse chart generation response');
        return data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate chart';
      setError(errorMessage);
      return data;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const enhanceTable = useCallback(async (tableData: any, topic: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = `
        Enhance this table data related to "${topic}".
        Current table data: ${JSON.stringify(tableData)}
        Return the improved table data as a JSON object with headers and rows.
        Add meaningful data and improve formatting.
      `;
      
      const response = await chatWithAI(prompt);
      try {
        const content = response.message?.content || '';
        return extractJSONFromMarkdown(content);
      } catch (err) {
        setError('Failed to parse table enhancement response');
        return tableData;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enhance table';
      setError(errorMessage);
      return tableData;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateDocumentFromTopic = useCallback(async (
    topic: string,
    documentType: DocumentType,
    sectionCount: number,
    contentLength: 'short' | 'medium' | 'long'
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Step 1: Generate an outline
      const outlinePrompt = `Create a ${sectionCount}-section outline for a ${contentLength} ${documentType} about: ${topic}. Return as JSON array of section titles.`;
      const outlineResponse = await chatWithAI(outlinePrompt);
      let sections: string[] = [];
      
      try {
        const outlineContent = outlineResponse.message?.content || '';
        const parsed = extractJSONFromMarkdown(outlineContent);
        sections = Array.isArray(parsed) ? parsed : parsed.sections || [];
      } catch (err) {
        // If JSON parsing fails, try to extract sections from text
        const content = outlineResponse.message?.content || '';
        sections = content.split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .slice(0, sectionCount);
      }
      
      if (sections.length === 0) {
        throw new Error('Failed to generate document outline');
      }
      
      // Step 2: Generate content for each section
      const blocks: Block[] = [];
      
      for (let i = 0; i < sections.length; i++) {
        // Add section heading
        blocks.push({
          id: `heading-${i}`,
          type: 'text',
          content: `# ${sections[i]}`
        });
        
        // Generate section content
        const sectionPrompt = `Write a ${contentLength} section about "${sections[i]}" for a ${documentType} about ${topic}`;
        const sectionResponse = await chatWithAI(sectionPrompt);
        const sectionContent = sectionResponse.message?.content || '';
        
        blocks.push({
          id: `content-${i}`,
          type: 'text',
          content: sectionContent
        });
        
        // Suggest visuals for this section
        const visualsResponse = await suggestVisuals(sectionContent);
        
        // Add any suggested images
        if (visualsResponse.images?.length) {
          // In a real implementation, we would generate actual images here
          // For now we'll just create placeholder blocks
          blocks.push({
            id: `image-${i}`,
            type: 'image',
            content: `Image placeholder for ${sections[i]}`
          });
        }
        
        // Add any suggested charts
        if (visualsResponse.charts?.length) {
          blocks.push({
            id: `chart-${i}`,
            type: 'chart',
            content: JSON.stringify({
              type: visualsResponse.charts[0].type || 'bar',
              data: visualsResponse.charts[0].data || [],
              options: visualsResponse.charts[0].options || {}
            })
          });
        }
        
        // Add any suggested tables
        if (visualsResponse.tables?.length) {
          blocks.push({
            id: `table-${i}`,
            type: 'data',
            content: JSON.stringify({
              headers: visualsResponse.tables[0].headers || [],
              rows: visualsResponse.tables[0].rows || [],
              caption: `Data for ${sections[i]}`
            })
          });
        }
      }
      
      return blocks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate document';
      setError(errorMessage);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleAIAssist = async (prompt: string, action: string) => {
    try {
      setIsGenerating(true);
      const response = await chatWithAI(prompt);
      return response.message?.content || '';
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    handleAIAction,
    generateChart,
    enhanceTable,
    generateDocumentFromTopic,
    handleAIAssist,
    isGenerating,
    error
  };
}