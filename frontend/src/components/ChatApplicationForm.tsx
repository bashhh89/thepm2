import React, { useState, useEffect, ChangeEvent } from 'react';
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
            }
          }
          // Update application data before setting messages
          updateApplicationData(currentAnswer, assistantContent);
        } catch (streamError) {
          console.error('Stream error:', streamError);
          throw new Error('Failed to process streaming response');
        }
      } else if (aiResponse.message?.content) {
        assistantContent = aiResponse.message.content;
        // Update application data before setting messages
        updateApplicationData(currentAnswer, assistantContent);
      }

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

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');
      const data = await response.json();

      // Set the resume URL and trigger analysis
      setApplicationData(prev => ({ ...prev, resumeUrl: data.fileUrl }));
      toast.success('Resume uploaded successfully. Analyzing...');
      
      // Analyze the resume
      const prompt = `Please analyze this resume for ${jobTitle} position. 
      Resume URL: ${data.fileUrl}
      
      Provide a brief confirmation of receipt and analysis completion.`;

      const aiResponse = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4',
        stream: false
      });

      // Extract the text content from the AI response
      const analysisText = aiResponse.message?.content || 'Resume analysis complete. Would you like to proceed?';

      toast.success('Resume analysis complete!');
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: analysisText }
      ]);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload or analyze resume');
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
    if (currentStep === 0) {
      setApplicationData(prev => ({ ...prev, name: userInput }));
      setCurrentStep(1);
      setMessages(prev => [...prev, { role: 'assistant', content: `Nice to meet you, ${userInput}! 😊 Could you share your email address? I'll use it to keep you updated about your application.` }]);
      return;
    }

    // Handle email collection
    if (currentStep === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(userInput)) {
        setApplicationData(prev => ({ ...prev, email: userInput }));
        setCurrentStep(2);
        setMessages(prev => [...prev, { role: 'assistant', content: `Thanks! I've noted your email as ${userInput}. Next, could you please share your phone number? You can skip this step if you prefer not to share it.` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `That doesn't look like a valid email address. Please provide an email in the format: example@domain.com` }]);
      }
      return;
    }

    // Handle phone number collection
    if (currentStep === 2) {
      const phoneRegex = /^[\d\s\-()+]+$/;
      if (userInput.toLowerCase() === 'skip' || userInput.toLowerCase().includes('prefer not')) {
        setCurrentStep(3);
        setMessages(prev => [...prev, { role: 'assistant', content: `No problem! Let's move on. Would you like to upload your resume now? This will help us better understand your qualifications.` }]);
      } else if (phoneRegex.test(userInput)) {
        setApplicationData(prev => ({ ...prev, phone: userInput }));
        setCurrentStep(3);
        setMessages(prev => [...prev, { role: 'assistant', content: `Great! Would you like to upload your resume now? This will help us better understand your qualifications.` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `That doesn't look like a valid phone number. Please provide a phone number using only digits, spaces, and common symbols (-, +), or type 'skip' to move on.` }]);
      }
      return;
    }

    // Handle post-resume upload
    if (currentStep === 3 && applicationData.resumeUrl) {
      setCurrentStep(4);
      setMessages(prev => [...prev, { role: 'assistant', content: `Great! I've received and analyzed your resume. Would you like to proceed with submitting your application now?` }]);
      return;
    }

    // Handle application submission confirmation
    if (currentStep === 4) {
      if (userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('proceed') || userInput.toLowerCase().includes('submit')) {
        submitApplication();
        setMessages(prev => [...prev, { role: 'assistant', content: `Perfect! I'm submitting your application now...` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Would you like to review your application details before submitting? Just let me know when you're ready to proceed.` }]);
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
          <div className="space-y-4">
            {messages[messages.length - 1]?.content?.includes("upload your resume") && (
              <Button
                onClick={handleFileUpload}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Resume
                  </>
                )}
              </Button>
            )}
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