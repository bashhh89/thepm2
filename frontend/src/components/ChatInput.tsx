import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, isDisabled = false, placeholder = 'Type your message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end rounded-lg border bg-card shadow-sm">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          className={cn(
            "flex-1 resize-none px-4 py-3 max-h-[200px]",
            "bg-transparent text-foreground placeholder:text-muted-foreground",
            "focus:outline-none disabled:opacity-50",
            "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20"
          )}
          style={{ scrollbarGutter: 'stable' }}
        />
        <div className="flex items-center px-3 py-2">
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isDisabled}
            className={cn(
              "rounded-full p-2 h-9 w-9",
              "transition-all duration-200",
              message.trim() && !isDisabled 
                ? "bg-primary text-primary-foreground opacity-100 translate-y-0"
                : "opacity-50 translate-y-1"
            )}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      
      {isDisabled && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-background/50 rounded-lg flex items-center justify-center animate-in">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <div className="flex space-x-1">
              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '600ms' }} />
            </div>
            <span>AI is thinking...</span>
          </div>
        </div>
      )}
    </form>
  );
}
