import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import { useAuthStore } from '../utils/auth-store';
import { ChatWidget } from '../components/ChatWidget';
import { Button } from '../components/Button';
import { ChatMessages } from '../components/ChatMessages';
import { ChatInput } from '../components/ChatInput';
import { streamChat } from '../utils/puter-ai';

export default function Chat() {
  const { user, logOut } = useAuthStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: message }
    ];
    setMessages(newMessages);
    setIsStreaming(true);

    try {
      let fullResponse = '';
      const stream = await streamChat(message);
      
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
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">QanDu Chat</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.displayName || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">AI Assistant</h2>
            <p className="text-muted-foreground mb-8">
              Your personal AI assistant powered by Puter.ai. Ask questions, get insights, and complete tasks efficiently.
            </p>
            
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex-1 overflow-y-auto max-h-[60vh]">
                <ChatMessages messages={messages} />
              </div>
              <div className="mt-4">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={isStreaming}
                  placeholder="Ask QanDu AI anything..."
                />
              </div>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                Using advanced Puter.ai models. Your conversations are securely stored and encrypted.
                Switch between different AI models using the selector in the chat interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
