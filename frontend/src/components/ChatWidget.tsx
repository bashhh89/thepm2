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

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      setError(null);
      setIsTyping(true);

      // Create a new message
      const newMessage = { role: 'user', content };
      setMessages(prev => [...prev, newMessage]);

      const response = await window.puter.ai.chat(
        messages.concat(newMessage),
        false,
        { 
          model: 'gpt-4o-mini',
          stream: true 
        }
      );

      let assistantResponse = '';

      // Handle streaming response
      if (response && Symbol.asyncIterator in response) {
        const iterator = response[Symbol.asyncIterator]();
        try {
          while (true) {
            const { value, done } = await iterator.next();
            if (done) break;
            
            if (value?.text) {
              assistantResponse += value.text;
              // Update the ongoing response
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'assistant') {
                  return [
                    ...prev.slice(0, -1),
                    { ...lastMessage, content: assistantResponse }
                  ];
                }
                return [...prev, { role: 'assistant', content: assistantResponse }];
              });
            }
          }
        } catch (streamError) {
          console.error('Stream error:', streamError);
          setError('Lost connection to AI service. Please try again.');
        }
      } else {
        // Handle non-streaming response
        const text = typeof response === 'string' ? response : response.message?.content;
        if (text) {
          setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'Failed to communicate with AI service');
    } finally {
      setIsTyping(false);
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
