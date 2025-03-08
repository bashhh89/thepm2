import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { MessageCircle, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWidgetProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

interface UserInfo {
  name: string;
  email: string;
  leadId?: string;
}

export function ChatWidget({ 
  title = "Chat Support",
  subtitle = "We're here to help!",
  buttonText = "Chat with us"
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formErrors, setFormErrors] = useState({ name: '', email: '' });

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setMessages([]);
    setUserInfo(null);
    setFormData({ name: '', email: '' });
    setFormErrors({ name: '', email: '' });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = { name: '', email: '' };
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (errors.name || errors.email) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      // Create lead in Supabase
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            source: 'Chat Widget',
            status: 'New',
            notes: 'Lead created from chat widget'
          }
        ])
        .select()
        .single();

      if (leadError) throw leadError;
      
      setUserInfo({
        name: formData.name,
        email: formData.email,
        leadId: lead.id
      });

      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hi ${formData.name}! 👋 How can we help you today?`,
        type: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);

      // Store welcome message in Supabase
      await supabase.from('chat_messages').insert([
        {
          lead_id: lead.id,
          message: welcomeMessage.content,
          sender: 'bot'
        }
      ]);

    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !userInfo) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Store user message in Supabase
      await supabase.from('chat_messages').insert([
        {
          lead_id: userInfo.leadId,
          message: userMessage.content,
          sender: 'user'
        }
      ]);

      // For demo purposes, we'll send a simple response
      const responses = [
        "I'll help you with that right away!",
        "Thanks for your question. Let me check that for you.",
        "I understand what you're asking. Here's what you need to know...",
        "That's a great question! Here's the information you're looking for...",
        "I'd be happy to help you with that.",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        type: 'bot',
        timestamp: new Date()
      };

      // Store bot message in Supabase
      await supabase.from('chat_messages').insert([
        {
          lead_id: userInfo.leadId,
          message: botMessage.content,
          sender: 'bot'
        }
      ]);

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserForm = () => (
    <form onSubmit={handleStartChat} className="p-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            setFormErrors(prev => ({ ...prev, name: '' }));
          }}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary",
            formErrors.name ? "border-red-500" : "border-gray-200"
          )}
          placeholder="Enter your name"
          disabled={isLoading}
        />
        {formErrors.name && (
          <p className="text-xs text-red-500">{formErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, email: e.target.value }));
            setFormErrors(prev => ({ ...prev, email: '' }));
          }}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary",
            formErrors.email ? "border-red-500" : "border-gray-200"
          )}
          placeholder="Enter your email"
          disabled={isLoading}
        />
        {formErrors.email && (
          <p className="text-xs text-red-500">{formErrors.email}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Starting chat...
          </>
        ) : (
          'Start Chat'
        )}
      </Button>
    </form>
  );

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        {buttonText}
      </Button>
    );
  }

  return (
    <div className={cn(
      "fixed right-4 transition-all duration-300 ease-in-out z-50",
      isMinimized ? "bottom-4 w-72" : "bottom-4 w-96"
    )}>
      <Card className="shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-semibold">{title}</h2>
              {!isMinimized && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className={cn(
          "transition-all duration-300",
          isMinimized ? "hidden" : "flex flex-col h-96"
        )}>
          {!userInfo ? (
            renderUserForm()
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col max-w-[80%] rounded-lg p-3",
                      message.type === 'user' 
                        ? "ml-auto bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={!inputValue.trim() || isLoading}
                  >
                    Send
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {isMinimized && (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Click to continue chatting
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
