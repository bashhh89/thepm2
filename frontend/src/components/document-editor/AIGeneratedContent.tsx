import React, { useState, useEffect } from 'react';
import { Block, DocumentType } from '../../types/documents';
import { Button } from '../Button';
import { Card } from '../Card';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { cn } from '../../lib/utils';

interface AIGeneratedContentProps {
  topic: string;
  documentType: DocumentType;
  onGenerated: (blocks: Block[]) => void;
  onCancel: () => void;
  sectionCount: number;
  contentLength: 'short' | 'medium' | 'long';
}

export function AIGeneratedContent({
  topic,
  documentType,
  onGenerated,
  onCancel,
  sectionCount,
  contentLength
}: AIGeneratedContentProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [outline, setOutline] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [generatedBlocks, setGeneratedBlocks] = useState<Block[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { handleAIAction } = useAIAssistant();

  useEffect(() => {
    generateInitialOutline();
  }, []);

  const handleError = (error: any) => {
    console.error('Generation error:', error);
    setError(error instanceof Error ? error.message : 'Failed to generate content');
    setIsGenerating(false);
  };

  const generateInitialOutline = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // First check if Puter.js is loaded
      if (!window.puter?.ai) {
        throw new Error('AI service is not available. Please try again.');
      }

      const result = await handleAIAction('generate_outline', `Create a ${sectionCount}-section outline for a ${contentLength} ${documentType} about: ${topic}`);
      
      if (!result) {
        throw new Error('Failed to generate outline. Please try again.');
      }
      
      let sections: string[] = [];
      
      if (typeof result === 'string') {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed.sections)) {
            sections = parsed.sections;
          } else {
            // If no sections array, split by newlines
            sections = result.split('\n').filter(line => line.trim());
          }
        } catch (e) {
          // If parsing failed, split the string into sections
          sections = result.split('\n').filter(line => line.trim());
        }
      } else if (result?.sections && Array.isArray(result.sections)) {
        sections = result.sections;
      }

      if (sections.length === 0) {
        throw new Error('No outline sections generated');
      }

      setOutline(sections);
      await generateSections(sections);
    } catch (error) {
      handleError(error);
    }
  };

  const generateSections = async (sections: string[]) => {
    try {
      const blocks: Block[] = [];
      
      for (let i = 0; i < sections.length; i++) {
        setCurrentSection(i);
        const sectionTitle = sections[i];
        
        const prompt = `Generate ${contentLength} content for section "${sectionTitle}" of a ${documentType} about: ${topic}. Include relevant examples, data, and explanations.`;
        
        const response = await handleAIAction('generate_section', prompt);

        if (!response) {
          throw new Error('Failed to generate section content');
        }

        let sectionContent = '';
        let images: string[] = [];
        let charts: any[] = [];
        let tables: any[] = [];

        if (typeof response === 'string') {
          sectionContent = response;
        } else if (typeof response === 'object') {
          sectionContent = response.content || '';
          images = response.images || [];
          charts = response.charts || [];
          tables = response.tables || [];
        }

        // Add the main content block
        if (sectionContent) {
          blocks.push({
            id: Date.now().toString() + i,
            type: 'text',
            content: `## ${sectionTitle}\n\n${sectionContent}`
          });
        }

        // Add any generated images
        if (images?.length) {
          for (const imgPrompt of images) {
            try {
              const imgUrl = await window.puter.ai.generateImage({
                prompt: imgPrompt,
                size: '512x512'
              });
              if (imgUrl?.url) {
                blocks.push({
                  id: Date.now().toString() + i + '_img_' + Math.random(),
                  type: 'image',
                  content: imgUrl.url
                });
              }
            } catch (imgError) {
              console.error('Failed to generate image:', imgError);
              // Continue with other content even if image generation fails
            }
          }
        }

        // Add any generated charts
        if (charts?.length) {
          charts.forEach((chart: any, chartIndex: number) => {
            blocks.push({
              id: Date.now().toString() + i + '_chart_' + chartIndex,
              type: 'chart',
              content: JSON.stringify(chart)
            });
          });
        }

        // Add any generated tables
        if (tables?.length) {
          tables.forEach((table: any, tableIndex: number) => {
            blocks.push({
              id: Date.now().toString() + i + '_table_' + tableIndex,
              type: 'data',
              content: JSON.stringify(table)
            });
          });
        }

        // Update blocks after each section is generated
        setGeneratedBlocks([...blocks]);
      }

      setGeneratedBlocks(blocks);
      
      if (blocks.length === 0) {
        throw new Error('No content was generated');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinueToEditor = () => {
    if (generatedBlocks.length > 0) {
      onGenerated(generatedBlocks);
    }
  };

  const handleStartOver = () => {
    setGeneratedBlocks([]);
    setOutline([]);
    setCurrentSection(0);
    setError(null);
    setIsGenerating(true);
    generateInitialOutline();
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Generating {documentType}</h2>
          <Button variant="ghost" onClick={onCancel} disabled={isGenerating}>
            Cancel
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Outline:</h3>
          <ul className="space-y-2">
            {outline.map((section, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-2 p-2 rounded",
                  index === currentSection && isGenerating
                    ? "bg-primary/10"
                    : index < currentSection
                    ? "text-muted-foreground"
                    : ""
                )}
              >
                {index < currentSection ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : index === currentSection && isGenerating ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <div className="w-4 h-4" />
                )}
                {section}
              </li>
            ))}
          </ul>

          {isGenerating && outline.length > 0 && (
            <div className="text-sm text-muted-foreground animate-pulse">
              Generating content for section {currentSection + 1} of {outline.length}...
            </div>
          )}
        </div>

        {!isGenerating && generatedBlocks.length > 0 && (
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleStartOver}>
              Start Over
            </Button>
            <Button onClick={handleContinueToEditor}>
              Continue to Editor
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}