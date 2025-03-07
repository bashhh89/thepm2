import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../Button';
import { DocumentToolbar } from './DocumentToolbar';
import { ContentBlock } from './ContentBlock';
import { CollaborationPanel } from './CollaborationPanel';
import { AIGeneratedContent } from './AIGeneratedContent';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { Block, DocumentType } from '../../types/documents';
import { cn } from '../../lib/utils';
import { saveDocumentToPuter } from '../../utils/api';
import { AIAssistantFloating } from './AIAssistantFloating';
import { supabase } from '../../AppWrapper';
import type { PuterWindow } from '../../types/puter';

// Constants
const DOCUMENT_TEMPLATES = {
  business: ['Executive Summary', 'Introduction', 'Market Analysis', 'Findings', 'Recommendations', 'Conclusion'],
  research: ['Abstract', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion'],
  proposal: ['Overview', 'Problem Statement', 'Proposed Solution', 'Implementation Plan', 'Budget', 'Timeline', 'Conclusion']
} as const;

// Types
interface DocumentEditorProps {
  initialBlocks?: Block[];
  documentId?: string;
  documentType: DocumentType;
  collaborationMode?: boolean;
  readOnly?: boolean;
}

export function DocumentEditor({
  initialBlocks,
  documentId,
  documentType = 'document',
  collaborationMode = false,
  readOnly = false
}: DocumentEditorProps): JSX.Element {
  // State management
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks || []);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showAIGeneration, setShowAIGeneration] = useState(false);
  const [topic, setTopic] = useState<string>('');
  const [documentStructure, setDocumentStructure] = useState<keyof typeof DOCUMENT_TEMPLATES>('business');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiPosition, setAIPosition] = useState({ x: 0, y: 0 });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Hooks
  const { handleAIAssist, isGenerating } = useAIAssistant();
  const blocksContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const docId = documentId || id;

  // Get current user from Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Block management functions
  const createBlock = (type: Block['type'] = 'text', content = ''): Block => ({
    id: uuidv4(),
    type,
    content,
    meta: { style: { fontSize: 'normal', textAlign: 'left' } }
  });

  const blockOperations = {
    add: (type: Block['type'], index: number) => {
      const newBlock = createBlock(type);
      setBlocks(prev => {
        const newBlocks = [...prev];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      });
      setActiveBlockId(newBlock.id);
      setTimeout(() => document.getElementById(`block-${newBlock.id}`)?.focus(), 0);
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

  // Template and AI generation handling
  const createTemplateStructure = (template: keyof typeof DOCUMENT_TEMPLATES = 'business') => {
    const sections = DOCUMENT_TEMPLATES[template];
    return sections.map(section => createBlock('text', `# ${section}\n\nWrite your ${section.toLowerCase()} content here...`));
  };

  const handleGenerateContent = async () => {
    if (!topic) {
      const enteredTopic = await window.prompt('Enter a topic for AI-generated content', '');
      if (!enteredTopic) return;
      setTopic(enteredTopic);
    }
    
    if (documentType === 'document' && !showAIGeneration) {
      const useTemplate = window.confirm(
        'Would you like to use a standard document structure?\n\n' +
        DOCUMENT_TEMPLATES[documentStructure].join('\n')
      );
      
      if (useTemplate) {
        setBlocks(createTemplateStructure(documentStructure));
        return;
      }
    }
    
    setShowAIGeneration(true);
  };

  const handleAIGenerated = (generatedBlocks: Block[]) => {
    setBlocks(prev => {
      if (prev.length <= 1 && !prev[0].content?.trim()) {
        return generatedBlocks;
      }
      return [
        ...prev,
        createBlock('text', '---'),
        ...generatedBlocks
      ];
    });
    setShowAIGeneration(false);
  };

  // Save handling with improved error handling and user feedback
  const handleSave = async () => {
    try {
      const puter = (window as PuterWindow).puter;
      if (!puter?.fs) {
        await (window as any).initializePuter?.();
        if (!puter?.fs) {
          throw new Error('Failed to initialize storage. Please try again.');
        }
      }

      const documentData = {
        id: docId || uuidv4(),
        type: documentType,
        title: blocks[0]?.content?.split('\n')[0]?.replace(/^#\s*/, '') || 'Untitled Document',
        blocks: blocks.map(block => ({
          ...block,
          // Remove any DOM references or complex objects that might cause circular references
          meta: block.meta ? JSON.parse(JSON.stringify(block.meta)) : undefined,
          content: block.content || ''
        })),
        updatedAt: new Date().toISOString()
      };

      await saveDocumentToPuter(documentData.id, documentData);

      // Show success message
      puter.ui?.alert?.({
        title: 'Success',
        message: 'Document saved successfully',
        buttons: [
          {
            text: 'OK',
            variant: 'primary'
          }
        ]
      });

      // Update URL if needed
      if (!docId) {
        navigate(`/documents/${documentData.id}`);
      }
    } catch (error) {
      console.error('Error saving document:', error);
      
      const puter = (window as PuterWindow).puter;
      // Show error message
      puter.ui?.alert?.({
        title: 'Save Failed',
        message: error instanceof Error ? error.message : 'Failed to save your document.',
        buttons: [
          {
            text: 'Try Again',
            variant: 'primary',
            onClick: handleSave
          },
          {
            text: 'Cancel',
            variant: 'secondary'
          }
        ]
      });
    }
  };

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectedText(text);
        setAIPosition({
          x: rect.left + (rect.width / 2),
          y: rect.bottom + 10
        });
        setShowAIAssistant(true);
      } else {
        setShowAIAssistant(false);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  // Handle AI actions
  const processAIAction = async (action: string, prompt?: string) => {
    const activeBlock = blocks.find(block => block.id === activeBlockId);
    if (!activeBlock) return;

    try {
      let aiPrompt = '';
      switch (action) {
        case 'continue':
          aiPrompt = `Continue writing after this text:\n\n${selectedText || activeBlock.content}`;
          break;
        case 'expand':
          aiPrompt = `Expand and elaborate on this text:\n\n${selectedText || activeBlock.content}`;
          break;
        case 'improve':
          aiPrompt = `Improve the writing style and clarity of this text:\n\n${selectedText || activeBlock.content}`;
          break;
        case 'summarize':
          aiPrompt = `Summarize this text:\n\n${selectedText || activeBlock.content}`;
          break;
        case 'tone':
          aiPrompt = `Rewrite this text in a more professional tone:\n\n${selectedText || activeBlock.content}`;
          break;
        case 'translate':
          aiPrompt = `Translate this text to English:\n\n${selectedText || activeBlock.content}`;
          break;
        case 'explain':
          aiPrompt = `Explain this concept in simple terms:\n\n${selectedText || activeBlock.content}`;
          break;
        case 'bullets':
          aiPrompt = `