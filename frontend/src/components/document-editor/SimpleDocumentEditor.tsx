import React, { useState, useEffect } from 'react';
import { Block, DocumentType } from '../../types/documents';
import { ContentBlock } from './ContentBlock';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../../lib/utils';

interface SimpleDocumentEditorProps {
  initialBlocks?: Block[];
  documentType: DocumentType;
  readOnly?: boolean;
}

const defaultTextStyle = {
  fontSize: 'normal' as const,
  textAlign: 'left' as const
};

export function SimpleDocumentEditor({
  initialBlocks,
  documentType = 'document',
  readOnly = false
}: SimpleDocumentEditorProps): JSX.Element {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks || [{
    id: uuidv4(),
    type: 'text',
    content: '# Untitled Document\n\nStart writing here...',
    meta: { style: defaultTextStyle }
  }]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  useEffect(() => {
    if (initialBlocks?.length) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  const blockOperations = {
    add: (type: Block['type'], index: number) => {
      const newBlock: Block = {
        id: uuidv4(),
        type,
        content: '',
        meta: { style: defaultTextStyle }
      };
      setBlocks(prev => {
        const newBlocks = [...prev];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      });
      setActiveBlockId(newBlock.id);
    },

    delete: (id: string) => {
      if (blocks.length <= 1) return;
      const index = blocks.findIndex(block => block.id === id);
      if (index === -1) return;
      
      setBlocks(prev => prev.filter(block => block.id !== id));
      setActiveBlockId(blocks[Math.max(0, index - 1)]?.id || null);
    },

    update: (id: string, content: string, meta?: any) => {
      setBlocks(prev => prev.map(block => 
        block.id === id ? { ...block, content, meta: { ...block.meta, ...meta } } : block
      ));
    },

    move: (id: string, direction: 'up' | 'down') => {
      const index = blocks.findIndex(block => block.id === id);
      if (index === -1) return;
      
      const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(blocks.length - 1, index + 1);
      if (index === newIndex) return;
      
      setBlocks(prev => {
        const newBlocks = [...prev];
        const [movedBlock] = newBlocks.splice(index, 1);
        newBlocks.splice(newIndex, 0, movedBlock);
        return newBlocks;
      });
    }
  };

  return (
    <div className="document-editor relative h-full flex flex-col">
      <div className={cn(
        'document-container mx-auto',
        documentType === 'webpage' ? 'max-w-full' : 'max-w-3xl'
      )}>
        {blocks.map((block) => (
          <ContentBlock
            key={block.id}
            block={block}
            isActive={activeBlockId === block.id}
            onChange={(content, meta) => blockOperations.update(block.id, content, meta)}
            onDelete={() => blockOperations.delete(block.id)}
            onMoveUp={() => blockOperations.move(block.id, 'up')}
            onMoveDown={() => blockOperations.move(block.id, 'down')}
            onAddAfter={(type) => blockOperations.add(type, blocks.indexOf(block))}
            onFocus={() => setActiveBlockId(block.id)}
            isEditing={!readOnly}
            presentationMode={documentType === 'presentation'}
          />
        ))}
      </div>
    </div>
  );
} 