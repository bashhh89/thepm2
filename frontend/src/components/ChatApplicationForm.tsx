import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Label } from './ui/Label';  // Updated import path
import { Card } from './Card';
import { Send, Loader2, Upload, AlertTriangle, CheckCircle2, User, FileText, Brain, FileEdit, CheckCircle, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { toast } from 'sonner';

const SUGGESTED_QUESTIONS = [
  {
    text: "Generate a personalized cover letter based on my experience",
    action: "generate_cover_letter"
  },
  {
    text: "How do I compare to other candidates?",
    action: "compare_candidates"
  },
  {
    text: "What are my chances for this position?",
    action: "assess_chances"
  },
  {
    text: "Highlight my key strengths for this role",
    action: "highlight_strengths"
  },
  {
    text: "Suggestions to improve my application",
    action: "get_suggestions"
  }
];

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | { type: string; text: string };
  timestamp: Date;
}

interface CandidateAnalysis {
  score: number;
  totalApplicants: number;
  strengths: string[];
  improvements: string[];
  matchingJobs: Array<{
    title: string;
    department: string;
    matchScore: number;
  }>;
  keyQualifications: string[];
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
  analysis?: CandidateAnalysis;
}

interface SuggestedQuestion {
  text: string;
  action: 'generate_cover_letter' | 'compare_candidates' | 'assess_chances' | 'highlight_strengths' | 'get_suggestions';
}

// Enhanced validation utilities
const inputValidation = {
  email: {
    commonPlaceholders: [
      'test@test.com',
      'a@a.com',
      'email@email.com',
      'user@example.com',
      'test@gmail.com'
    ],
    commonDomains: [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com'
    ],
    seemsPlaceholder: (email: string): boolean => {
      const [local, domain] = email.toLowerCase().split('@');
      // Check for overly simple patterns
      if (local.length <= 2) return true;
      if (local === domain.split('.')[0]) return true; // test@test.com pattern
      if (inputValidation.email.commonPlaceholders.includes(email.toLowerCase())) return true;
      return false;
    },
    isBusinessEmail: (email: string): boolean => {
      const [local, domain] = email.toLowerCase().split('@');
      const commonPersonalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      return !commonPersonalDomains.includes(domain);
    },
    suggestions: (email: string): string => {
      const [local] = email.split('@');
      if (local.length <= 2) return "Consider using your full name or professional email";
      if (/^\d+$/.test(local)) return "Numeric-only emails may appear unprofessional";
      return "";
    }
  },
  phone: {
    isRealistic: (phone: string): boolean => {
      const digits = phone.replace(/\D/g, '');
      // Most phone numbers are between 10-15 digits including country code
      if (digits.length < 10 || digits.length > 15) return false;
      // Check for sequential or repeated patterns
      if (/^(\d)\1+$/.test(digits)) return false; // All same digit
      if (/^(0|1){10,}$/.test(digits)) return false; // All 0s or 1s
      if (/^(123|321|456|654|789|987)/.test(digits)) return false; // Sequential patterns
      return true;
    },
    formatHint: "Please include area code, e.g., (555) 123-4567 or +1-555-123-4567"
  },
  name: {
    seemsPlaceholder: (name: string): boolean => {
      // Check for keyboard patterns or repetitive characters
      if (/^[asdf]+$/i.test(name)) return true; // Common keyboard pattern
      if (/^(\w)\1+$/i.test(name)) return true; // Repeated characters
      if (/^(test|user|name|john|doe)$/i.test(name)) return true; // Common placeholders
      if (name.length < 2) return true; // Too short
      return false;
    },
    hasTypo: (name: string): boolean => {
      const commonTypos: Record<string, string> = {
        'ahmaf': 'ahmad',
        'jhon': 'john',
        'micheal': 'michael',
        'smithh': 'smith'
      };
      return Object.keys(commonTypos).some(typo => 
        name.toLowerCase().includes(typo)
      );
    },
    getSuggestion: (name: string): string => {
      const commonTypos: Record<string, string> = {
        'ahmaf': 'ahmad',
        'jhon': 'john',
        'micheal': 'michael',
        'smithh': 'smith'
      };
      for (const [typo, correction] of Object.entries(commonTypos)) {
        if (name.toLowerCase().includes(typo)) {
          return `Did you mean "${correction}"?`;
        }
      }
      return '';
    }
  },
  resume: {
    isValidFile: (file: File): boolean => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      // Check file type and size (5MB max)
      if (!validTypes.includes(file.type)) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      // Check for suspiciously small files (less than 10KB)
      if (file.size < 10 * 1024) return false;
      return true;
    },
    formatHint: "Please upload a PDF or Word document (.pdf, .doc, .docx)"
  }
};

