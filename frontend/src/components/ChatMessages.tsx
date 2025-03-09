import React from 'react';
import { Button } from './Button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachment?: {
    url: string;
    type: string;
    name: string;
  };
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
          <div className={`max-w-3/4 p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <div className="flex flex-col">
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              {message.attachment && (
                <div className="mt-2 text-sm text-muted-foreground">
                  📎 <a href={message.attachment.url} target="_blank" rel="noopener noreferrer">{message.attachment.name}</a>
                </div>
              )}
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => {
                      // Handle feedback
                      console.log('Feedback:', 'helpful');
                    }}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => {
                      // Handle feedback
                      console.log('Feedback:', 'not helpful');
                    }}
                  >
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Not Helpful
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
