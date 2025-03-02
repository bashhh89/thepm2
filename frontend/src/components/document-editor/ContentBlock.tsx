import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { ChartBlock } from './ChartBlock';
import { DataTable } from './DataTable';
import { DocumentType } from '../../types/documents';
import { useAIAssistant } from '../../hooks/useAIAssistant';

interface ContentBlockProps {
  block: {
    id: string;
    type: string;
    content: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onChange: (content: string) => void;
  onEnhance: () => void;
  documentType: DocumentType;
}

export function ContentBlock({
  block,
  isSelected,
  onSelect,
  onChange,
  onEnhance,
  documentType
}: ContentBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { handleAIAction, isGenerating } = useAIAssistant();

  const handleEnhance = async () => {
    if (block.type !== 'text') return;
    try {
      const enhanced = await handleAIAction('enhance_style', block.content);
      if (typeof enhanced === 'string') {
        onChange(enhanced);
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
    }
  };

  const handleVisualSuggestions = async () => {
    if (block.type !== 'text') return;
    try {
      const suggestions = await handleAIAction('add_visuals', block.content);
      if (suggestions && typeof suggestions === 'object') {
        // Handle visual suggestions through parent component
        onEnhance();
      }
    } catch (error) {
      console.error('Visual suggestions failed:', error);
    }
  };

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        // Parse the content if it's a JSON string containing title/content structure
        let displayContent = block.content;
        try {
          const parsed = JSON.parse(block.content);
          if (parsed && typeof parsed === 'object' && 'content' in parsed) {
            displayContent = parsed.title ? `${parsed.title}\n\n${parsed.content}` : parsed.content;
          }
        } catch {
          // If parsing fails, use the content as is
        }

        return (
          <div 
            className="relative group"
            onClick={onSelect}
          >
            {isEditing ? (
              <textarea
                className="w-full p-3 rounded-md border bg-background resize-y min-h-[100px]"
                value={displayContent}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                onClick={() => setIsEditing(true)}
              >
                {displayContent}
              </div>
            )}
            
            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1 rounded-md flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnhance();
                }}
                disabled={isGenerating}
              >
                ✨ Enhance
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVisualSuggestions();
                }}
                disabled={isGenerating}
              >
                📊 Add Visuals
              </Button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="relative group">
            <img
              src={block.content}
              alt="Content"
              className="max-w-full h-auto rounded-md"
            />
          </div>
        );

      case 'chart':
        try {
          const chartData = JSON.parse(block.content);
          return (
            <ChartBlock
              data={chartData}
              onChange={(data) => onChange(JSON.stringify(data))}
              onEnhance={onEnhance}
              isEditing={isSelected}
            />
          );
        } catch {
          return <div>Invalid chart data</div>;
        }

      case 'data':
        try {
          const tableData = JSON.parse(block.content);
          return (
            <DataTable
              data={tableData}
              onChange={(data) => onChange(JSON.stringify(data))}
              onEnhance={onEnhance}
              isEditing={isSelected}
            />
          );
        } catch {
          return <div>Invalid table data</div>;
        }

      default:
        return <div>Unsupported block type</div>;
    }
  };

  return (
    <Card 
      className={`p-4 transition-colors ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      {renderContent()}
    </Card>
  );
}