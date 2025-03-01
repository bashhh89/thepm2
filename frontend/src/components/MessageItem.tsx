import React from 'react';

interface MessageItemProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export function MessageItem({ role, content, timestamp }: MessageItemProps) {
  const isUser = role === 'user';
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}
      >
        <div className={`flex items-center mb-1`}>
          <div className={`${isUser ? 'order-2 ml-2' : 'order-1 mr-2'}`}>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {isUser ? 'U' : 'AI'}
            </div>
          </div>
          <div className={`text-xs text-muted-foreground ${isUser ? 'order-1 mr-2 text-right' : 'order-2 ml-2'}`}>
            <div>{isUser ? 'You' : 'Assistant'}</div>
            <div>{formattedTime}</div>
          </div>
        </div>
        <div
          className={`px-4 py-3 rounded-lg ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-muted text-foreground rounded-tl-none'
          }`}
        >
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