// Visual progress steps
const PROGRESS_STEPS = [
  {
    id: 'personalInfo',
    label: 'Personal Details',
    icon: User,
    description: 'Your basic information'
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: FileText,
    description: 'Upload your CV'
  },
  {
    id: 'aiAnalysis',
    label: 'AI Analysis',
    icon: Brain,
    description: 'Review AI insights'
  },
  {
    id: 'coverLetter',
    label: 'Cover Letter',
    icon: FileEdit,
    description: 'Add personal statement'
  },
  {
    id: 'review',
    label: 'Review',
    icon: CheckCircle,
    description: 'Submit application'
  }
];

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
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [suggestedCorrections, setSuggestedCorrections] = useState<Record<string, string>>({});
  const [candidateComparison, setCandidateComparison] = useState<{
    totalCandidates: number;
    keywordMatch: number;
    experienceRank: number;
    skillsMatch: number;
  } | null>(null);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);

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

  // Enhanced validation function
  const validateInput = (field: string, value: string) => {
    if (field === 'email') {
      if (inputValidation.email.seemsPlaceholder(value)) {
        setValidationWarnings(prev => ({
          ...prev,
          email: "This email looks like a placeholder. Please use your primary email address."
        }));
        setSuggestedCorrections(prev => ({
          ...prev,
          email: inputValidation.email.suggestions(value)
        }));
        return false;
      }
      
      if (!inputValidation.email.isBusinessEmail(value)) {
        setSuggestedCorrections(prev => ({
          ...prev,
          email: "Consider using your work email for a more professional application"
        }));
      }
    }

    if (field === 'name' && inputValidation.name.hasTypo(value)) {
      setSuggestedCorrections(prev => ({
        ...prev,
        name: inputValidation.name.getSuggestion(value)
      }));
      return false;
    }

    // Clear warnings and suggestions if valid
    setValidationWarnings(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    setSuggestedCorrections(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    return true;
  };

  // Update application data with validation
  const updateApplicationData = (field: keyof ApplicationData, value: string) => {
    if (validateInput(field, value)) {
      setApplicationData(prev => ({ ...prev, [field]: value }));
      
      // Update progress
      if (!completedSteps.includes(field)) {
        setCompletedSteps(prev => [...prev, field]);
        if (field === 'phone' && applicationData.name && applicationData.email) {
          setCurrentStep(1); // Move to resume step
        }
      }
    }
  };

  const handleUserMessage = async (message: string) => {
    if (!message.trim() || isProcessing) return;

    setIsProcessing(true);
    const userMessage: ChatMessage = { 
      role: 'user' as const, 
      content: message, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Format conversation history for context
      const conversationContext = messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : msg.content.text
      }));

      // Simplified prompt that focuses on one task at a time
      const nextStep = !applicationData.name ? 'name' :
                      !applicationData.email ? 'email' :
                      !applicationData.phone ? 'phone' :
                      !applicationData.resumeUrl ? 'resume' : 'cover_letter';

      const systemPrompt = `You are Lilai, a friendly AI recruiting assistant for ${jobTitle} position.
      Focus ONLY on collecting ${nextStep} right now.
      Current progress:
      - Name: ${applicationData.name || 'Not provided'}
      - Email: ${applicationData.email || 'Not provided'}
      - Phone: ${applicationData.phone || 'Not provided'}
      - Resume: ${applicationData.resumeUrl ? 'Uploaded' : 'Not uploaded'}
      
      Keep responses short and friendly. Don't ask for information already provided.
      If resume is needed, just remind them to use the upload button.
      If all info is collected, ask about their interest in the position.`;

      const response = await window.puter.ai.chat([
        { role: 'system', content: systemPrompt },
        ...conversationContext.slice(-3), // Only keep last 3 messages for context
        { role: 'user', content: message }
      ], false, {
        model: 'gpt-4o-mini'
      }) as { message: { content: string | { text: string } } };

      const aiResponse = typeof response.message.content === 'string' ? 
        response.message.content : 
        response.message.content.text || 'I apologize, but I encountered an error processing your message.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);

      updateApplicationDataFromMessage(message, aiResponse);

    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered a technical issue. Please try again in a moment.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestedQuestion = async (question: SuggestedQuestion) => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      let prompt = '';
      switch (question.action) {
        case 'generate_cover_letter':
          prompt = `Create a professional cover letter for the ${jobTitle} position based on my resume (${applicationData.resumeUrl}).
          Focus on matching my experience with the job requirements.`;
          break;
        case 'compare_candidates':
          const { count } = await supabase
            .from('applications')
            .select('application_data')
            .eq('job_id', jobId);
          
          prompt = `Compare my application to other candidates for ${jobTitle}.
          Total candidates: ${count || 0}
          My resume: ${applicationData.resumeUrl}
          Analyze key skills, experience, and qualifications.
          Provide a comparison score in these areas.`;
          break;
        case 'assess_chances':
          prompt = `Assess my chances for the ${jobTitle} position based on my resume (${applicationData.resumeUrl}).
          Consider required qualifications and my experience.`;
          break;
        case 'highlight_strengths':
          prompt = `Based on my resume (${applicationData.resumeUrl}), what are my key strengths for the ${jobTitle} position?
          Focus on relevant skills and experiences.`;
          break;
        case 'get_suggestions':
          prompt = `Review my application for the ${jobTitle} position and suggest improvements.
          Resume: ${applicationData.resumeUrl}
          Provide actionable suggestions to strengthen my application.`;
          break;
      }

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o-mini'
      }) as { message: { content: string } };

      if (question.action === 'compare_candidates') {
        try {
          const comparison = JSON.parse(response.message.content);
          setCandidateComparison(comparison);
        } catch (e) {
          console.error('Error parsing comparison:', e);
        }
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error processing suggested question:', error);
      toast.error('Failed to process your question');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateApplicationDataFromMessage = (userMessage: string, aiResponse: string) => {
    // Extract email with better validation
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const emailMatch = userMessage.match(emailRegex);
    if (emailMatch && !applicationData.email) {
      const email = emailMatch[0];
      if (inputValidation.email.seemsPlaceholder(email)) {
        setValidationWarnings(prev => ({
          ...prev,
          email: "This email looks like it might be a placeholder. Would you mind providing your primary email address? For example: firstname.lastname@gmail.com"
        }));
      } else {
        // Remove email warning and update step if all personal info is complete
        setValidationWarnings(prev => {
          const { email, ...rest } = prev;
          return rest;
        });
        if (applicationData.name && !validationWarnings.name && applicationData.phone && !validationWarnings.phone) {
          setCurrentStep(1); // Move to resume step
        }
      }
      setApplicationData(prev => ({ ...prev, email }));
      return;
    }

    // Extract phone with enhanced validation
    const phoneRegex = /(?:\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/;
    const phoneMatch = userMessage.match(phoneRegex);
    if (phoneMatch && !applicationData.phone) {
      const phone = phoneMatch[0].replace(/[-. ]/g, '');
      if (!inputValidation.phone.isRealistic(phone)) {
        setValidationWarnings(prev => ({
          ...prev,
          phone: `This number seems unusual. ${inputValidation.phone.formatHint}`
        }));
      } else {
        // Remove phone warning and update step if all personal info is complete
        setValidationWarnings(prev => {
          const { phone, ...rest } = prev;
          return rest;
        });
        if (applicationData.name && !validationWarnings.name && applicationData.email && !validationWarnings.email) {
          setCurrentStep(1); // Move to resume step
        }
      }
      setApplicationData(prev => ({ ...prev, phone }));
      return;
    }

    // Extract name with enhanced validation
    if (!applicationData.name && 
        userMessage.length < 50 && 
        !emailRegex.test(userMessage) &&
        !phoneRegex.test(userMessage) &&
        !userMessage.includes('http') &&
        /^[A-Za-z\s\-']+$/.test(userMessage.trim())) {
      const name = userMessage.trim();
      if (inputValidation.name.seemsPlaceholder(name)) {
        setValidationWarnings(prev => ({
          ...prev,
          name: "This name seems unusual. Could you confirm this is your actual name?"
        }));
      } else {
        // Remove name warning and check if we can move to next step
        setValidationWarnings(prev => {
          const { name, ...rest } = prev;
          return rest;
        });
        if (applicationData.email && !validationWarnings.email && applicationData.phone && !validationWarnings.phone) {
          setCurrentStep(1); // Move to resume step
        }
      }
      setApplicationData(prev => ({ ...prev, name }));
      return;
    }

    // Handle resume upload completion
    if (applicationData.resumeUrl && currentStep === 1) {
      setCurrentStep(2); // Move to cover letter step
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
      // Move to final step if cover letter is provided
      setCurrentStep(3);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!inputValidation.resume.isValidFile(file)) {
      toast.error(`Invalid resume file. ${inputValidation.resume.formatHint}`);
      return;
    }

    setIsUploading(true);
    try {
      // Create simple filename with timestamp
      const fileName = `${Date.now()}-${file.name}`;

      // Upload directly to resumes bucket
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Set the resume URL immediately so the user can proceed
      setApplicationData(prev => ({
        ...prev,
        resumeUrl: publicUrl
      }));

      toast.success('Resume uploaded successfully!');

      // Attempt AI analysis in the background
      try {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', jobId);

        const response = await window.puter.ai.chat(`Analyze this resume URL: ${publicUrl} for the ${jobTitle} position.
          Current total applicants: ${count || 0}
          
          Provide analysis in this JSON format:
          {
            "score": number between 1-10,
            "totalApplicants": number,
            "strengths": ["array of 3-4 key strengths"],
            "improvements": ["array of 2-3 suggested improvements"],
            "keyQualifications": ["array of 4-5 main qualifications"],
            "matchingJobs": [{"title": "string", "department": "string", "matchScore": number}]
          }`, false, {
          model: 'gpt-4o-mini'
        }) as { message: { content: string } };

        const analysis = JSON.parse(response.message.content);
        
        setApplicationData(prev => ({
          ...prev,
          analysis
        }));

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I've analyzed your resume and I can see some great qualifications! Your application strength score is ${analysis.score}/10. Would you like to tell me why you're interested in this position? This will serve as your cover letter.`,
            timestamp: new Date()
          }
        ]);
      } catch (analysisError) {
        console.error('Error analyzing resume:', analysisError);
        // Continue without analysis
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: "I've received your resume. Would you like to tell me why you're interested in this position? This will serve as your cover letter.",
            timestamp: new Date()
          }
        ]);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Unable to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      const fileInput = document.getElementById('resume') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmitApplication = async () => {
    try {
      // Check for any remaining validation warnings
      if (Object.keys(validationWarnings).length > 0) {
        const confirmSubmit = window.confirm(
          "Some of your inputs look unusual. Would you like to review them before submitting? Click OK to review, or Cancel to submit anyway."
        );
        if (confirmSubmit) return;
      }

      // Validate required fields
      if (!applicationData.name || !applicationData.email || !applicationData.phone || !applicationData.resumeUrl) {
        toast.error('Please complete all required fields before submitting');
        return;
      }

      const applicationPayload = {
        job_id: jobId,
        user_name: applicationData.name,
        status: 'pending',
        application_data: {
          name: applicationData.name,
          email: applicationData.email,
          phone: applicationData.phone,
          resumeUrl: applicationData.resumeUrl,
          coverLetter: applicationData.coverLetter || '',
          analysis: applicationData.analysis || null
        },
        conversation_history: messages.map(msg => ({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content : msg.content.text,
          timestamp: msg.timestamp.toISOString()
        }))
      };

      const { error } = await supabase
        .from('applications')
        .insert([applicationPayload]);

      if (error) throw error;

      toast.success('Application submitted successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(handleSupabaseError(error).error);
    }
  };

  // Calculate progress
  const getProgress = () => {
    const completedFields = Object.entries(applicationData)
      .filter(([key, value]) => value && !validationWarnings[key as keyof typeof validationWarnings])
      .map(([key]) => key);

    return PROGRESS_STEPS.map(step => ({
      ...step,
      isComplete: step.fields.every(field => completedFields.includes(field)),
      isCurrent: !step.fields.every(field => completedFields.includes(field)) &&
                 step.fields.some(field => !completedFields.includes(field))
    }));
  };

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="relative mb-8">
        <div className="flex justify-between items-center">
          {PROGRESS_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center relative",
                index <= currentStep && "text-primary",
                index > currentStep && "text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                index < currentStep && "bg-primary border-primary text-primary-foreground",
                index === currentStep && "border-primary",
                index > currentStep && "border-muted"
              )}>
                {index < currentStep ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs font-medium mt-2">{step.label}</span>
              <span className="text-xs text-muted-foreground">{step.description}</span>
              
              {index < PROGRESS_STEPS.length - 1 && (
                <div className={cn(
                  "absolute top-5 -right-1/2 h-[2px] w-full",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex">
            <div
              className={cn(
                "rounded-lg p-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
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

      {/* Validation Warnings Display */}
      {Object.entries(validationWarnings).length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 space-y-2 animate-in fade-in-50 slide-in-from-top duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="font-medium">Please Review</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-yellow-800"
              onClick={() => setValidationWarnings({})}
            >
              Clear
            </Button>
          </div>
          <ul className="space-y-1 text-sm text-yellow-700">
            {Object.entries(validationWarnings).map(([field, warning]) => (
              <li key={field} className="flex items-start gap-2 animate-in slide-in-from-right">
                <span className="capitalize font-medium">{field}:</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis Display */}
      {applicationData.analysis && (
        <div className="rounded-lg border p-4 space-y-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Application Analysis</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Match Score:</span>
              <span className="font-semibold">{applicationData.analysis.score}/10</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium mb-2">Key Strengths</h4>
              <ul className="list-disc pl-4 text-sm space-y-1">
                {applicationData.analysis.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Areas for Growth</h4>
              <ul className="list-disc pl-4 text-sm space-y-1">
                {applicationData.analysis.improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>

          {applicationData.analysis.matchingJobs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Other Matching Positions</h4>
              <div className="grid gap-2">
                {applicationData.analysis.matchingJobs.map((job, i) => (
                  <div key={i} className="flex items-center justify-between bg-background rounded p-2">
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.department}</p>
                    </div>
                    <span className="text-sm font-medium">{job.matchScore}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2 border-t">
            {applicationData.analysis.totalApplicants > 0 && 
              `Competing with ${applicationData.analysis.totalApplicants} other applicant${applicationData.analysis.totalApplicants === 1 ? '' : 's'}`
            }
          </div>
        </div>
      )}

      {/* Suggested Questions */}
      {applicationData.resumeUrl && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Suggested Questions
          </Label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedQuestion(question)}
                className="text-sm"
              >
                {question.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Comparison Display */}
      {candidateComparison && (
        <Card className="p-4 bg-muted/30">
          <h4 className="font-medium mb-3">Candidate Comparison</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Keyword Match</span>
                <span>{candidateComparison.keywordMatch}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-2 bg-primary rounded-full transition-all"
                  style={{ width: `${candidateComparison.keywordMatch}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Experience Rank</span>
                <span>Top {candidateComparison.experienceRank}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-2 bg-primary rounded-full transition-all"
                  style={{ width: `${100 - candidateComparison.experienceRank}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Skills Match</span>
                <span>{candidateComparison.skillsMatch}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-2 bg-primary rounded-full transition-all"
                  style={{ width: `${candidateComparison.skillsMatch}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Compared against {candidateComparison.totalCandidates} other candidates
            </div>
          </div>
        </Card>
      )}

      {/* Cover Letter Preview & Edit Section */}
      {applicationData.coverLetter && (
        <Card className="p-4 bg-muted/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <h4 className="font-medium">Cover Letter</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingCoverLetter(!isEditingCoverLetter)}
            >
              {isEditingCoverLetter ? (
                'Save'
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>

          {isEditingCoverLetter ? (
            <Textarea
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData(prev => ({
                ...prev,
                coverLetter: e.target.value
              }))}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Edit your cover letter..."
            />
          ) : (
            <div className="whitespace-pre-wrap font-mono text-sm">
              {applicationData.coverLetter}
            </div>
          )}
        </Card>
      )}

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
        {!applicationData.resumeUrl && (
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
    </div>
  );
}