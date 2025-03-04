import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChatApplicationFormProps {
  jobId: string;
  jobTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Message {
  role: 'system' | 'assistant' | 'user' | 'function';
  content: string;
}

interface FileUploadResponse {
  fileUrl: string;
}

export function ChatApplicationForm({ jobId, jobTitle, onSuccess, onCancel }: ChatApplicationFormProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState<any>({
    jobId,
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
    coverLetter: '',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize chat on component mount
  useEffect(() => {
    startChat();
  }, []);
  
  const startChat = async () => {
    try {
      const systemPrompt = `You are a friendly and professional AI recruiter assistant. Your role is to help candidates apply for the ${jobTitle} position. Be conversational, encouraging, and helpful throughout the process. Ask one question at a time, and provide relevant context or tips when appropriate.`;
      const initialMessage = `Hi there! 👋 I'm your AI recruiting assistant, and I'm here to help you apply for the ${jobTitle} position. I'll guide you through the application process in a conversational way. Let's start with your name - what should I call you?`;
      
      const response = await window.puter.ai.chat([
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: initialMessage }
      ]);
  
      setMessages([
        { role: 'assistant', content: initialMessage }
      ]);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start the application process. Please try again.');
    }
  };
  
  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return;
  
    setIsSubmitting(true);
    const userMessage = { role: 'user' as const, content: currentAnswer };
    setMessages(prev => [...prev, userMessage]);
    setCurrentAnswer('');
  
    try {
      let nextQuestion = '';
      const currentMessages = [...messages, userMessage];
  
      // Process the answer based on the current step
      switch (currentStep) {
        case 0: // Name
          setApplicationData(prev => ({ ...prev, name: currentAnswer }));
          nextQuestion = `Nice to meet you, ${currentAnswer}! 😊 Could you please share your email address? I'll use this to keep you updated about your application.`;
          break;
        case 1: // Email
          setApplicationData(prev => ({ ...prev, email: currentAnswer }));
          nextQuestion = "Thanks for that! Now, could you share your phone number? This is optional, but it helps if the hiring team needs to reach you quickly.";
          break;
        case 2: // Phone
          setApplicationData(prev => ({ ...prev, phone: currentAnswer }));
          nextQuestion = `Great! Now comes the interesting part - I'd love to hear why you're interested in the ${jobTitle} position and what makes you a great fit. Feel free to share your relevant experience and what excites you about this role. This will form your cover letter.`;
          break;
        case 3: // Cover Letter
          setApplicationData(prev => ({ ...prev, coverLetter: currentAnswer }));
          nextQuestion = "That's fantastic! 🌟 Last but not least, I'll need your resume. You can either paste a link to your resume (PDF or Word document), or simply type 'upload' to upload a file directly.";
          break;
        case 4: // Resume
          if (currentAnswer.toLowerCase() === 'upload') {
            await handleFileUpload();
          } else {
            setApplicationData(prev => ({ ...prev, resumeUrl: currentAnswer }));
          }
          nextQuestion = "Perfect! I've got all the information needed for your application. Would you like me to submit it now? (yes/no) 📝";
          break;
        case 5: // Confirmation
          if (currentAnswer.toLowerCase() === 'yes') {
            await submitApplication();
            nextQuestion = "🎉 Wonderful news! Your application has been submitted successfully! I wish you the best of luck with your application. The hiring team will review it and get back to you soon!";
          } else {
            nextQuestion = "No problem at all! Feel free to start over whenever you're ready. Good luck with your job search! 😊";
          }
          break;
      }
  
      const aiResponse = await window.puter.ai.chat([
        ...currentMessages,
        { role: 'assistant', content: nextQuestion }
      ]);
  
      setMessages(prev => [...prev, { role: 'assistant', content: nextQuestion }]);
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Error processing answer:', error);
      toast.error('Failed to process your answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileUpload = async () => {
    setIsUploading(true);
    try {
      // Create a file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  
      // Handle file selection
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
  
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Resume file size must be less than 5MB');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload resume');
        }
  
        const { fileUrl } = await response.json() as FileUploadResponse;
        setApplicationData(prev => ({ ...prev, resumeUrl: fileUrl }));
        setMessages(prev => [...prev, { role: 'system', content: 'Resume uploaded successfully!' }]);
      };
  
      input.click();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const submitApplication = async () => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
  
      toast.success('Application submitted successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };
  
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
  
        <div className="flex gap-4">
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type your answer..."
            className="flex-1 rounded-md border bg-background px-3 py-2"
            disabled={isSubmitting || isUploading}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading || !currentAnswer.trim()}
          >
            {isSubmitting || isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Send'
            )}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}