import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { MessageCircle, Sparkles } from 'lucide-react';

interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
}

export function ChatMessages({ messages, isTyping = false }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome to QanDu Chat</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your AI assistant powered by multiple language models. Start a conversation or try one of these examples:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <p className="font-medium">"Analyze our customer feedback and suggest improvements"</p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <p className="font-medium">"Help me write a professional email to a client"</p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <p className="font-medium">"Create a social media content calendar for next week"</p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <p className="font-medium">"Generate a business proposal outline"</p>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Your conversations are saved in folders for easy organization
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageItem
              key={message.id || index}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '600ms' }} />
                </div>
              </div>
              <div className="px-4 py-3 rounded-lg bg-muted text-sm">
                Assistant is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
