import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import { useAuthStore } from '../utils/auth-store';
import { Button } from '../components/Button';
import { ChatMessages } from '../components/ChatMessages';
import { ChatInput } from '../components/ChatInput';
import { streamChat } from '../utils/puter-ai';
import { useUser } from '@clerk/clerk-react';

export default function Chat() {
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { user } = useUser();

  const handleLogout = () => {
    if (isAdmin) {
      useAuthStore.getState().adminLogout();
    }
    navigate('/');
  };

  // Define tools that the AI can use
  const tools = [
    {
      type: "function",
      function: {
        name: "get_user_info",
        description: "Get current user information",
        parameters: {
          type: "object",
          properties: {
            field: {
              type: "string",
              description: "The user field to retrieve (name, email, organization)",
              enum: ["name", "email", "organization"]
            }
          },
          required: ["field"]
        },
        strict: true
      }
    },
    {
      type: "function",
      function: {
        name: "get_system_info",
        description: "Get system information and settings",
        parameters: {
          type: "object",
          properties: {
            info_type: {
              type: "string",
              description: "The type of system information to retrieve",
              enum: ["version", "settings", "stats"]
            }
          },
          required: ["info_type"]
        },
        strict: true
      }
    }
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
        model: 'gpt-4o-mini',
        stream: true,
        tools
      });
      
      for await (const part of stream) {
        if (part.tool_calls) {
          // Handle function calls
          const results = await Promise.all(part.tool_calls.map(async (call: any) => {
            const { name, arguments: args } = call.function;
            let result = '';
            
            switch (name) {
              case 'get_user_info':
                const parsedArgs = JSON.parse(args);
                switch (parsedArgs.field) {
                  case 'name':
                    result = user?.fullName || 'Unknown';
                    break;
                  case 'email':
                    result = user?.primaryEmailAddress?.emailAddress || 'Unknown';
                    break;
                  case 'organization':
                    result = 'QanDu Organization'; // Placeholder
                    break;
                }
                break;
              case 'get_system_info':
                const sysArgs = JSON.parse(args);
                switch (sysArgs.info_type) {
                  case 'version':
                    result = '1.0.0'; // Placeholder
                    break;
                  case 'settings':
                    result = JSON.stringify({
                      theme: 'light',
                      language: 'en',
                      notifications: 'enabled'
                    });
                    break;
                  case 'stats':
                    result = JSON.stringify({
                      uptime: '99.9%',
                      activeUsers: 150,
                      totalChats: 1000
                    });
                    break;
                }
                break;
            }
            return result;
          }));

          // Send function results back to continue the conversation
          const response = await streamChat(message, {
            model: 'gpt-4o-mini',
            stream: true,
            tools,
            messages: [
              ...newMessages,
              { role: 'assistant', content: 'Function results: ' + JSON.stringify(results) }
            ]
          });

          for await (const part of response) {
            fullResponse += part?.text || '';
            setMessages([
              ...newMessages,
              { role: 'assistant', content: fullResponse }
            ]);
          }
        } else {
          fullResponse += part?.text || '';
          setMessages([
            ...newMessages,
            { role: 'assistant', content: fullResponse }
          ]);
        }
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
                Welcome, {user?.fullName || user?.primaryEmailAddress?.emailAddress}
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
                <ChatMessages messages={messages} isTyping={isStreaming} />
              </div>
              <div className="mt-4">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  isDisabled={isStreaming}
                  placeholder="Ask QanDu AI anything..."
                />
              </div>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                Using advanced Puter.ai models. Your conversations are securely stored and encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
