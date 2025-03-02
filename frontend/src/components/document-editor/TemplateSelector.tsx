import React, { useState, useEffect } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { DocumentType, Template } from '../../types/documents';

interface TemplateSelectorProps {
  documentType: DocumentType;
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

export function TemplateSelector({ documentType, selectedTemplate, onSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Create templates directory if it doesn't exist
        try {
          await window.puter.fs.mkdir('/templates');
        } catch (error) {
          // Directory might already exist
        }

        // List all template files
        const files = await window.puter.fs.readdir('/templates');
        const templatePromises = files
          .filter(file => file.endsWith('.json'))
          .map(async (file) => {
            const content = await window.puter.fs.read(`/templates/${file}`);
            return JSON.parse(content);
          });

        const loadedTemplates = await Promise.all(templatePromises);
        setTemplates(loadedTemplates.filter(t => t.type === documentType));
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [documentType]);

  const handleSaveAsTemplate = async () => {
    try {
      const { name } = await window.puter.ui.prompt({
        title: 'Save as Template',
        message: 'Enter a name for this template:',
        defaultValue: 'My Template'
      });

      if (!name) return;

      // Save current content as a template
      const template: Template = {
        id: Date.now().toString(),
        name,
        type: documentType,
        content: [], // The parent component should provide current content
        createdAt: new Date().toISOString(),
        thumbnail: '', // Could be generated from content
        style_guide: {
          colors: ['#primary', '#secondary'],
          fonts: ['heading', 'body'],
          layouts: ['title', 'content', 'split']
        }
      };

      await window.puter.fs.write(
        `/templates/${template.id}.json`,
        JSON.stringify(template, null, 2)
      );

      setTemplates(prev => [...prev, template]);
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Templates</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveAsTemplate}
        >
          Save as Template
        </Button>
      </div>

      <div className="space-y-2">
        {templates.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No templates available
          </p>
        ) : (
          templates.map(template => (
            <Card
              key={template.id}
              className={cn(
                "p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                selectedTemplate?.id === template.id && "border-primary"
              )}
              onClick={() => onSelect(template)}
            >
              {template.thumbnail && (
                <div className="aspect-video rounded-sm bg-muted mb-2 overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-sm font-medium">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(template.createdAt).toLocaleDateString()}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}