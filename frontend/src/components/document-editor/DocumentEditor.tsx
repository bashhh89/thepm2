import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { cn } from '../../lib/utils';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { DocumentToolbar } from './DocumentToolbar';
import { ContentBlock } from './ContentBlock';
import { TemplateSelector } from './TemplateSelector';
import { CollaborationPanel } from './CollaborationPanel';
import { DocumentType, Template, Block } from '../../types/documents';

interface DocumentEditorProps {
  documentId?: string;
  initialContent?: Block[];
  documentType: DocumentType;
  onSave: (content: Block[]) => Promise<void>;
  onPublish?: () => Promise<void>;
}

export function DocumentEditor({
  documentId,
  initialContent = [],
  documentType,
  onSave,
  onPublish
}: DocumentEditorProps) {
  const [content, setContent] = useState<Block[]>(initialContent);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { generateContent, enhanceContent, isGenerating } = useAIAssistant();

  const handleBlockAdd = async (type: 'text' | 'image' | 'chart' | 'data', prompt?: string) => {
    if (prompt) {
      const generatedContent = await generateContent(prompt, type);
      setContent([...content, { id: Date.now().toString(), type, content: generatedContent }]);
    } else {
      setContent([...content, { id: Date.now().toString(), type, content: '' }]);
    }
  };

  const handleBlockUpdate = (blockId: string, newContent: string) => {
    setContent(content.map(block => 
      block.id === blockId ? { ...block, content: newContent } : block
    ));
  };

  const handleBlockEnhance = async (blockId: string) => {
    const block = content.find(b => b.id === blockId);
    if (!block) return;

    const enhanced = await enhanceContent(block.content);
    handleBlockUpdate(blockId, enhanced);
  };

  const handleTemplateApply = (template: Template) => {
    setSelectedTemplate(template);
    // Apply template styling and layout
  };

  const handleSave = async () => {
    await onSave(content);
  };

  return (
    <div className="flex h-full">
      <div className="w-64 border-r p-4 space-y-4">
        <TemplateSelector
          documentType={documentType}
          onSelect={handleTemplateApply}
          selectedTemplate={selectedTemplate}
        />
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Add Content</h3>
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleBlockAdd('text')}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Text
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleBlockAdd('image')}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Image
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleBlockAdd('chart')}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Chart
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <DocumentToolbar onSave={handleSave} onPublish={onPublish} />
        
        <div className="flex-1 overflow-y-auto p-8" ref={editorRef}>
          <div className="max-w-4xl mx-auto space-y-4">
            {content.map((block, index) => (
              <ContentBlock
                key={block.id}
                block={block}
                isSelected={selectedBlock === block.id}
                onSelect={() => setSelectedBlock(block.id)}
                onChange={(content) => handleBlockUpdate(block.id, content)}
                onEnhance={() => handleBlockEnhance(block.id)}
                documentType={documentType}
              />
            ))}
          </div>
        </div>
      </div>

      <CollaborationPanel documentId={documentId} />
    </div>
  );
}