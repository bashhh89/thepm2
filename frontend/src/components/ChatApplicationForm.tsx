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

interface ResumeAnalysis {
  skillMatch: number;
  experienceMatch: number;
  overallScore: number;
  suggestedImprovements: string[];
  competitiveAnalysis: string;
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
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize chat on component mount
  useEffect(() => {
    startChat();
  }, []);
  
  const startChat = async () => {
    try {
      const systemPrompt = `You are Lilai, a friendly and professional AI recruiter assistant. Your role is to help candidates apply for the ${jobTitle} position. Be conversational, encouraging, and helpful throughout the process. Handle sarcasm and irrelevant inputs gracefully. Provide clear validation feedback for invalid inputs like email or phone numbers. Use the candidate's name throughout the conversation once provided. Ask one question at a time, and provide relevant context or tips when appropriate.`;
      const initialMessage = `Hi there! 👋 I'm Lilai, your AI recruiting expert for QanDu. I'm here to help you apply for the ${jobTitle} position. Let's get started! What's your name?`;
      
      const response = await window.puter.ai.chat([{ role: 'system', content: systemPrompt }, { role: 'assistant', content: initialMessage }], {
        model: 'gpt-4o',
        stream: true
      });
      
      setMessages([{ role: 'assistant', content: initialMessage }]);
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
      const currentMessages = [...messages, userMessage];
      let context = '';

      // Add resume context if available
      if (applicationData.resumeUrl) {
        try {
          const resumeResponse = await fetch(`/api/parse-resume?url=${encodeURIComponent(applicationData.resumeUrl)}`);
          if (resumeResponse.ok) {
            const resumeData = await resumeResponse.json();
            context = `\nResume Context: ${JSON.stringify(resumeData)}`;
          }
        } catch (error) {
          console.error('Error parsing resume:', error);
        }
      }

      // Add validation rules
      const validationRules = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-()+]+$/
      };

      // Process user input with AI
      const aiResponse = await window.puter.ai.chat([
        ...currentMessages,
        {
          role: 'system',
          content: `Current application data: ${JSON.stringify(applicationData)}\n${context}\n\nValidation Rules:\n- Email format: ${validationRules.email}\n- Phone format: ${validationRules.phone}\n\nProvide clear feedback for invalid inputs and handle any sarcasm or irrelevant responses professionally.`
        }
      ], {
        model: 'gpt-4o',
        stream: true
      });

