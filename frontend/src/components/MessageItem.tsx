import React from 'react';
import { cn } from '../lib/utils';
import { User, Bot, Terminal } from 'lucide-react';

interface MessageItemProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export function MessageItem({ role, content, timestamp }: MessageItemProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={cn(
      'flex w-full mb-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'flex flex-col max-w-[80%] md:max-w-[70%]',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className="flex items-center mb-1">
          <div className={cn(
            'flex items-center gap-2',
            isUser ? 'order-2 ml-2' : 'order-1 mr-2'
          )}>
            <div className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center',
              isUser ? 'bg-primary text-primary-foreground' : 
              isSystem ? 'bg-yellow-500/20 text-yellow-600' : 
              'bg-muted text-muted-foreground'
            )}>
              {isUser ? (
                <User className="h-4 w-4" />
              ) : isSystem ? (
                <Terminal className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              <div>{isUser ? 'You' : isSystem ? 'System' : 'Assistant'}</div>
              <div>{formattedTime}</div>
            </div>
          </div>
        </div>
        
        <div className={cn(
          'px-4 py-3 rounded-lg',
          isUser ? 'bg-primary text-primary-foreground rounded-tr-none' : 
          isSystem ? 'bg-yellow-500/10 text-foreground rounded-tl-none border border-yellow-500/20' :
          'bg-muted text-foreground rounded-tl-none'
        )}>
          {content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
