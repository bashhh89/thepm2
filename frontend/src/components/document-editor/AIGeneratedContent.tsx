import React, { useState, useEffect } from 'react';
import { Block, DocumentType } from '../../types/documents';
import { Button } from '../Button';
import { Card } from '../Card';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { cn } from '../../lib/utils';
import { v4 as uuidv4 } from 'uuid';

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

  // Helper function for formatting JSON properly
  const formatJSON = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (err) {
      console.error("Error formatting JSON:", err);
      return JSON.stringify(obj);
    }
  };

  const generateInitialOutline = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const result = await handleAIAction('generate_outline', 
        `Create a ${sectionCount}-section outline for a ${contentLength} ${documentType} about: ${topic}`
      );
      
      if (!result) {
        throw new Error('Failed to generate outline');
      }
      
      let sections: string[] = [];
      
      if (typeof result === 'string') {
        sections = result.split('\n').filter(Boolean);
      } else if (result?.sections && Array.isArray(result.sections)) {
        sections = result.sections;
      }

      if (sections.length === 0) {
        throw new Error('No sections generated');
      }

      // Remove duplicates from sections
      sections = [...new Set(sections)];

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
        
        // Generate section content
        const result = await handleAIAction('generate_section', 
          `Write a ${contentLength} section about "${sections[i]}" for a ${documentType} about ${topic}`
        );

        // Add section heading
        blocks.push({
          id: uuidv4(),
          type: 'text',
          content: `# ${sections[i]}`,
          meta: {
            style: {
              fontSize: 'large',
              textAlign: 'left'
            }
          }
        });

        // Add section content
        if (result?.content) {
          blocks.push({
            id: uuidv4(),
            type: 'text',
            content: result.content,
            meta: {
              style: {
                fontSize: 'normal',
                textAlign: 'left'
              }
            }
          });
        }

        // Add any generated visuals
        if (result?.images?.length) {
          blocks.push(...result.images.map((url: string) => ({
            id: uuidv4(),
            type: 'image' as const,
            content: url,
            meta: {
              alt: `Image for ${sections[i]}`
            }
          })));
        }

        if (result?.charts?.length) {
          blocks.push(...result.charts.map((chart: any) => ({
            id: uuidv4(),
            type: 'chart' as const,
            content: formatJSON(chart),
            meta: {
              description: `Chart for ${sections[i]}`
            }
          })));
        }

        if (result?.tables?.length) {
          blocks.push(...result.tables.map((table: any) => ({
            id: uuidv4(),
            type: 'data' as const,
            content: formatJSON(table),
            meta: {
              caption: `Table for ${sections[i]}`
            }
          })));
        }
      }

      setGeneratedBlocks(blocks);
      
      if (blocks.length === 0) {
        throw new Error('No content generated');
      }

      setIsGenerating(false);
    } catch (error) {
      handleError(error);
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
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Generating {documentType} Content
          </h3>
          <p className="text-sm text-muted-foreground">
            Topic: {topic}
          </p>
        </div>

        {error ? (
          <div className="space-y-4">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleStartOver}>
                Try Again
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: outline.length ? 
                      `${((currentSection + 1) / outline.length) * 100}%` : 
                      '10%'
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {outline.length ? (
                  `Generating section ${currentSection + 1} of ${outline.length}: ${outline[currentSection]}`
                ) : (
                  'Creating outline...'
                )}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg divide-y">
              {outline.map((section, index) => (
                <div 
                  key={index}
                  className="p-3 flex items-center justify-between"
                >
                  <span>{section}</span>
                  <svg
                    className="w-5 h-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleContinueToEditor}>
                Continue to Editor
              </Button>
              <Button variant="outline" onClick={handleStartOver}>
                Generate Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}