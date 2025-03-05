import React, { useState, useEffect, useRef } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Send, Loader2, Upload } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | { type: string; text: string };
  timestamp: Date;
}

interface ChatApplicationFormProps {
  jobId: string;
  jobTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface ApplicationData {
  jobId: string | null;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
}

export function ChatApplicationForm({ 
  jobId, 
  jobTitle, 
  onSuccess, 
  onCancel,
  initialData 
}: ChatApplicationFormProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    jobId: jobId,
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    resumeUrl: '',
    coverLetter: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startConversation = async () => {
    const initialMessage: ChatMessage = {
      role: 'assistant',
      content: `Hi there! 👋 I'm Lilai, your AI recruiting assistant for the ${jobTitle} position at QanDu. I'll help guide you through the application process. Let's start with your name!`,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  const handleUserMessage = async (message: string) => {
    if (!message.trim() || isProcessing) return;

    setIsProcessing(true);
    const userMessage = { 
      role: 'user', 
      content: message, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      if (!window.puter?.ai) {
        throw new Error('Puter AI not initialized');
      }

      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : msg.content.text
      }));

      // Add user's current message
      conversationHistory.push({
        role: 'user',
        content: message
      });

      // Build system prompt with application context
      const systemPrompt = `You are Lilai, a friendly and professional AI recruiting assistant for ${jobTitle} position.
      Current application progress:
      - Name: ${applicationData.name || 'Not provided'}
      - Email: ${applicationData.email || 'Not provided'}
      - Phone: ${applicationData.phone || 'Not provided'}
      - Resume: ${applicationData.resumeUrl ? 'Uploaded' : 'Not uploaded'}
      - Cover Letter: ${applicationData.coverLetter ? 'Provided' : 'Not provided'}

      Your goal is to:
      1. Guide the candidate through the application process naturally and professionally
      2. Collect required information (name, email, phone) through conversation
      3. Encourage resume upload when basic info is collected
      4. Be helpful and informative about the position
      5. Keep the conversation engaging and professional
      
      Remember:
      - Stay focused on collecting missing information
      - Be encouraging and supportive
      - Use natural conversational transitions
      - Keep responses concise but friendly
      - Guide towards completing the application`;

      // Call Puter AI with full context
      const response = await window.puter.ai.chat([
        { role: 'system', content: systemPrompt },
        ...conversationHistory
      ], false, {
        model: 'claude-3-5-sonnet',
        stream: false
      });

      const aiMessage = {
        role: 'assistant',
        content: typeof response.message.content === 'string' ? 
          response.message.content : 
          response.message.content.text || 'I apologize, but I encountered an error processing your message.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      updateApplicationDataFromMessage(message, 
        typeof response.message.content === 'string' ? 
          response.message.content : 
          response.message.content.text || ''
      );

      // Check if we should encourage resume upload
      if (applicationData.name && 
          applicationData.email && 
          !applicationData.resumeUrl && 
          !messages.some(m => m.content.toString().includes('upload your resume'))) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "I see you've provided your basic information. Would you like to upload your resume now? It's an important part of your application.",
            timestamp: new Date()
          }]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateApplicationDataFromMessage = (userMessage: string, aiResponse: string) => {
    // Extract email with better pattern matching
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const emailMatch = userMessage.match(emailRegex);
    if (emailMatch && !applicationData.email) {
      setApplicationData(prev => ({ ...prev, email: emailMatch[0] }));
      return; // Stop processing if we found an email
    }

    // Extract phone number with better pattern matching
    const phoneRegex = /(?:\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/;
    const phoneMatch = userMessage.match(phoneRegex);
    if (phoneMatch && !applicationData.phone) {
      setApplicationData(prev => ({ ...prev, phone: phoneMatch[0].replace(/[-. ]/g, '') }));
      return; // Stop processing if we found a phone number
    }

    // Extract name with smarter validation
    if (!applicationData.name && 
        userMessage.length < 50 && 
        !emailRegex.test(userMessage) &&
        !phoneRegex.test(userMessage) &&
        !userMessage.includes('http') &&
        /^[A-Za-z\s\-']+$/.test(userMessage.trim())) {
      setApplicationData(prev => ({ ...prev, name: userMessage.trim() }));
      return; // Stop processing if we found a name
    }

    // Extract cover letter with better detection
    if (userMessage.length > 100 && 
        !applicationData.coverLetter &&
        !userMessage.includes('http') &&
        (aiResponse.toLowerCase().includes('cover letter') || 
         userMessage.toLowerCase().includes('dear') ||
         userMessage.toLowerCase().includes('sincerely') ||
         userMessage.toLowerCase().includes('experience'))) {
      setApplicationData(prev => ({ ...prev, coverLetter: userMessage }));
    }
  };

  const getNextPrompt = () => {
    if (!applicationData.name) {
      return "What's your name?";
    }
    if (!applicationData.email) {
      return `Nice to meet you, ${applicationData.name}! Could you please share your email address?`;
    }
    if (!applicationData.phone) {
      return "Great! And what's the best phone number to reach you at?";
    }
    if (!applicationData.resumeUrl) {
      return "Would you like to upload your resume now? It's an important part of your application.";
    }
    if (!applicationData.coverLetter) {
      return "Would you like to tell me a bit about why you're interested in this position? This will serve as your cover letter.";
    }
    return null;
  };

  useEffect(() => {
    const nextPrompt = getNextPrompt();
    if (nextPrompt && messages.length > 0 && messages[messages.length - 1].role !== 'assistant') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: nextPrompt,
          timestamp: new Date()
        }]);
      }, 1000);
    }
  }, [applicationData, messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('applications')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('applications')
        .getPublicUrl(filePath);

      setApplicationData(prev => ({
        ...prev,
        resumeUrl: publicUrl
      }));

      setMessages(prev => [...prev, {
        role: 'system',
        content: '✅ Resume uploaded successfully!',
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: '❌ Failed to upload resume. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationData.jobId || !applicationData.resumeUrl) {
      toast.error('Please provide your resume before submitting.');
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: applicationData.jobId,
          user_name: applicationData.name,
          application_data: applicationData,
          conversation_history: messages,
        });

      if (error) throw error;

      toast.success('Application submitted successfully!');
      onSuccess?.();

    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Chat Messages */}
      <div className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === 'user' 
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">
                {typeof message.content === 'string' 
                  ? message.content 
                  : message.content.text}
              </p>
              {message.timestamp && (
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && currentMessage.trim()) {
                e.preventDefault();
                handleUserMessage(currentMessage);
                setCurrentMessage('');
              }
            }}
            placeholder="Type your message..."
            disabled={isProcessing}
          />
          <Button
            disabled={!currentMessage.trim() || isProcessing}
            onClick={() => {
              handleUserMessage(currentMessage);
              setCurrentMessage('');
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* File Upload */}
        {(applicationData.name && applicationData.email && !applicationData.resumeUrl) && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => document.getElementById('resume')?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload Resume
            </Button>
            <input
              id="resume"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {/* Submit Application */}
        {applicationData.resumeUrl && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication}>
              Submit Application
            </Button>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {applicationData.name ? '✓' : '○'} Name
        </span>
        <span>
          {applicationData.email ? '✓' : '○'} Email
        </span>
        <span>
          {applicationData.phone ? '✓' : '○'} Phone
        </span>
        <span>
          {applicationData.resumeUrl ? '✓' : '○'} Resume
        </span>
        <span>
          {applicationData.coverLetter ? '✓' : '○'} Cover Letter
        </span>
      </div>
    </div>
  );
}