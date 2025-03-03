export type DocumentType = 'document' | 'presentation' | 'webpage';

export interface Block {
  id: string;
  type: 'text' | 'image' | 'chart' | 'data' | 'code' | 'video' | 'embed';
  content: string;
  meta?: {
    style?: {
      fontSize?: 'small' | 'normal' | 'large';
      textAlign?: 'left' | 'center' | 'right';
      color?: string;
    };
    alt?: string;
    description?: string;
    caption?: string;
    attributes?: Record<string, any>;
  };
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  type: DocumentType;
  blocks: Block[];
  tags?: string[];
  collaborators?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublished: boolean;
  publishedUrl?: string;
  version: number;
  versionHistory?: {
    version: number;
    updatedAt: Date;
    updatedBy: string;
  }[];
  settings?: {
    theme?: string;
    layout?: 'default' | 'wide' | 'full';
    allowComments?: boolean;
    showAuthor?: boolean;
    showDate?: boolean;
    customCss?: string;
  };
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  previewImageUrl?: string;
  blocks: Block[];
  tags?: string[];
  isDefault?: boolean;
  category?: string;
}

export interface DocumentStats {
  id: string;
  documentId: string;
  views: number;
  uniqueVisitors: number;
  averageReadTime: number;
  completionRate: number;
  reactions: Record<string, number>;
  lastViewed?: Date;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  parentId?: string;
  reactions?: Record<string, number>;
}

// For collaboration features
export interface CollaborationSession {
  id: string;
  documentId: string;
  participants: {
    id: string;
    name: string;
    avatarUrl?: string;
    cursorPosition?: {
      blockId: string;
      offset: number;
    };
    selection?: {
      start: {
        blockId: string;
        offset: number;
      };
      end: {
        blockId: string;
        offset: number;
      };
    };
    lastActive: Date;
  }[];
  startedAt: Date;
  isActive: boolean;
}

// For AI-generated content
export interface AIGenerationOptions {
  topic: string;
  documentType: DocumentType;
  sectionCount: number;
  contentLength: 'short' | 'medium' | 'long';
  tone?: 'formal' | 'casual' | 'technical' | 'friendly';
  includeImages?: boolean;
  includeCharts?: boolean;
  includeTables?: boolean;
}

export interface AIGenerationResult {
  blocks: Block[];
  outline?: string[];
  suggestedTags?: string[];
  suggestedTitle?: string;
}