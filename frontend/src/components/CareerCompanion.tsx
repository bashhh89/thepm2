import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Loader2, Upload, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachment?: {
    url: string;
    type: string;
    name: string;
  };
}

export function CareerCompanion() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I\'m your Career Companion. I can help you improve your resume, write cover letters, and prepare for interviews. Upload your resume to get started!',
    timestamp: new Date()
  }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, Word document, or text file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsProcessing(true);
    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload file');
      const { fileUrl } = await uploadResponse.json();

      setMessages(prev => [...prev, {
        role: 'user',
        content: `Uploaded: ${file.name}`,
        timestamp: new Date(),
        attachment: {
          url: fileUrl,
          type: file.type,
          name: file.name
        }
      }]);

      // Start analysis
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Analyzing your resume...',
        timestamp: new Date()
      }]);

      const analysisResponse = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl })
      });

      if (!analysisResponse.ok) throw new Error('Failed to analyze resume');
      const analysis = await analysisResponse.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Here's my analysis of your resume:\n\n${analysis.summary}\n\nWhat would you like to do next?\n1. Get detailed feedback\n2. Generate a cover letter\n3. Practice interview questions`,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process your resume. Please try again.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      scrollToBottom();
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsProcessing(true);

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages
        })
      });

      if (!response.ok) throw new Error('Failed to get response');
      const { reply } = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsProcessing(false);
      scrollToBottom();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.attachment && (
                <div className="mt-2 text-sm opacity-75">
                  📎 {message.attachment.name}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t p-4 space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 rounded-md border bg-background px-3 py-2"
            disabled={isProcessing}
          />
          <Button
            type="button"
            size="icon"
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}