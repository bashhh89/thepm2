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
      const systemPrompt = `You are a friendly and professional AI recruiter assistant. Your role is to help candidates apply for the ${jobTitle} position. Be conversational, encouraging, and helpful throughout the process. Ask one question at a time, and provide relevant context or tips when appropriate.`;
      const initialMessage = `Hi there! 👋 I'm your AI recruiting assistant, and I'm here to help you apply for the ${jobTitle} position. I'll guide you through the application process in a conversational way. Let's start with your name - what should I call you?`;
      
      const response = await window.puter.ai.chat([{ role: 'system', content: systemPrompt }, { role: 'assistant', content: initialMessage }]);
      
      // Extract the message content from the response
      const responseContent = response.message?.content || initialMessage;
  
      setMessages([{ role: 'assistant', content: responseContent }]);
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
      let resumeContext = '';
      const currentMessages = [...messages, userMessage];

      // If resume is uploaded, try to parse it for context
      if (applicationData.resumeUrl) {
        try {
          const resumeResponse = await fetch(`/api/parse-resume?url=${encodeURIComponent(applicationData.resumeUrl)}`);
          if (resumeResponse.ok) {
            const resumeData = await resumeResponse.json();
            resumeContext = JSON.stringify(resumeData);
          }
        } catch (error) {
          console.error('Error parsing resume:', error);
        }
      }
  
      // Process the answer based on the current step
      // Process user input with AI
      // Process user input with AI and get initial response
      const aiResponse = await window.puter.ai.chat([
        ...currentMessages,
        { role: 'system', content: `Current step: ${currentStep}. Resume context: ${resumeContext}. Process the user's response and provide a natural, context-aware reply.` }
      ]);

      // Extract message content from AI response
      const responseContent = aiResponse.message?.content || 'I apologize, but I couldn\'t process your response. Could you please try again?';

      // Handle special commands and resume analysis responses
      if (resumeAnalysis && /^[1-3]$/.test(currentAnswer)) {
        switch (currentAnswer) {
          case '1':
            const coverLetterResponse = await window.puter.ai.chat([
              { role: 'system', content: `Generate a tailored cover letter based on the candidate's resume (${resumeContext}) and the ${jobTitle} position.` }
            ]);
            nextQuestion = coverLetterResponse.message?.content || 'I apologize, but I couldn\'t generate a cover letter. Please try again.';
            break;
          case '2':
            nextQuestion = `Based on our analysis, here's how you compare to other candidates:\n\n${resumeAnalysis.competitiveAnalysis}\n\nWould you like specific advice on how to strengthen your application?`;
            break;
          case '3':
            nextQuestion = `Here are some suggestions to improve your application:\n\n${resumeAnalysis.suggestedImprovements.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWould you like me to help you address any of these points?`;
            break;
        }
      } else {
        // Regular application flow
        switch (currentStep) {
          case 0: // Name
            setApplicationData(prev => ({ ...prev, name: currentAnswer }));
            nextQuestion = responseContent;
            break;
          case 1: // Email
            setApplicationData(prev => ({ ...prev, email: currentAnswer }));
            nextQuestion = responseContent;
            break;
          case 2: // Phone
            setApplicationData(prev => ({ ...prev, phone: currentAnswer }));
            const coverLetterPrompt = resumeContext ? 
              await window.puter.ai.chat([
                { role: 'system', content: `Generate a personalized question about the candidate's interest in the ${jobTitle} position, incorporating their resume experience: ${resumeContext}` }
              ]) :
              `I'd love to hear why you're interested in the ${jobTitle} position. What makes you a great fit for this role?`;
            nextQuestion = coverLetterPrompt.message?.content || coverLetterPrompt;
            break;
          case 3: // Cover Letter
            setApplicationData(prev => ({ ...prev, coverLetter: currentAnswer }));
            nextQuestion = "That's fantastic! 🌟 Now, let's add your resume to complete your application. You can drag and drop your resume here, or click to browse your files.";
            await handleFileUpload();
            break;
          case 4: // Resume
            if (currentAnswer.toLowerCase() === 'upload') {
              await handleFileUpload();
            } else if (resumeAnalysis) {
              nextQuestion = `Based on your resume analysis, you have a ${resumeAnalysis.overallScore}% match for this position. Would you like to:\n1. Submit your application now\n2. Get suggestions to improve your chances\n3. See how you compare to other candidates`;
            }
            break;
          case 5: // Confirmation
            if (currentAnswer.toLowerCase() === 'yes') {
              await submitApplication();
              const successResponse = await window.puter.ai.chat([
                { role: 'system', content: `Generate an encouraging success message for a candidate with ${resumeAnalysis?.overallScore ?? 'unknown'}% match score.` }
              ]);
              nextQuestion = successResponse.message?.content || 'Your application has been submitted successfully!';
            } else {
              nextQuestion = "I understand. Is there anything specific you'd like to review or improve before submitting?";
            }
            break;
        }
      }
  
      // Update messages with the final response
      setMessages(prev => [...prev, { role: 'assistant', content: nextQuestion }]);
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Error processing answer:', error);
      toast.error('Failed to process your answer. Please try again.');
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
        
        // Add AI insights to the chat
        const aiInsights = `Based on my analysis of your resume:\n\n` +
          `• Your skills match: ${analysis.skillMatch}%\n` +
          `• Experience match: ${analysis.experienceMatch}%\n` +
          `• Overall fit score: ${analysis.overallScore}%\n\n` +
          `Would you like me to help you:\n` +
          `1. Generate a tailored cover letter\n` +
          `2. See how you compare to other candidates\n` +
          `3. Get suggestions for improving your application\n` +
          `\nJust type the number of your choice or ask me anything else!`;
        
        setMessages(prev => [...prev, { role: 'assistant', content: aiInsights }]);
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume. Please try again.');
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
  );
}