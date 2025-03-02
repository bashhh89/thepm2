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
import { TranslationToolbar } from './TranslationToolbar';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { generateContent, enhanceContent, isGenerating, handleAIAction } = useAIAssistant();

  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) return;
      try {
        const file = await window.puter.fs.read(`/documents/${documentId}.json`);
        const docData = JSON.parse(file);
        setContent(docData.content);
        setSelectedTemplate(docData.template || null);
      } catch (error) {
        console.error('Failed to load document:', error);
      }
    };

    loadDocument();
  }, [documentId]);

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
    if (template.content) {
      setContent(template.content.map(block => ({
        ...block,
        id: Date.now().toString()
      })));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save document content to Puter.js filesystem
      const docData = {
        id: documentId || Date.now().toString(),
        type: documentType,
        content,
        template: selectedTemplate,
        updatedAt: new Date().toISOString()
      };

      // Ensure documents directory exists
      try {
        await window.puter.fs.mkdir('/documents');
      } catch (error) {
        // Directory might already exist
      }

      // Save the document
      await window.puter.fs.write(
        `/documents/${docData.id}.json`,
        JSON.stringify(docData, null, 2)
      );

      // Call the onSave callback
      await onSave(content);
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIAssist = async (action: string) => {
    const response = await handleAIAction(action, content);
    
    switch (action) {
      case 'suggest_improvements':
        window.puter.ui.alert({
          title: 'AI Suggestions',
          message: response.join('\n\n'),
          submitText: 'Apply All',
          cancelText: 'Close',
          onSubmit: async () => {
            const enhancedContent = await Promise.all(
              content.map(async block => ({
                ...block,
                content: await enhanceContent(block.content)
              }))
            );
            setContent(enhancedContent);
          }
        });
        break;

      case 'generate_section':
        if ('content' in response) {
          const newBlock: Block = {
            id: Date.now().toString(),
            type: 'text',
            content: response.content
          };
          setContent([...content, newBlock]);

          // Add any generated visuals
          if (response.images?.length) {
            setContent(prev => [
              ...prev,
              ...response.images.map(img => ({
                id: Date.now().toString(),
                type: 'image',
                content: img
              }))
            ]);
          }
          if (response.charts?.length) {
            setContent(prev => [
              ...prev,
              ...response.charts.map(chart => ({
                id: Date.now().toString(),
                type: 'chart',
                content: JSON.stringify(chart)
              }))
            ]);
          }
          if (response.tables?.length) {
            setContent(prev => [
              ...prev,
              ...response.tables.map(table => ({
                id: Date.now().toString(),
                type: 'data',
                content: JSON.stringify(table)
              }))
            ]);
          }
        }
        break;

      case 'add_visuals':
        const { images, charts, tables } = response;
        const newBlocks: Block[] = [
          ...(images || []).map(img => ({
            id: Date.now().toString(),
            type: 'image' as const,
            content: img
          })),
          ...(charts || []).map(chart => ({
            id: Date.now().toString(),
            type: 'chart' as const,
            content: JSON.stringify(chart)
          })),
          ...(tables || []).map(table => ({
            id: Date.now().toString(),
            type: 'data' as const,
            content: JSON.stringify(table)
          }))
        ];
        setContent([...content, ...newBlocks]);
        break;

      case 'create_summary':
        const summary: Block = {
          id: Date.now().toString(),
          type: 'text',
          content: response as string
        };
        setContent([summary, ...content]);
        break;

      case 'enhance_style':
        setContent(await Promise.all(
          content.map(async block => ({
            ...block,
            content: block.type === 'text' ? 
              await enhanceContent(block.content, 'more professional and engaging') :
              block.content
          }))
        ));
        break;
    }
  };

  const handleTranslate = async (translatedBlocks: any[]) => {
    setIsTranslating(true);
    try {
      setContent(translatedBlocks);
    } catch (error) {
      console.error('Translation update failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAIEnhance = async (blockId: string) => {
    const block = content.find(b => b.id === blockId);
    if (!block) return;

    try {
      const enhanced = await handleAIAction('enhance_style', block.content);
      if (enhanced) {
        setContent(content.map(b => 
          b.id === blockId ? { ...b, content: enhanced } : b
        ));
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
    }
  };

  const handleAIVisuals = async (blockId: string) => {
    const block = content.find(b => b.id === blockId);
    if (!block) return;

    try {
      const visuals = await handleAIAction('add_visuals', block.content);
      if (visuals) {
        const newBlocks = [];
        
        if (visuals.images?.length) {
          newBlocks.push(...visuals.images.map((img: string) => ({
            id: Date.now().toString() + Math.random(),
            type: 'image',
            content: img
          })));
        }

        if (visuals.charts?.length) {
          newBlocks.push(...visuals.charts.map((chart: any) => ({
            id: Date.now().toString() + Math.random(),
            type: 'chart',
            content: JSON.stringify(chart)
          })));
        }

        if (visuals.tables?.length) {
          newBlocks.push(...visuals.tables.map((table: any) => ({
            id: Date.now().toString() + Math.random(),
            type: 'data',
            content: JSON.stringify(table)
          })));
        }

        // Insert new blocks after the current block
        const blockIndex = content.findIndex(b => b.id === blockId);
        const updatedContent = [
          ...content.slice(0, blockIndex + 1),
          ...newBlocks,
          ...content.slice(blockIndex + 1)
        ];
        setContent(updatedContent);
      }
    } catch (error) {
      console.error('Visual generation failed:', error);
    }
  };

  const handleBlockEdit = (blockId: string, newContent: string) => {
    setContent(content.map(block =>
      block.id === blockId ? { ...block, content: newContent } : block
    ));
  };

  const handleBlockDelete = (blockId: string) => {
    setContent(content.filter(block => block.id !== blockId));
  };

  const handleBlockMove = (blockId: string, direction: 'up' | 'down') => {
    const index = content.findIndex(block => block.id === blockId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === content.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newContent = [...content];
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    setContent(newContent);
  };

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'text':
        return (
          <Card key={block.id} className="p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIEnhance(block.id)}
                  disabled={isGenerating}
                >
                  Enhance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIVisuals(block.id)}
                  disabled={isGenerating}
                >
                  Add Visuals
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockMove(block.id, 'up')}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockMove(block.id, 'down')}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockDelete(block.id)}
                >
                  ×
                </Button>
              </div>
            </div>
            <textarea
              className="w-full p-2 rounded-md border bg-background resize-y"
              value={block.content}
              onChange={(e) => handleBlockEdit(block.id, e.target.value)}
              rows={5}
            />
          </Card>
        );

      case 'image':
        return (
          <Card key={block.id} className="p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Image</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockMove(block.id, 'up')}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockMove(block.id, 'down')}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockDelete(block.id)}
                >
                  ×
                </Button>
              </div>
            </div>
            <img
              src={block.content}
              alt="Generated content"
              className="max-w-full h-auto rounded-md"
            />
          </Card>
        );

      case 'chart':
      case 'data':
        return (
          <Card key={block.id} className="p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {block.type === 'chart' ? 'Chart' : 'Data Table'}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockMove(block.id, 'up')}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockMove(block.id, 'down')}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlockDelete(block.id)}
                >
                  ×
                </Button>
              </div>
            </div>
            <pre className="bg-muted p-2 rounded-md overflow-x-auto">
              {block.content}
            </pre>
          </Card>
        );

      default:
        return null;
    }
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
        <div className="sticky top-0 z-50 bg-background border-b p-4 space-y-4">
          <div className="flex items-center justify-between">
            <DocumentToolbar 
              onSave={handleSave} 
              onPublish={onPublish}
              isSaving={isSaving}
              onAIAssist={handleAIAssist}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBlockAdd('text')}
              >
                Add Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBlockAdd('image')}
              >
                Add Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBlockAdd('chart')}
              >
                Add Chart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBlockAdd('data')}
              >
                Add Table
              </Button>
            </div>

            <TranslationToolbar
              blocks={content}
              onTranslate={handleTranslate}
              isTranslating={isTranslating}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8" ref={editorRef}>
          <div className="max-w-4xl mx-auto space-y-4">
            {content.map((block, index) => (
              <div key={block.id} className="relative group">
                <ContentBlock
                  key={block.id}
                  block={block}
                  isSelected={selectedBlock === block.id}
                  onSelect={() => setSelectedBlock(block.id)}
                  onChange={(content) => handleBlockUpdate(block.id, content)}
                  onEnhance={() => handleBlockEnhance(block.id)}
                  documentType={documentType}
                />
                
                {selectedBlock === block.id && (
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockMove(block.id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockMove(block.id, 'down')}
                      disabled={index === content.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockDelete(block.id)}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {content.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Add some content to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CollaborationPanel documentId={documentId} />
    </div>
  );
}