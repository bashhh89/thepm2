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
  layout?: string;
  style?: string;
}

interface DocumentTemplateSelectorProps {
  documentType: DocumentType;
  onSelect: (template: Template) => void;
  selectedTemplate: Template | null;
  topic?: string;
  sectionCount: number;
  contentLength: 'short' | 'medium' | 'long';
}

const DOCUMENT_TYPE_CONFIG = {
  document: {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    description: "Create a formatted text document with sections, headings, and rich content",
    defaultSections: ['Introduction', 'Main Content', 'Conclusion']
  },
  presentation: {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    description: "Design a slide deck with visual elements and focused content per slide",
    defaultSections: ['Title Slide', 'Content Slides', 'Summary Slide']
  },
  webpage: {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    description: "Build a responsive web page with interactive components and sections",
    defaultSections: ['Hero', 'Features', 'Call to Action']
  }
};

const DEFAULT_TEMPLATES: Record<DocumentType, Template[]> = {
  document: [
    {
      id: 'business-report',
      name: 'Business Report',
      description: 'Professional report template with executive summary and recommendations',
      type: 'document',
      structure: {
        sections: [
          'Executive Summary',
          'Introduction',
          'Market Analysis',
          'Findings',
          'Recommendations',
          'Conclusion'
        ]
      },
      style: 'professional',
      layout: 'standard'
    },
    {
      id: 'research-paper',
      name: 'Research Paper',
      description: 'Academic research paper with methodology and citations',
      type: 'document',
      structure: {
        sections: [
          'Abstract',
          'Introduction',
          'Literature Review',
          'Methodology',
          'Results',
          'Discussion',
          'Conclusion'
        ]
      },
      style: 'academic'
    }
  ],
  presentation: [
    {
      id: 'pitch-deck',
      name: 'Pitch Deck',
      description: 'Startup pitch deck with compelling story flow',
      type: 'presentation',
      structure: {
        sections: [
          'Problem',
          'Solution',
          'Market Size',
          'Business Model',
          'Traction',
          'Team',
          'Competition',
          'Financials',
          'Ask'
        ]
      },
      layout: 'modern',
      style: 'bold'
    },
    {
      id: 'product-launch',
      name: 'Product Launch',
      description: 'Product presentation with features and benefits',
      type: 'presentation',
      structure: {
        sections: [
          'Introduction',
          'Market Need',
          'Product Overview',
          'Key Features',
          'Benefits',
          'Demo',
          'Pricing',
          'Next Steps'
        ]
      },
      layout: 'dynamic',
      style: 'minimal'
    }
  ],
  webpage: [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'High-conversion landing page with clear CTA sections',
      type: 'webpage',
      structure: {
        sections: [
          'Hero',
          'Value Proposition',
          'Features',
          'Social Proof',
          'Pricing',
          'FAQ',
          'CTA'
        ]
      },
      layout: 'responsive',
      style: 'modern'
    },
    {
      id: 'company-site',
      name: 'Company Website',
      description: 'Professional company website with comprehensive sections',
      type: 'webpage',
      structure: {
        sections: [
          'Home',
          'About',
          'Services',
          'Portfolio',
          'Team',
          'Blog',
          'Contact'
        ]
      },
      layout: 'classic',
      style: 'corporate'
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
  const [filter, setFilter] = useState<string>('');

  const generateTemplateFromTopic = async () => {
    if (!topic) return;

    try {
      const prompt = `Generate a ${documentType} template with ${sectionCount} sections about: ${topic}. Content should be ${contentLength} in length. Return as JSON with structure: {"name": string, "description": string, "structure": {"sections": string[]}, "style": string, "layout"?: string}`;
      
      const response = await generateContent(prompt, 'template');

      if (response && typeof response === 'object') {
        const template: Template = {
          id: 'ai-generated',
          type: documentType,
          ...response
        };

        if (template.structure?.sections?.length > 0) {
          setAISuggestions([template]);
          onSelect(template);
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

  const filteredTemplates = [...aiSuggestions, ...DEFAULT_TEMPLATES[documentType]].filter(
    template => !filter || 
      template.name.toLowerCase().includes(filter.toLowerCase()) ||
      template.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          {DOCUMENT_TYPE_CONFIG[documentType].icon}
          <div>
            <h3 className="text-lg font-semibold capitalize">
              {documentType} Templates
            </h3>
            <p className="text-sm text-muted-foreground">
              {DOCUMENT_TYPE_CONFIG[documentType].description}
            </p>
          </div>
        </div>
        {topic && (
          <Button
            variant="outline"
            onClick={generateTemplateFromTopic}
            disabled={isGenerating}
            className="min-w-[150px]"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate from Topic'
            )}
          </Button>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          className="w-full p-2 pl-8 rounded-md border bg-background"
          placeholder={`Search ${documentType} templates...`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <svg
          className="w-4 h-4 absolute left-2 top-3 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(template)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                {template.style && (
                  <p className="text-xs text-primary">Style: {template.style}</p>
                )}
                {template.layout && (
                  <p className="text-xs text-primary">Layout: {template.layout}</p>
                )}
              </div>
              {selectedTemplate?.id === template.id && (
                <svg
                  className="w-5 h-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            
            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-medium mb-2">Structure:</p>
              <div className="grid grid-cols-1 gap-2">
                {template.structure.sections.map((section: string, index: number) => (
                  <div
                    key={section}
                    className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded flex items-center gap-2"
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </span>
                    {section}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-muted/5 rounded-lg">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try a different search term or generate a template from your topic
          </p>
        </div>
      )}
    </div>
  );
}