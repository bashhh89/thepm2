import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { ChartBlock } from './ChartBlock';
import { DataTable } from './DataTable';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { Block } from '../../types/documents';
import ReactMarkdown from 'react-markdown';

interface ContentBlockProps {
  block: Block;
  isActive: boolean;
  onChange: (content: string, meta?: any) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddAfter?: (type: Block['type']) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onEnhance?: () => void;
  isEditing: boolean;
  presentationMode?: boolean;
}

// Common styling classes
const commonButtonStyles = "h-6 text-xs px-1 rounded border bg-transparent";
const blockContainerStyles = (isActive: boolean, presentationMode: boolean) => 
  `content-block relative ${isActive ? 'is-active' : ''} ${presentationMode ? 'presentation-block h-full' : 'my-2 py-1'}`;

export function ContentBlock({
  block,
  isActive,
  onChange,
  onKeyDown,
  onFocus,
  onEnhance,
  isEditing,
  presentationMode = false
}: ContentBlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(!block.content);
  const { isGenerating } = useAIAssistant();
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>(presentationMode ? 'preview' : 'edit');

  useEffect(() => {
    if (contentRef.current && isActive && isEditing && viewMode === 'edit') {
      contentRef.current.focus();
    }
  }, [isActive, isEditing, viewMode]);

  // Utility functions
  const safeParseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  const formatJSON = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return JSON.stringify(obj);
    }
  };

  // Event handlers
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText || '';
    setShowPlaceholder(!content);
    onChange(content);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', `/uploads/${Date.now()}-${file.name}`);

      const response = await fetch('/api/puter/write', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Upload failed');

      const fileUrl = `/uploads/${file.name}`;
      onChange(fileUrl);
      if (onEnhance) onEnhance();
    } catch (error) {
      console.error('Image upload failed:', error);
      const imageUrl = URL.createObjectURL(file);
      onChange(imageUrl);
    }
  };

  // Common block components
  const BlockToolbar = () => (
    <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-1">
        {viewMode === 'edit' ? (
          <Button size="sm" variant="ghost" onClick={() => setViewMode('preview')} className="h-6 w-6 p-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setViewMode('edit')} className="h-6 w-6 p-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </Button>
        )}
        {onEnhance && (
          <Button size="sm" variant="ghost" onClick={onEnhance} disabled={isGenerating} className="h-6 w-6 p-0" title="Enhance with AI">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </Button>
        )}
        <select
          className={commonButtonStyles}
          value={block.meta?.style?.fontSize || 'normal'}
          onChange={(e) => onChange(block.content, { style: { ...block.meta?.style, fontSize: e.target.value } })}
        >
          <option value="small">Small</option>
          <option value="normal">Normal</option>
          <option value="large">Large</option>
        </select>
        <select
          className={commonButtonStyles}
          value={block.meta?.style?.textAlign || 'left'}
          onChange={(e) => onChange(block.content, { style: { ...block.meta?.style, textAlign: e.target.value } })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );

  // Block type specific renderers
  const renderTextBlock = () => {
    if (viewMode === 'preview' || !isEditing) {
      return (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{block.content}</ReactMarkdown>
        </div>
      );
    }

    return (
      <>
        <div
          ref={contentRef}
          id={`block-${block.id}`}
          className={`outline-none ${presentationMode ? 'text-xl' : ''}`}
          contentEditable={isEditing && viewMode === 'edit'}
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: block.content }}
          style={{
            fontSize: block.meta?.style?.fontSize === 'large' ? '1.25rem' : 
                     block.meta?.style?.fontSize === 'small' ? '0.875rem' : '1rem',
            textAlign: block.meta?.style?.textAlign || 'left'
          }}
        />
        {showPlaceholder && (
          <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground opacity-60">
            Type something...
          </div>
        )}
      </>
    );
  };

  const renderImageBlock = () => {
    if (block.content) {
      return (
        <div className={`image-container ${presentationMode ? 'h-full' : ''}`}>
          <img 
            src={block.content} 
            alt={block.meta?.alt || 'Image'} 
            className="max-w-full max-h-[500px] object-contain rounded-md mx-auto"
          />
          {block.meta?.description && !presentationMode && (
            <div className="mt-2 text-sm text-muted-foreground text-center italic">
              {block.meta.description}
            </div>
          )}
          {isEditing && !presentationMode && (
            <div className="mt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => onChange('')}>
                Remove
              </Button>
              {onEnhance && (
                <Button size="sm" variant="outline" onClick={onEnhance} disabled={isGenerating}>
                  {isGenerating ? 'Analyzing...' : 'Analyze Image'}
                </Button>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="image-upload-container border-2 border-dashed border-muted rounded-md p-8 text-center">
        <input
          type="file"
          id={`image-upload-${block.id}`}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <div className="space-y-4">
          <div className="text-muted-foreground">
            <svg className="mx-auto w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <label htmlFor={`image-upload-${block.id}`} className="cursor-pointer text-primary hover:text-primary/80">
              Upload an image
            </label>
            <p className="text-sm text-muted-foreground mt-1">
              or paste an image URL below
            </p>
          </div>
          <div>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border rounded-md"
              value={block.content}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderChartBlock = () => {
    const chartData = safeParseJSON(block.content) || {
      type: 'bar',
      data: [],
      options: { title: 'New Chart' }
    };

    return (
      <ChartBlock
        data={chartData}
        onChange={(data) => onChange(formatJSON(data))}
        onEnhance={onEnhance}
        isEditing={isEditing}
      />
    );
  };

  const renderDataBlock = () => {
    const tableData = safeParseJSON(block.content) || {
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [['', '', '']],
      caption: 'New Table'
    };

    return (
      <DataTable
        data={tableData}
        onChange={(data) => onChange(formatJSON(data))}
        onEnhance={onEnhance}
        isEditing={isEditing}
      />
    );
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text': return renderTextBlock();
      case 'image': return renderImageBlock();
      case 'chart': return renderChartBlock();
      case 'data': return renderDataBlock();
      default: return <div>Unsupported block type: {block.type}</div>;
    }
  };

  return (
    <div className={blockContainerStyles(isActive, presentationMode)}>
      {!presentationMode && isEditing && block.type === 'text' && <BlockToolbar />}
      {renderBlockContent()}
    </div>
  );
}