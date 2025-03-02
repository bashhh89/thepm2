import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { DocumentType } from '../../types/documents';

interface Template {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  structure: any;
}

interface DocumentTemplateSelectorProps {
  documentType: DocumentType;
  onSelect: (template: Template) => void;
  selectedTemplate: Template | null;
  topic?: string;
  sectionCount: number;
  contentLength: 'short' | 'medium' | 'long';
}

const DEFAULT_TEMPLATES: Record<DocumentType, Template[]> = {
  document: [
    {
      id: 'basic-doc',
      name: 'Basic Document',
      description: 'A simple document template with standard sections',
      type: 'document',
      structure: {
        sections: ['Introduction', 'Main Content', 'Conclusion']
      }
    },
    {
      id: 'research-doc',
      name: 'Research Paper',
      description: 'Academic research paper template with proper sections',
      type: 'document',
      structure: {
        sections: ['Abstract', 'Introduction', 'Methodology', 'Results', 'Discussion', 'Conclusion']
      }
    }
  ],
  presentation: [
    {
      id: 'basic-pres',
      name: 'Basic Presentation',
      description: 'Simple presentation template with key sections',
      type: 'presentation',
      structure: {
        sections: ['Title', 'Agenda', 'Content Slides', 'Summary']
      }
    },
    {
      id: 'pitch-deck',
      name: 'Pitch Deck',
      description: 'Startup pitch deck template with essential slides',
      type: 'presentation',
      structure: {
        sections: ['Problem', 'Solution', 'Market', 'Business Model', 'Team', 'Ask']
      }
    }
  ],
  webpage: [
    {
      id: 'basic-web',
      name: 'Basic Webpage',
      description: 'Simple webpage template with standard sections',
      type: 'webpage',
      structure: {
        sections: ['Header', 'Hero', 'Features', 'Contact']
      }
    },
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'Conversion-focused landing page template',
      type: 'webpage',
      structure: {
        sections: ['Hero', 'Benefits', 'Social Proof', 'Features', 'CTA']
      }
    }
  ]
};

export function DocumentTemplateSelector({
  documentType,
  onSelect,
  selectedTemplate,
  topic,
  sectionCount,
  contentLength
}: DocumentTemplateSelectorProps) {
  const [aiSuggestions, setAISuggestions] = useState<Template[]>([]);
  const { generateContent, isGenerating, error } = useAIAssistant();

  const generateTemplateFromTopic = async () => {
    if (!topic) return;

    try {
      const prompt = `Generate a ${documentType} template with exactly ${sectionCount} sections about: ${topic}. Content should be ${contentLength} in length. Return a clean JSON object (without markdown formatting) containing template structure, sections, and suggested content. Example format: {"structure": {"sections": ["Introduction", "Main Points", "Conclusion"], "suggestedContent": {"images": [], "charts": [], "tables": []}}}`;
      
      const response = await generateContent(prompt, 'text');

      if (response.content) {
        let templateData;
        
        try {
          templateData = typeof response.content === 'string' ? 
            JSON.parse(response.content) : 
            response.content;
        } catch {
          templateData = {
            structure: {
              sections: response.content.split('\n').filter(Boolean)
            }
          };
        }

        const template: Template = {
          id: 'ai-generated',
          name: 'AI Suggested Template',
          description: `Custom template generated for: ${topic}`,
          type: documentType,
          structure: templateData.structure || { sections: [] }
        };

        if (template.structure.sections.length > 0) {
          setAISuggestions([template]);
          onSelect(template); // Automatically select the generated template
        } else {
          throw new Error('Generated template has no sections');
        }
      }
    } catch (error) {
      console.error('Failed to generate template:', error);
      window.puter.ui.alert({
        title: 'Template Generation Failed',
        message: error instanceof Error ? error.message : 'Failed to generate template'
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Template</h3>

      {topic && (
        <Button
          variant="outline"
          className="w-full"
          onClick={generateTemplateFromTopic}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Template from Topic'}
        </Button>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {aiSuggestions.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-colors hover:border-primary ${
              selectedTemplate?.id === template.id ? 'border-primary' : ''
            }`}
            onClick={() => onSelect(template)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              {selectedTemplate?.id === template.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-primary"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">Sections:</p>
              <ul className="mt-1 text-sm text-muted-foreground">
                {template.structure.sections.map((section: string) => (
                  <li key={section}>{section}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}

        {DEFAULT_TEMPLATES[documentType].map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-colors hover:border-primary ${
              selectedTemplate?.id === template.id ? 'border-primary' : ''
            }`}
            onClick={() => onSelect(template)}
          >
            <div>
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">Sections:</p>
              <ul className="mt-1 text-sm text-muted-foreground">
                {template.structure.sections.map((section: string) => (
                  <li key={section}>{section}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}