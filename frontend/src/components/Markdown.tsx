import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn('prose dark:prose-invert max-w-none', className)}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
} 