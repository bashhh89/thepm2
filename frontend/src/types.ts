export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachment?: {
    url: string;
    type: string;
    name: string;
  };
}

export interface StreamResponse {
  text?: string;
  done?: boolean;
}