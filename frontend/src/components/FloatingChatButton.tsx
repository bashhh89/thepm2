import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { streamChat } from '../utils/puter-ai';
import { usePipeline } from '../contexts/PipelineContext';
import { nanoid } from 'nanoid';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showUserInfoForm, setShowUserInfoForm] = useState(true);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const { pipelines, currentPipelineId } = usePipeline();
  const [leadId, setLeadId] = useState<string | null>(null);

  const createLeadFromChat = (message: string, name: string, email: string) => {
    // Find default pipeline and its first stage
    const defaultPipeline = pipelines.find(p => p.id === 'default') || pipelines[0];
    if (!defaultPipeline?.stages?.length) return;
    
    const firstStage = defaultPipeline.stages[0];
    const newLeadId = nanoid();
    
    // Create a new lead
    const newLead = {
      id: newLeadId,
      name: name,
      email: email,
      status: firstStage.id,
      value: 'TBD',
      source: 'Website Chat',
      notes: `Initial message: ${message}`,
      pipelineId: defaultPipeline.id,
      createdAt: new Date()
    };

    // Get existing leads from localStorage
    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    
    // Add new lead
    localStorage.setItem('leads', JSON.stringify([...existingLeads, newLead]));
    return newLeadId;
  };

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUserInfoForm(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Create a lead on first message
    if (messages.length === 0) {
      const newLeadId = createLeadFromChat(message, userInfo.name, userInfo.email);
      setLeadId(newLeadId);
    } else if (leadId) {
      // Update lead notes with new message
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      const updatedLeads = leads.map((lead: any) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            notes: `${lead.notes}\n\nUser: ${message}`
          };
        }
        return lead;
      });
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
    }

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

      // Update lead notes with AI response
      if (leadId) {
        const leads = JSON.parse(localStorage.getItem('leads') || '[]');
        const updatedLeads = leads.map((lead: any) => {
          if (lead.id === leadId) {
            return {
              ...lead,
              notes: `${lead.notes}\n\nAI: ${fullResponse}`
            };
          }
          return lead;
        });
        localStorage.setItem('leads', JSON.stringify(updatedLeads));
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

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg"
        onClick={() => {
          setIsOpen(true);
          setShowUserInfoForm(true);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </Button>
    );
  }

  if (showUserInfoForm) {
    return (
      <Card className="fixed bottom-6 right-6 w-96 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Welcome to QanDu Chat</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </Button>
        </div>
        <form onSubmit={handleUserInfoSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-md border bg-background"
              value={userInfo.name}
              onChange={e => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 rounded-md border bg-background"
              value={userInfo.email}
              onChange={e => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
            />
          </div>
          <Button type="submit" className="w-full">
            Start Chat
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">QanDu AI Assistant</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages 
          messages={[
            { role: 'assistant', content: `Hi ${userInfo.name}! How can I help you today?` },
            ...messages
          ]} 
        />
      </div>

      <div className="p-4 border-t">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isStreaming}
          placeholder="Ask me anything..."
        />
      </div>
    </Card>
  );
}