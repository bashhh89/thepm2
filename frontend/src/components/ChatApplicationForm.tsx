import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Loader2, Upload, Send, Sparkles, User, Mail, Briefcase, Star, FileText, Info, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Progress } from './Progress';
import { Markdown } from './Markdown';
import { FileUpload } from './FileUpload';
import { StepIndicator } from './StepIndicator';
import { FileUploadZone } from './FileUploadZone';
import { ResumeAnalysis } from './ResumeAnalysis';
import { ApplicationProgress } from './ApplicationProgress';
import { cn } from '../lib/utils';
import { callPuterAI } from '../lib/puter';
import type { PuterAIMessage } from '../types/puter';
import { InitialForm } from './InitialForm';

interface ChatApplicationFormProps {
  jobId: string;
  jobTitle: string;
  department: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ChatStep {
  id: string;
  type: 'greeting' | 'personal-info' | 'experience' | 'skills' | 'resume' | 'additional-info' | 'review';
  completed: boolean;
  current: boolean;
}

interface ApplicationData {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  currentRole?: string;
  yearsOfExperience?: number;
  skills: {
    [key: string]: {
      rating: number;
      example?: string;
    };
  };
  resumeUrl?: string;
  coverLetter?: string;
  linkedInUrl?: string;
  availabilityDate?: string;
  salaryExpectation?: string;
  visaSponsorship?: boolean;
  additionalNotes?: string;
  resumeContent?: string;
}

interface ResumeAnalysis {
  skillMatch: number;
  experienceMatch: number;
  overallScore: number;
  suggestedImprovements: string[];
  competitiveAnalysis: string;
  keyStrengths: string[];
  developmentAreas: string[];
  roleAlignment: {
    score: number;
    feedback: string;
  };
}

interface Message {
  id: string;
  role: 'system' | 'assistant' | 'user' | 'function';
  content: string;
  timestamp: number;
  type?: 'text' | 'options' | 'upload' | 'rating' | 'analysis';
  options?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  analysis?: ResumeAnalysis;
}

interface ConversationContext {
  currentStep: ChatStep;
  applicationData: ApplicationData;
  jobRequirements: {
    requiredSkills: string[];
    preferredSkills: string[];
    minimumExperience: number;
  };
  skillAssessment: {
    completed: string[];
    pending: string[];
  };
}

interface FileUploadResponse {
  fileUrl: string;
}

interface PuterAIResponse {
  message?: {
    content: string;
  };
  text?: string;
  content?: string;
}

interface PuterAI {
  chat: (prompt: string | Array<{ role: string; content: string }>) => Promise<PuterAIResponse>;
}

declare global {
  interface Window {
    puter: {
      ai: PuterAI;
    } | undefined;
  }
}

interface Step {
  id: string;
  label: string;
  description: string;
}

const STEPS: Step[] = [
  { id: 'resume', label: 'Resume', description: 'Upload & Analysis' },
  { id: 'personal-info', label: 'Personal Info', description: 'Contact Details' },
  { id: 'experience', label: 'Experience', description: 'Work History' },
  { id: 'skills', label: 'Skills', description: 'Technical Skills' },
  { id: 'additional-info', label: 'Additional Info', description: 'Final Details' },
  { id: 'review', label: 'Review', description: 'Final Review' }
] as const;

const createMessage = (
  role: Message['role'],
  content: string,
  type: Message['type'] = 'text',
  options?: Message['options'],
  analysis?: Message['analysis']
): Message => ({
  id: `${role}-${Date.now()}`,
  role,
  content,
  timestamp: Date.now(),
  type,
  ...(options && { options }),
  ...(analysis && { analysis })
});

interface InitialFormData {
  name: string;
  email: string;
}

export function ChatApplicationForm({ jobId, jobTitle, department, onSuccess, onCancel }: ChatApplicationFormProps) {
  const [showInitialForm, setShowInitialForm] = useState(true);
  const [initialFormData, setInitialFormData] = useState<InitialFormData>({
    name: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<InitialFormData>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [context, setContext] = useState<ConversationContext>({
    currentStep: {
      id: 'resume',
      type: 'resume',
      completed: false,
      current: true
    },
    applicationData: {
    jobId,
    name: '',
    email: '',
    phone: '',
      skills: {},
    },
    jobRequirements: {
      requiredSkills: [],
      preferredSkills: [],
      minimumExperience: 0
    },
    skillAssessment: {
      completed: [],
      pending: []
    }
  });

  useEffect(() => {
    startChat();
    fetchJobRequirements();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchJobRequirements = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/requirements`);
      if (response.ok) {
        const requirements = await response.json();
        setContext(prev => ({
          ...prev,
          jobRequirements: requirements
        }));
      }
    } catch (error) {
      console.error('Error fetching job requirements:', error);
    }
  };

  const formatAIResponse = (content: string): string => {
    // Add markdown formatting
    return content
      .replace(/\n/g, '  \n') // Fix line breaks
      .replace(/(?:^|\n)(\d+\.\s)/g, '\n\n$1') // Format numbered lists
      .replace(/(?:^|\n)[-•]\s/g, '\n• ') // Format bullet points
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Bold text
      .replace(/_(.*?)_/g, '_$1_'); // Italic text
  };

  const callAI = async (prompt: string): Promise<string> => {
    const puter = (window as any).puter;
    if (!puter?.ai?.chat) {
      throw new Error('AI chat is not available');
    }

    try {
      const response = await puter.ai.chat(prompt);
      return response.toString();
    } catch (error) {
      console.error('Error calling AI:', error);
      throw error;
    }
  };

  const startChat = async () => {
    try {
      const initialMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `# Welcome to QanDu! 👋

Hi ${context.applicationData.name}, I'm Lilai, your AI recruiting assistant. I'll be helping you apply for the **${jobTitle}** position.

Let's start by analyzing your resume to provide personalized guidance for your application. Please upload your resume in PDF, DOC, or DOCX format.`,
        timestamp: Date.now(),
        type: 'text'
      };

      setMessages([initialMessage]);
      setContext(prev => ({
        ...prev,
        currentStep: {
          id: 'resume',
          type: 'resume',
          completed: false,
          current: true
        }
      }));
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start the application process. Please try again.');
    }
  };

  const generateNextPrompt = async (currentContext: ConversationContext): Promise<Message> => {
    const { currentStep, applicationData } = currentContext;
    
    switch (currentStep.type) {
      case 'greeting':
        if (!applicationData.name) {
          return {
            id: 'name-request',
            role: 'assistant',
            content: "I didn't catch your name. Could you please share it with me?",
            timestamp: Date.now(),
            type: 'text'
          };
        }
        return {
          id: 'application-style',
          role: 'assistant',
          content: `Great to meet you, ${applicationData.name}! Would you prefer a quick chat-style application or a more detailed discussion about the role?`,
          timestamp: Date.now(),
          type: 'options',
          options: [
            { label: 'Quick Chat', value: 'quick' },
            { label: 'Detailed Discussion', value: 'detailed' }
          ]
        };

      case 'personal-info':
        return {
          id: 'experience-check',
          role: 'assistant',
          content: `${applicationData.name}, to better understand your background:
          
          Are you currently working in a similar role? 
          How many years of experience do you have in this field?`,
          timestamp: Date.now(),
          type: 'text'
        };

      case 'skills':
        const pendingSkill = context.skillAssessment.pending[0];
        if (pendingSkill) {
          return {
            id: `skill-${pendingSkill}`,
            role: 'assistant',
            content: `How would you rate your proficiency in ${pendingSkill}? (1-5 scale)`,
            timestamp: Date.now(),
            type: 'rating'
          };
        }
        return {
          id: 'skills-complete',
          role: 'assistant',
          content: "Great! Now that we've covered your skills, would you like to upload your CV or share your LinkedIn profile?",
          timestamp: Date.now(),
          type: 'options',
          options: [
            { label: 'Upload CV', value: 'upload-cv' },
            { label: 'Share LinkedIn', value: 'linkedin' },
            { label: 'Build CV Together', value: 'build-cv' }
          ]
        };

      // ... Add more cases for other steps ...

      default:
        return {
          id: 'default',
          role: 'assistant',
          content: "I'm not sure what to ask next. Let's continue with your application. What would you like to know?",
          timestamp: Date.now(),
          type: 'text'
        };
    }
  };

  const processUserInput = async (input: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentAnswer('');

    try {
      // Update context based on user input
      const updatedContext = await updateContext(context, userMessage);
      setContext(updatedContext);

      // Generate next prompt
      const nextPrompt = await generateNextPrompt(updatedContext);
      setMessages(prev => [...prev, nextPrompt]);

      // If we've collected enough information, proceed with resume analysis
      if (updatedContext.applicationData.resumeUrl) {
        await analyzeResume(updatedContext.applicationData.resumeContent || '');
      }
    } catch (error) {
      console.error('Error processing input:', error);
      toast.error('Failed to process your response. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!currentAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: currentAnswer,
      timestamp: Date.now(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentAnswer('');

    try {
      const prompt = `Previous messages: ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
User message: ${currentAnswer}
Current application data: ${JSON.stringify(context.applicationData)}

Respond in a helpful and professional manner, using markdown formatting.`;

      const aiResponse = await callAI(prompt);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update application data
      const updatedContext = await updateContext(context, userMessage);
      setContext(updatedContext);

    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Failed to process your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractPDFContent = async (fileUrl: string): Promise<string> => {
    const response = await fetch('/api/extract-pdf-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to extract PDF text');
    }

    const { text } = await response.json();
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF');
    }
    return text;
  };

  const extractTextContent = async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (!content || content.trim().length === 0) {
          reject(new Error('File appears to be empty'));
        } else {
          resolve(content);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setMessages(prev => [...prev, createMessage('system', `Processing ${file.name}...`)]);

      // First, check file size and type
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size exceeds 10MB limit');
      }

      // For PDFs, we'll extract text first
      if (file.type === 'application/pdf') {
        // First, get the file buffer
        const fileBuffer = await file.arrayBuffer();
        
        // Extract text from PDF
        const extractResponse = await fetch('/api/extract-pdf-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            fileBuffer: Array.from(new Uint8Array(fileBuffer))
          })
        });

        const responseData = await extractResponse.json();
        
        if (!extractResponse.ok) {
          throw new Error(responseData.details || responseData.error || 'Failed to extract PDF text');
        }

        const { text, metadata } = responseData;
        
        // Create form data for file upload
        const formData = new FormData();
        formData.append('file', file);

        // Upload the file
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        const { fileUrl } = await uploadResponse.json() as FileUploadResponse;

        // Update context with file info
        setContext(prev => ({
          ...prev,
          applicationData: {
            ...prev.applicationData,
            resumeUrl: fileUrl,
            resumeContent: text
          }
        }));

              setMessages(prev => [
          ...prev.filter(msg => !msg.content.startsWith('Processing')),
          createMessage('system', `Successfully processed your ${metadata.pages}-page resume. Analyzing content...`)
              ]);

        // Analyze the resume
        await analyzeResume(text);

            } else {
        // For non-PDF files, use the existing text extraction
        const fileContent = await extractTextContent(file);
        
        // Validate text content
        if (!fileContent || fileContent.trim().length < 50) {
          throw new Error('The file contains insufficient text content. Please ensure it contains your resume text.');
        }
        
        // Create form data for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobId', jobId);

        // Upload the file
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        const { fileUrl } = await uploadResponse.json() as FileUploadResponse;

        // Update context with file info
        setContext(prev => ({
          ...prev,
          applicationData: {
            ...prev.applicationData,
            resumeUrl: fileUrl,
            resumeContent: fileContent
          }
        }));

          setMessages(prev => [
          ...prev.filter(msg => !msg.content.startsWith('Processing')),
          createMessage('system', 'Resume uploaded successfully! Analyzing your resume...')
          ]);

        // Analyze the resume
        await analyzeResume(fileContent);
        }

    } catch (error) {
      console.error('Error handling file upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process your resume';
      
      // Provide specific guidance based on the error
      let options = [
        { label: 'Try Again', value: 'upload-again' },
        { label: 'Use Different Format', value: 'change-format' },
        { label: 'Skip Resume Analysis', value: 'skip' }
      ];

      // Add specific help for common issues
      if (errorMessage.toLowerCase().includes('scanned') || errorMessage.toLowerCase().includes('insufficient text')) {
        options.unshift({ label: 'Convert to Text PDF', value: 'convert-pdf' });
      }

      let helpText = 'Tip: For best results, upload a PDF or DOCX file with selectable text.';
      
      if (errorMessage.toLowerCase().includes('invalid pdf')) {
        helpText = 'Tip: The file appears to be corrupted or not a valid PDF. Try saving it again or converting it to a different format.';
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        helpText = 'Tip: The PDF file is too complex to process. Try converting it to a simpler format or using a DOC/DOCX file.';
      } else if (errorMessage.toLowerCase().includes('insufficient text')) {
        helpText = 'Tip: If this is a scanned document, please convert it to a searchable PDF using an OCR tool first.';
      }

      setMessages(prev => [
        ...prev.filter(msg => !msg.content.startsWith('Processing')),
        createMessage(
          'assistant',
          `I encountered an issue while processing your resume: ${errorMessage}\n\n${helpText}\n\nWhat would you like to do?`,
          'options',
          options
        )
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const updateContext = async (currentContext: ConversationContext, message: Message): Promise<ConversationContext> => {
    const updatedContext = { ...currentContext };

    switch (currentContext.currentStep.type) {
      case 'greeting':
        if (!currentContext.applicationData.name) {
          updatedContext.applicationData.name = message.content;
          updatedContext.currentStep.completed = true;
          setMessages(prev => [...prev, createMessage(
            'assistant',
            `Nice to meet you, ${message.content}! 😊 Could you share your email address? I'll use it to keep you updated about your application.`
          )]);
        }
        break;

      case 'personal-info':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\s\-()+]+$/;
        
        if (!currentContext.applicationData.email && emailRegex.test(message.content)) {
          updatedContext.applicationData.email = message.content;
          setMessages(prev => [...prev, createMessage(
            'assistant',
            `Thanks! I've noted your email as ${message.content}. Next, could you please share your phone number? You can skip this step if you prefer not to share it.`
          )]);
        } else if (!currentContext.applicationData.phone && phoneRegex.test(message.content)) {
          updatedContext.applicationData.phone = message.content;
          updatedContext.currentStep.completed = true;
          setMessages(prev => [...prev, createMessage(
            'assistant',
            `Great! Would you like to upload your resume now? This will help us better understand your qualifications.`
          )]);
      } else {
          setMessages(prev => [...prev, createMessage(
            'assistant',
            `That doesn't look like a valid ${!currentContext.applicationData.email ? 'email address' : 'phone number'}. Please try again.`
          )]);
        }
        break;

      // ... rest of the cases ...
    }

    return updatedContext;
  };

  const submitApplication = async () => {
    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context.applicationData)
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

  const renderMessage = (message: Message) => {
    const isAI = message.role === 'assistant';

  return (
      <div key={message.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`flex ${isAI ? 'flex-row' : 'flex-row-reverse'} items-start max-w-[80%]`}>
          <Avatar
            className={`w-8 h-8 ${isAI ? 'mr-2' : 'ml-2'}`}
            src={isAI ? "/lilai-avatar.png" : undefined}
          />
          <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
            <div className={`rounded-lg p-4 ${
              isAI ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
            }`}>
              {renderMessageContent(message)}
          </div>
            <span className="text-xs text-muted-foreground mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'options':
        return (
          <div className="space-y-2">
            <Markdown>{message.content}</Markdown>
            <div className="flex flex-wrap gap-2 mt-4">
              {message.options?.map(option => (
                <Button
                  key={option.value}
                  variant="secondary"
                  onClick={() => handleOptionSelect(option.value)}
                  className="flex items-center gap-2"
                >
                  {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-2">
            <p>{message.content}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <Button
                  key={rating}
                  variant="outline"
                  onClick={() => handleRatingSelect(rating)}
                  className={`w-8 h-8 p-0 ${
                    context.applicationData.skills[message.id]?.rating === rating
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  }`}
                >
                  {rating}
                </Button>
              ))}
          </div>
      </div>
        );

      case 'analysis':
        return message.analysis ? (
          <div className="space-y-4">
            <Markdown>{message.content}</Markdown>
            <div className="bg-background/50 rounded-md p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Skills Match</span>
                  <Badge variant={message.analysis.skillMatch >= 70 ? 'success' : 'warning'}>
                    {message.analysis.skillMatch}%
                  </Badge>
                </div>
                <Progress value={message.analysis.skillMatch} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Experience Match</span>
                  <Badge variant={message.analysis.experienceMatch >= 70 ? 'success' : 'warning'}>
                    {message.analysis.experienceMatch}%
                  </Badge>
                </div>
                <Progress value={message.analysis.experienceMatch} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Overall Score</span>
                  <Badge variant={message.analysis.overallScore >= 70 ? 'success' : 'warning'}>
                    {message.analysis.overallScore}%
                  </Badge>
                </div>
                <Progress value={message.analysis.overallScore} />
              </div>
            </div>
            {renderActionButtons()}
          </div>
        ) : (
          <Markdown>{message.content}</Markdown>
        );

      default:
        return <Markdown>{message.content}</Markdown>;
    }
  };

  const handleOptionSelect = (value: string) => {
    switch (value) {
      case 'submit':
        submitApplication();
        break;

      case 'continue':
        // Move to the next step in the application process
        proceedToNextStep();
        setMessages(prev => [...prev, createMessage(
          'assistant',
          `Great! Let's continue with your application. Could you please share your email address so we can keep you updated on your application status?`,
          'text'
        )]);
        break;

      case 'view-analysis':
        // Show detailed analysis if available
        if (resumeAnalysis) {
          setMessages(prev => [...prev, createMessage(
            'assistant',
            `Here's a detailed breakdown of your resume analysis:

**Key Strengths:**
${resumeAnalysis.keyStrengths.map(strength => `• ${strength}`).join('\n')}

**Areas for Development:**
${resumeAnalysis.developmentAreas.map(area => `• ${area}`).join('\n')}

**Competitive Analysis:**
${resumeAnalysis.competitiveAnalysis}

**Role Alignment:**
${resumeAnalysis.roleAlignment.feedback}

What would you like to do next?`,
            'options',
            [
              { label: 'Generate Cover Letter', value: 'cover-letter' },
              { label: 'Improve Resume', value: 'improvements' },
              { label: 'Continue Application', value: 'continue' }
            ]
          )]);
        }
        break;

      case 'improvements':
        if (resumeAnalysis) {
          setMessages(prev => [...prev, createMessage(
            'assistant',
            `Here are specific recommendations to improve your application:

${resumeAnalysis.suggestedImprovements.map((improvement, index) => `${index + 1}. ${improvement}`).join('\n')}

What would you like to do next?`,
            'options',
            [
              { label: 'Generate Cover Letter', value: 'cover-letter' },
              { label: 'Upload New Resume', value: 'upload-again' },
              { label: 'Continue Application', value: 'continue' }
            ]
          )]);
        }
        break;

      case 'cover-letter':
        generateCoverLetter();
        break;

      case 'edit-cover-letter':
        setMessages(prev => [...prev, createMessage(
          'assistant',
          'Please provide any specific changes you\'d like to make to the cover letter, and I\'ll help you revise it.',
          'options',
          [
            { label: 'Generate New Cover Letter', value: 'new-cover-letter' },
            { label: 'Continue Application', value: 'continue' }
          ]
        )]);
        break;

      case 'new-cover-letter':
        generateCoverLetter();
        break;

      case 'upload-again':
        // Reset resume state and show upload zone
        setContext(prev => ({
          ...prev,
          applicationData: {
            ...prev.applicationData,
            resumeUrl: undefined,
            resumeContent: undefined
          }
        }));
        setResumeAnalysis(null);
        setMessages(prev => [...prev, createMessage(
          'assistant',
          'Please upload your resume again. Make sure it\'s in a supported format (PDF, DOC, or DOCX).'
        )]);
        break;

      case 'change-format':
        setContext(prev => ({
          ...prev,
          applicationData: {
            ...prev.applicationData,
            resumeUrl: undefined,
            resumeContent: undefined
          }
        }));
        setResumeAnalysis(null);
        setMessages(prev => [...prev, createMessage(
          'assistant',
          'Please try uploading your resume in a different format. For best results, use a DOC or DOCX file.'
        )]);
        break;

      case 'skip':
        // Skip resume analysis and move to next step
        proceedToNextStep();
        setMessages(prev => [...prev, createMessage(
          'assistant',
          'I understand. Let\'s proceed with your application without the resume analysis. Could you please tell me about your relevant experience for this position?',
          'text'
        )]);
        break;

      default:
        console.warn(`Unhandled option value: ${value}`);
    }
  };

  const handleRatingSelect = (rating: number) => {
    const currentSkill = context.skillAssessment.pending[0];
    if (!currentSkill) return;

    setContext(prev => ({
      ...prev,
      applicationData: {
        ...prev.applicationData,
        skills: {
          ...prev.applicationData.skills,
          [currentSkill]: { rating }
        }
      },
      skillAssessment: {
        completed: [...prev.skillAssessment.completed, currentSkill],
        pending: prev.skillAssessment.pending.slice(1)
      }
    }));

    // Ask for an example if rating is high
    if (rating >= 4) {
      setMessages(prev => [...prev, {
        id: `skill-example-${currentSkill}`,
        role: 'assistant',
        content: `Great! Could you share a specific example of how you've used ${currentSkill} in your work?`,
        timestamp: Date.now(),
        type: 'text'
      }]);
    } else {
      // Move to next skill or complete skills assessment
      if (context.skillAssessment.pending.length <= 1) {
        proceedToNextStep();
      }
    }
  };

  const proceedToNextStep = () => {
    const steps: ChatStep['type'][] = [
      'resume',
      'personal-info',
      'experience',
      'skills',
      'additional-info',
      'review'
    ];

    const currentIndex = steps.indexOf(context.currentStep.type);
    if (currentIndex < steps.length - 1) {
      setContext(prev => ({
        ...prev,
        currentStep: {
          id: steps[currentIndex + 1],
          type: steps[currentIndex + 1],
          completed: false,
          current: true
        }
      }));
    }
  };

  const handleError = (type: string) => {
    const errorMessages: Record<string, string> = {
      'resume-analysis': 'Failed to analyze resume. Would you like to try uploading it again?',
      'chat': 'I had trouble understanding that. Could you rephrase it?',
      'upload': 'Failed to upload file. Please try again.',
      'default': 'Something went wrong. Please try again.'
    };

    setMessages(prev => [...prev, {
      id: `error-${Date.now()}`,
      role: 'assistant',
      content: errorMessages[type] || errorMessages.default,
      timestamp: Date.now(),
      type: 'text'
    }]);
  };

  const renderActionButtons = () => {
    switch (context.currentStep.type) {
      case 'resume':
        return (
          <div className="flex gap-2 mt-4">
            <FileUpload
              accept=".pdf,.doc,.docx"
              maxSize={5 * 1024 * 1024}
              onUpload={handleFileUpload}
              isUploading={isUploading}
            />
          </div>
        );
      case 'review':
        return (
          <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
              onClick={() => setContext(prev => ({
                ...prev,
                currentStep: { ...prev.currentStep, type: 'personal-info' }
              }))}
            >
              Edit Application
            </Button>
            <Button
              onClick={submitApplication}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                  </>
                ) : (
                'Submit Application'
                )}
              </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const generateCoverLetter = async () => {
    try {
      setMessages(prev => [...prev, createMessage(
        'assistant',
        '✍️ Generating a tailored cover letter...',
        'text'
      )]);

      const prompt = `Generate a professional cover letter for the ${jobTitle} position based on:

Resume Analysis:
${resumeAnalysis ? `
- Skills Match: ${resumeAnalysis.skillMatch}%
- Experience Match: ${resumeAnalysis.experienceMatch}%
- Key Strengths: ${resumeAnalysis.keyStrengths.join(', ')}
` : ''}

Skills & Experience:
${Object.entries(context.applicationData.skills)
  .map(([skill, data]) => `- ${skill}: ${data.rating}/5${data.example ? ` (${data.example})` : ''}`)
  .join('\n')}

Current Role: ${context.applicationData.currentRole || 'Not specified'}
Years of Experience: ${context.applicationData.yearsOfExperience || 'Not specified'}

Job Requirements:
${JSON.stringify(context.jobRequirements, null, 2)}

Create a compelling cover letter that:
1. Highlights the candidate's relevant experience and skills
2. Addresses how they meet the job requirements
3. Shows enthusiasm for the role and company
4. Maintains a professional yet engaging tone

Format the cover letter with proper paragraphs and spacing.`;

      const response = await callAI(prompt);

      setContext(prev => ({
        ...prev,
        applicationData: {
          ...prev.applicationData,
          coverLetter: response
        }
      }));

      setMessages(prev => [...prev, createMessage(
        'assistant',
        `Here's your tailored cover letter:\n\n${response}\n\nWhat would you like to do next?`,
        'options',
        [
          { label: 'Edit Cover Letter', value: 'edit-cover-letter' },
          { label: 'Generate New', value: 'new-cover-letter' },
          { label: 'Continue Application', value: 'continue' }
        ]
      )]);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Failed to generate cover letter. Please try again.');
      setMessages(prev => [...prev, createMessage(
        'assistant',
        'I apologize, but I encountered an error while generating your cover letter. What would you like to do?',
        'options',
        [
          { label: 'Try Again', value: 'cover-letter' },
          { label: 'Continue Application', value: 'continue' }
        ]
      )]);
    }
  };

  const analyzeResume = async (resumeContent: string) => {
    try {
      setMessages(prev => [...prev, createMessage(
        'assistant',
        '🔍 Analyzing your resume...',
        'text'
      )]);

      const analysisPrompt = `You are an expert AI recruiter. Analyze the following resume for the ${jobTitle} position:

Resume Content:
${resumeContent}

Job Requirements:
${JSON.stringify(context.jobRequirements, null, 2)}

Analyze the resume and provide a detailed analysis in JSON format with the following structure:
{
  "skillMatch": number (0-100),
  "experienceMatch": number (0-100),
  "overallScore": number (0-100),
  "keyStrengths": string[] (3-5 points),
  "developmentAreas": string[] (2-3 points),
  "suggestedImprovements": string[] (2-4 points),
  "competitiveAnalysis": string (2-3 sentences),
  "roleAlignment": {
    "score": number (0-100),
    "feedback": string (1-2 sentences)
  }
}

Be thorough in your analysis and ensure all scores are justified based on the resume content and job requirements.
Format the response ONLY as valid JSON without any additional text.`;

      const analysisResponse = await callAI(analysisPrompt);
      
      try {
        const analysis = JSON.parse(analysisResponse) as ResumeAnalysis;
        setResumeAnalysis(analysis);
        
        const analysisMessage: Message = {
          id: 'resume-analysis',
          role: 'assistant',
          content: "I've analyzed your resume. Here's what I found:",
          timestamp: Date.now(),
          type: 'analysis',
          analysis: analysis
        };

        setMessages(prev => [...prev, analysisMessage]);

        // If score is below threshold, offer improvement suggestions
        if (analysis.overallScore < 70) {
          const suggestionMessage: Message = {
            id: 'improvement-suggestions',
            role: 'assistant',
            content: `Based on my analysis, here are some areas where we could strengthen your application:

${analysis.suggestedImprovements.map((improvement, index) => `${index + 1}. ${improvement}`).join('\n')}

What would you like to do next?`,
            timestamp: Date.now(),
            type: 'options',
            options: [
              { label: 'Get Detailed Improvement Tips', value: 'improvements' },
              { label: 'Generate Cover Letter', value: 'cover-letter' },
              { label: 'Continue As Is', value: 'continue' }
            ]
          };
          setMessages(prev => [...prev, suggestionMessage]);
        } else {
          setMessages(prev => [...prev, createMessage(
            'assistant',
            `Great news! Your resume shows a strong match for this position with an overall score of ${analysis.overallScore}%. What would you like to do next?`,
            'options',
            [
              { label: 'Continue Application', value: 'continue' },
              { label: 'View Detailed Analysis', value: 'view-analysis' }
            ]
          )]);
        }
      } catch (error) {
        console.error('Error parsing analysis response:', error);
        throw new Error('Failed to analyze resume content. Please try again or use a different format.');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setMessages(prev => [...prev, createMessage(
        'assistant',
        'I apologize, but I had trouble analyzing your resume. This could be due to the content format. Would you like to:',
        'options',
        [
          { label: 'Try Again', value: 'upload-again' },
          { label: 'Use Different Format', value: 'change-format' },
          { label: 'Skip Analysis', value: 'skip' }
        ]
      )]);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInitialFormSuccess = ({ name, email, leadId }: { name: string; email: string; leadId: string }) => {
    // Update context with user info
    setContext(prev => ({
      ...prev,
      applicationData: {
        ...prev.applicationData,
        name,
        email,
        leadId
      }
    }));

    // Hide form and start chat
    setShowInitialForm(false);
    startChat();
  };

  return showInitialForm ? (
    <InitialForm
      jobTitle={jobTitle}
      jobId={jobId}
      department={department}
      onSuccess={handleInitialFormSuccess}
    />
  ) : (
    <Card className="w-full max-w-3xl mx-auto">
      <div className="h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Application Chat</h2>
          </div>
          <ApplicationProgress
            steps={[...STEPS]}
            currentStep={context.currentStep.id}
            completedSteps={[...STEPS].slice(0, STEPS.findIndex(s => s.id === context.currentStep.id))}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(renderMessage)}
          {context.currentStep.type === 'resume' && !context.applicationData.resumeUrl && (
            <FileUploadZone
              onUpload={handleFileUpload}
              isUploading={isUploading}
              maxSize={5 * 1024 * 1024}
              accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              }}
            />
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t">
        <div className="flex gap-2">
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting || context.currentStep.type === 'resume'}
            />
          <Button
            onClick={handleSubmit}
              disabled={isSubmitting || !currentAnswer.trim() || context.currentStep.type === 'resume'}
              className="flex items-center gap-2"
          >
            {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Send className="w-4 h-4" />
            )}
              Send
          </Button>
        </div>
          {renderActionButtons()}
      </div>
    </div>
    </Card>
  );
}