      let assistantContent = '';
      if (aiResponse && Symbol.asyncIterator in aiResponse) {
        const iterator = aiResponse[Symbol.asyncIterator]();
        try {
          while (true) {
            const { value, done } = await iterator.next();
            if (done) break;
            if (value?.text) {
              assistantContent += value.text;
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'assistant') {
                  return [...prev.slice(0, -1), { ...lastMessage, content: assistantContent }];
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          }
        } catch (streamError) {
          console.error('Stream error:', streamError);
          throw new Error('Failed to process streaming response');
        }
      } else if (aiResponse.message?.content) {
        assistantContent = aiResponse.message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
      }

      // Update application data based on the conversation
      updateApplicationData(currentAnswer, assistantContent);

    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Failed to process your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const analyzeResume = async (fileUrl: string) => {
    try {
      const response = await fetch(`/api/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeUrl: fileUrl, jobId })
      });
      
      if (response.ok) {
        const analysis = await response.json();
        setResumeAnalysis(analysis);
        setShowSuggestions(true);
        
        // Add AI insights to the chat with interactive buttons
        const aiInsights = `I've analyzed your resume and here's what I found:\n\n` +
          `📊 Skills Match: ${analysis.skillMatch}%\n` +
          `💼 Experience Match: ${analysis.experienceMatch}%\n` +
          `⭐ Overall Fit Score: ${analysis.overallScore}%\n\n` +
          `What would you like to know more about?\n\n` +
          `1️⃣ Generate a tailored cover letter\n` +
          `2️⃣ See how you compare to other candidates\n` +
          `3️⃣ Get suggestions for improving your application\n` +
          `4️⃣ View detailed skills analysis\n\n` +
          `Just type the number or ask me anything else!`;
        
        setMessages(prev => [...prev, { role: 'assistant', content: aiInsights }]);

        // If score is below threshold, proactively offer suggestions
        if (analysis.overallScore < 70) {
          const suggestions = analysis.suggestedImprovements.map((suggestion, index) => 
            `${index + 1}. ${suggestion}`
          ).join('\n');

          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `I notice there might be some areas we can improve. Here are some specific suggestions:\n\n${suggestions}\n\nWould you like me to help you address any of these points?`
          }]);
        }
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an issue while analyzing your resume. Would you like to try uploading it again, or shall we continue with the rest of your application?'
      }]);
    }
  };

  const handleFileUpload = async () => {
    setIsUploading(true);
    try {
      const dropZone = document.createElement('div');
      dropZone.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
      dropZone.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-xl text-center">
          <div class="border-2 border-dashed border-gray-300 p-8 rounded-lg hover:border-primary transition-colors">
            <div class="text-lg mb-4">Drop your resume here or click to browse</div>
            <div class="text-sm text-gray-500">Supports PDF, DOC, DOCX (Max 5MB)</div>
          </div>
        </div>
      `;

      document.body.appendChild(dropZone);

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
        setMessages(prev => [...prev, { role: 'system', content: 'Resume uploaded successfully! Analyzing your resume...' }]);
        await analyzeResume(fileUrl);
      };
  
      const handleDrop = async (e: DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer?.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error('Resume file size must be less than 5MB');
            return;
          }
          const formData = new FormData();
          formData.append('file', file);
          uploadFile(formData);
        }
      };

      dropZone.addEventListener('dragover', (e) => e.preventDefault());
      dropZone.addEventListener('drop', handleDrop);
      dropZone.addEventListener('click', () => input.click());

      return () => {
        document.body.removeChild(dropZone);
      };
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast.error('Failed to handle file upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async (formData: FormData) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const { fileUrl } = await response.json() as FileUploadResponse;
      setApplicationData(prev => ({ ...prev, resumeUrl: fileUrl }));
      setMessages(prev => [...prev, { role: 'system', content: 'Resume uploaded successfully! Analyzing your resume...' }]);
      await analyzeResume(fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    }
  };
  const updateApplicationData = (userInput: string, aiResponse: string) => {
    // Extract name from the first interaction
    if (!applicationData.name && messages.length === 1) {
      setApplicationData(prev => ({ ...prev, name: userInput }));
      // Immediately ask for email after getting the name
      const nextMessage = `Thanks ${userInput}! Could you please share your email address so I can keep you updated about your application?`;
      setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }]);
      return;
    }

    // Handle email collection
    if (applicationData.name && !applicationData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(userInput)) {
        setApplicationData(prev => ({ ...prev, email: userInput }));
        // Ask for phone number after valid email
        const nextMessage = `Perfect! Now, could you please provide your phone number? This will help us reach you more quickly if needed.`;
        setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }]);
      } else {
        // Invalid email format
        const errorMessage = `That doesn't look like a valid email address. Please provide an email in the format: example@domain.com`;
        setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      }
      return;
    }

    // Handle phone number collection
    if (applicationData.name && applicationData.email && !applicationData.phone) {
      const phoneRegex = /^[\d\s\-()+]+$/;
      if (phoneRegex.test(userInput)) {
        setApplicationData(prev => ({ ...prev, phone: userInput }));
        // Ask for resume after valid phone number
        const nextMessage = `Great! Would you like to upload your resume now? This will help us better understand your qualifications.`;
        setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }]);
      } else {
        // Invalid phone format
        const errorMessage = `That doesn't look like a valid phone number. Please provide a phone number using only digits, spaces, and common symbols (-, +).`;
        setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      }
      return;
    }
  };

  const submitApplication = async () => {
    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto'
                : message.role === 'assistant'
                ? 'bg-muted'
                : 'bg-muted/50 text-center text-sm'
            } max-w-[80%]`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}

        {isSubmitting && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (currentAnswer.trim() && !isSubmitting) {
                  handleSubmit();
                }
              }
            }}
            placeholder="Type your message... (Press Enter to send)"
            className="w-full p-4 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !currentAnswer.trim()}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}