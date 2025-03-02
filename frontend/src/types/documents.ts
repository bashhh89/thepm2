export type DocumentType = 'document' | 'presentation' | 'webpage';

export interface Block {
  id: string;
  type: 'text' | 'image' | 'chart' | 'data';
  content: string;
  metadata?: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  type: DocumentType;
  content: Block[];
  createdAt: string;
  thumbnail?: string;
  style_guide: {
    colors: string[];
    fonts: string[];
    layouts: string[];
  };
}

export interface DocumentVersion {
  version: number;
  content: Block[];
  createdAt: string;
  createdBy: string;
  comment?: string;
}

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  content: Block[];
  template?: Template;
  versions: DocumentVersion[];
  collaborators: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  settings?: {
    sharing?: {
      enabled: boolean;
      permissions: Record<string, 'read' | 'write' | 'admin'>;
    };
    versioning?: {
      enabled: boolean;
      maxVersions: number;
    };
    analytics?: {
      enabled: boolean;
      trackEdits: boolean;
      trackViews: boolean;
    };
  };
}