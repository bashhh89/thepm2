import React from 'react';
import { Block } from '../../types/documents';

// Common style definitions
export const styles = {
  container: {
    base: 'document-editor relative h-full flex flex-col',
    content: 'flex-1 overflow-y-auto p-4',
    documentContainer: (isWebpage: boolean) => `document-container mx-auto ${isWebpage ? 'max-w-full' : 'max-w-3xl'}`,
  },
  block: {
    container: 'relative group my-2 py-1',
    active: 'is-active',
    presentation: 'h-full',
    toolbar: 'absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity',
    button: 'h-6 text-xs px-1 rounded border bg-transparent',
  },
  emptyState: {
    container: 'flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-muted rounded-lg p-8',
    title: 'text-xl font-medium mb-2',
    description: 'text-muted-foreground mb-8',
    actions: 'flex gap-4'
  }
};

// Document section templates
export const DOCUMENT_TEMPLATES = {
  business: ['Executive Summary', 'Introduction', 'Market Analysis', 'Findings', 'Recommendations', 'Conclusion'],
  research: ['Abstract', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion'],
  proposal: ['Overview', 'Problem Statement', 'Proposed Solution', 'Implementation Plan', 'Budget', 'Timeline', 'Conclusion']
} as const;

// Default block creation helper
export const createDefaultBlock = (type: Block['type'] = 'text'): Block => ({
  id: crypto.randomUUID(),
  type,
  content: '',
  meta: { style: { fontSize: 'normal', textAlign: 'left' } }
});

// Common block operation handlers factory
export const createBlockOperations = (
  blocks: Block[],
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  setActiveBlockId: (id: string | null) => void
) => ({
  add: (type: Block['type'], index: number) => {
    const newBlock = createDefaultBlock(type);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setActiveBlockId(newBlock.id);
    setTimeout(() => document.getElementById(`block-${newBlock.id}`)?.focus(), 0);
  },
  delete: (id: string) => {
    if (blocks.length <= 1) return;
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;
    
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    setActiveBlockId(newBlocks[Math.max(0, index - 1)]?.id || null);
  },
  update: (id: string, content: string, meta?: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content, meta: { ...block.meta, ...meta } } : block
    ));
  },
  move: (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(blocks.length - 1, index + 1);
    if (index === newIndex) return;
    
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, movedBlock);
    setBlocks(newBlocks);
  }
});