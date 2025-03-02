import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card, CardHeader, CardTitle } from './Card';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { streamChat } from '../utils/puter-ai';

interface ChatWidgetProps {
  defaultModel?: string;
}

export function ChatWidget({ defaultModel = 'gpt-4o-mini' }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(defaultModel);

  const models = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Default)' },
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'deepseek-chat', name: 'DeepSeek Chat' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Meta Llama 3.1 70B' },
    { id: 'mistral-large-latest', name: 'Mistral Large' },
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isStreaming) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: message }
    ];
    setMessages(newMessages);
    setIsStreaming(true);

    try {
      let fullResponse = '';
      const stream = await streamChat(message, {
        model: selectedModel,
        stream: true
      });
      
      for await (const part of stream) {
        fullResponse += part?.text || '';
        setMessages([
          ...newMessages,
          { role: 'assistant', content: fullResponse }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full shadow-lg border">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Chat Assistant</CardTitle>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="py-1 px-2 text-sm border rounded-md bg-background"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages messages={messages} isTyping={isStreaming} />
      </div>

      <div className="p-4 border-t">
        <ChatInput
          onSendMessage={handleSendMessage}
          isDisabled={isStreaming}
          placeholder="Ask me anything..."
        />
      </div>
    </Card>
  );
}
