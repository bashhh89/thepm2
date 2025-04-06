'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { cn } from '@/lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
        return (
    <div className={cn(
      'prose prose-neutral dark:prose-invert max-w-none',
      'prose-headings:mb-3 prose-headings:mt-6 prose-headings:font-semibold',
      'prose-p:my-3 prose-p:leading-relaxed',
      'prose-pre:my-4 prose-pre:p-4 prose-pre:bg-muted prose-pre:rounded-lg',
      'prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-muted prose-code:text-sm',
      'prose-img:rounded-lg prose-img:my-4',
      'prose-a:text-primary hover:prose-a:opacity-80',
      'prose-blockquote:border-l-4 prose-blockquote:border-muted prose-blockquote:pl-4 prose-blockquote:italic',
      'prose-table:w-full prose-table:my-4 prose-table:border-collapse',
      'prose-th:border prose-th:p-2 prose-th:bg-muted/50',
      'prose-td:border prose-td:p-2',
      'prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6',
      'prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6',
      'prose-li:my-1',
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeKatex, rehypeRaw, rehypeSanitize]}
        components={{
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4">
              <table {...props} className="min-w-full" />
            </div>
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
            <SyntaxHighlighter
                // @ts-ignore - Known issue with types in react-syntax-highlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
              {...props}
                className="rounded-lg my-4"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
            ) : (
              <code className={cn('bg-muted px-1.5 py-0.5 rounded text-sm', className)} {...props}>
          {children}
        </code>
      );
    },
          pre: ({ children, ...props }: any) => (
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 my-4" {...props}>
        {children}
            </pre>
    ),
          blockquote: ({ children, ...props }: any) => (
            <blockquote
              className="border-l-4 border-muted pl-4 italic my-4"
              {...props}
            >
        {children}
            </blockquote>
    ),
          img: ({ alt, ...props }: any) => (
            <img
              alt={alt}
              className="rounded-lg my-4 max-w-full h-auto"
              {...props}
            />
    ),
          a: ({ children, ...props }: any) => (
            <a
              className="text-primary hover:opacity-80 underline"
        target="_blank"
        rel="noopener noreferrer"
              {...props}
      >
        {children}
      </a>
    ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 