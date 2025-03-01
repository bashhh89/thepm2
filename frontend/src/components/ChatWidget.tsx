import React, { useState, useEffect } from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChatStore } from '../utils/chat-store';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';

interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  defaultModel?: string;
}

export function ChatWidget({ defaultModel = 'gpt-4o-mini' }: ChatWidgetProps) {
  const { 
    currentConversation, 
    createConversation, 
    sendMessage, 
    isSending, 
    error 
  } = useChatStore();
  
  const [model, setModel] = useState(defaultModel);
  const [showModelSelector, setShowModelSelector] = useState(false);
  
  // Create a new conversation if none exists
  useEffect(() => {
    if (!currentConversation) {
      createConversation('New Conversation').catch(console.error);
    }
  }, [currentConversation, createConversation]);
  
  const handleSendMessage = async (content: string) => {
    await sendMessage(content, model);
  };
  
  const availableModels = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'mistral-large-latest', name: 'Mistral Large' },
    { id: 'deepseek-chat', name: 'DeepSeek Chat' },
  ];
  
  return (
    <Card className="flex flex-col h-[600px] w-full shadow-lg border">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Chat Assistant</CardTitle>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowModelSelector(!showModelSelector)}
            >
              {availableModels.find(m => m.id === model)?.name || model}
            </Button>
            
            {showModelSelector && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border z-10">
                <div className="py-1">
                  {availableModels.map((modelOption) => (
                    <button
                      key={modelOption.id}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${model === modelOption.id ? 'bg-primary/10' : ''}`}
                      onClick={() => {
                        setModel(modelOption.id);
                        setShowModelSelector(false);
                      }}
                    >
                      {modelOption.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 m-3 rounded-md">
            Error: {error}
          </div>
        )}
        
        <ChatMessages 
          messages={currentConversation?.messages || []}
          isTyping={isSending}
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          isDisabled={isSending}
          placeholder="Type your message here..."
        />
      </CardContent>
    </Card>
  );
}
