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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationData, setApplicationData] = useState<{
    jobId: string | null;
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter: string;
  }>({
    jobId: null,
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
    coverLetter: ''
  });

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

  const handleUserInfoSubmit = async () => {
    if (!userInfo.name || !userInfo.email) return;
    
    setShowUserInfoForm(false);
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: `Hi ${userInfo.name}! 👋 I'm here to help you explore our job opportunities and assist with your application. Would you like to:
1. View open positions
2. Get help with your application
3. Learn more about our company`
      }
    ]);
    setApplicationData(prev => ({
      ...prev,
      name: userInfo.name,
      email: userInfo.email
    }));
  };

  const handleJobSelection = async (job: Job) => {
    setSelectedJob(job);
    setApplicationData(prev => ({
      ...prev,
      jobId: job.id
    }));
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: `Great choice! Let's get started with your application for ${job.title}. 
        
Would you like to:
1. Start the application now
2. Learn more about the role first
3. Save for later`
      }
    ]);
  };

  const handleUserMessage = async (message: string) => {
    setIsStreaming(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const prompt = `You are a helpful AI recruiter assistant. Current context:
      User: ${userInfo.name}
      Selected Job: ${selectedJob?.title || 'None'}
      Application Progress: ${Object.entries(applicationData)
        .filter(([key, value]) => value && key !== 'jobId')
        .map(([key]) => key)
        .join(', ')}

      Previous messages: ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
      User message: ${message}

      Respond naturally and helpfully. If they're asking about jobs, provide relevant information. 
      If they're applying, guide them through the process step by step.`;

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o-mini',
        stream: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.message.content }]);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.'
        }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { fileUrl } = await response.json();
      setApplicationData(prev => ({
        ...prev,
        resumeUrl: fileUrl
      }));

      setMessages(prev => [
        ...prev,
        { role: 'system', content: '✅ Resume uploaded successfully!' }
      ]);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages(prev => [
        ...prev,
        { role: 'system', content: '❌ Failed to upload resume. Please try again.' }
      ]);
    }
  };

  const submitApplication = async () => {
    if (!applicationData.jobId || !applicationData.resumeUrl) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Please provide your resume before submitting the application.' }
      ]);
      return;
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) throw new Error('Application submission failed');

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `🎉 Congratulations! Your application has been submitted successfully. 
          We'll review it and get back to you soon. Is there anything else I can help you with?`
        }
      ]);

      // Reset application data but keep user info
      setApplicationData({
        jobId: null,
        name: userInfo.name,
        email: userInfo.email,
        phone: '',
        resumeUrl: '',
        coverLetter: ''
      });
      setSelectedJob(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but there was an error submitting your application. Please try again or contact support.'
        }
      ]);
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg group hover:scale-110 transition-transform"
        onClick={() => {
          setIsOpen(true);
          setShowUserInfoForm(true);
        }}
      >
        <div className="relative w-full h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-0 transition-opacity"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
            <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4" />
            <line x1="12" y1="16" x2="12" y2="16" />
            <line x1="12" y1="8" x2="12" y2="8" />
            <line x1="16" y1="12" x2="16" y2="12" />
            <line x1="8" y1="12" x2="8" y2="12" />
          </svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
        </div>
      </Button>
    );
  }

  if (showUserInfoForm) {
    return (
      <Card className="fixed bottom-6 right-6 w-96 p-6 shadow-xl">
        <form onSubmit={handleUserInfoSubmit} className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h0" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold">Welcome to QanDu AI</h3>
              <p className="text-sm text-muted-foreground">Please introduce yourself to get started</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-md border bg-background"
              value={userInfo.name}
              onChange={e => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Email</label>
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-primary"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
              <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4" />
              <line x1="12" y1="16" x2="12" y2="16" />
              <line x1="12" y1="8" x2="12" y2="8" />
              <line x1="16" y1="12" x2="16" y2="12" />
              <line x1="8" y1="12" x2="8" y2="12" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold">QanDu AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 mx-auto mb-4 text-primary/50"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4" />
              <line x1="12" y1="16" x2="12" y2="16" />
              <line x1="12" y1="8" x2="12" y2="8" />
              <line x1="16" y1="12" x2="16" y2="12" />
              <line x1="8" y1="12" x2="8" y2="12" />
            </svg>
            <p className="text-sm mb-2">Hi! I'm your AI assistant.</p>
            <p className="text-xs">Ask me anything about our services, or get help with tasks.</p>
          </div>
        ) : (
          <ChatMessages messages={messages} isTyping={isStreaming} />
        )}
      </div>

      <div className="p-4 border-t">
        <ChatInput
          onSendMessage={handleUserMessage}
          isDisabled={isStreaming}
          placeholder="Type your message..."
        />
      </div>
    </Card>
  );
}