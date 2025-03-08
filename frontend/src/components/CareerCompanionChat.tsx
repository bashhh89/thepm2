import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Loader2, Send, Upload, Bot, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Markdown } from './Markdown';

interface ParsedResume {
  text: string;
  metadata: {
    sections: {
      type: 'contact' | 'education' | 'experience' | 'skills' | 'summary' | 'other';
      content: string;
      confidence: number;
    }[];
    detected_name?: string;
    detected_email?: string;
    detected_phone?: string;
    detected_links?: string[];
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: ParsedResume['metadata'];
}

const generateInitialAnalysis = (metadata: ParsedResume['metadata']): string => {
  const sections = metadata.sections;
  const missingCore = ['summary', 'experience', 'education', 'skills']
    .filter(section => !sections.some(s => s.type === section));
  
  let analysis = '## Initial Resume Analysis\n\n';
  
  if (metadata.detected_name) {
    analysis += `Hello ${metadata.detected_name}! 👋\n\n`;
  }

  analysis += '### Document Structure\n';
  if (missingCore.length === 0) {
    analysis += '✅ Your resume includes all core sections!\n\n';
  } else {
    analysis += `⚠️ Consider adding these missing core sections: ${missingCore.join(', ')}\n\n`;
  }

  analysis += '### Contact Information\n';
  const contactChecklist = [
    { item: 'Email', value: metadata.detected_email },
    { item: 'Phone', value: metadata.detected_phone },
    { item: 'Professional Links', value: metadata.detected_links?.length ? metadata.detected_links.join(', ') : null }
  ];

  contactChecklist.forEach(({ item, value }) => {
    analysis += value ? `✅ ${item}: ${value}\n` : `❌ Missing ${item}\n`;
  });

  analysis += '\n### Detected Sections\n';
  sections.forEach(section => {
    analysis += `- ${section.type.charAt(0).toUpperCase() + section.type.slice(1)}\n`;
  });

  analysis += '\n*Analyzing content in detail...*';
  
  return analysis;
};

export default function CareerCompanionChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: `# Welcome to Career Companion! 👋

I'm your AI career advisor. I can help you with:
- Resume analysis and improvement
- Cover letter writing
- Interview preparation
- Career advice and planning
- Job search strategies

How can I assist you today?`,
    timestamp: Date.now()
  }]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPuterReady, setIsPuterReady] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkPuter = () => {
      if (window.puter?.ai?.chat) {
        setIsPuterReady(true);
      } else {
        const onPuterReady = () => {
          setIsPuterReady(true);
          window.removeEventListener('puterready', onPuterReady);
        };
        const onPuterError = (event: CustomEvent) => {
          toast.error(event.detail || 'Failed to initialize AI. Please refresh the page.');
          window.removeEventListener('putererror', onPuterError as EventListener);
        };
        window.addEventListener('puterready', onPuterReady);
        window.addEventListener('putererror', onPuterError as EventListener);

        return () => {
          window.removeEventListener('puterready', onPuterReady);
          window.removeEventListener('putererror', onPuterError as EventListener);
        };
      }
    };

    const cleanup = checkPuter();
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing || !isPuterReady) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Use window.puter.ai.chat for AI responses
      const response = await window.puter.ai.chat(`
        Previous conversation: ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
        User message: ${input}
        
        You are an expert career advisor. Provide helpful career advice, resume tips, or interview preparation guidance.
        Use markdown formatting for better readability.
      `);

      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.toString(),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isPuterReady) return;

    // Validate file size (5MB) and type
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    setIsUploading(true);

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '📄 Processing your resume...',
        timestamp: Date.now()
      }]);

      // Upload and extract text from file
      const uploadResponse = await fetch('/routes/extract-text', {
        method: 'POST',
        body: formData
      });

      // Check if response is ok and has content
      if (!uploadResponse.ok) {
        // Try to read error details from response
        let errorMessage = 'Failed to process resume';
        try {
          const contentType = uploadResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await uploadResponse.json();
            errorMessage = errorData.detail || errorData.error || errorMessage;
          } else {
            // Handle HTML or other non-JSON responses
            const text = await uploadResponse.text();
            console.log('Non-JSON error response:', text.substring(0, 100) + '...');
            
            if (uploadResponse.status === 404) {
              errorMessage = 'Extract text service unavailable (404). Please ensure the backend server is running.';
            } else {
              errorMessage = `Server error (${uploadResponse.status})`;
            }
          }
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      // Parse the response carefully
      let responseData;
      const contentType = uploadResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', contentType);
        throw new Error('Server returned a non-JSON response');
      }
      
      try {
        responseData = await uploadResponse.json();
      } catch (e) {
        console.error('Failed to parse response JSON:', e);
        throw new Error('Server returned an invalid JSON response');
      }

      if (!responseData || !responseData.text) {
        throw new Error('No text could be extracted from the document');
      }

      const resumeContent = responseData.text;

      // Add analysis message
      setMessages(prev => [...prev.filter(m => m.content !== '📄 Processing your resume...'), {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'Analyzing your resume...',
        timestamp: Date.now()
      }]);

      // Analyze the resume content using Puter AI
      const aiResponse = await window.puter.ai.chat(`
        You are an expert resume analyzer and career advisor. Analyze this resume text and provide specific, actionable feedback:

        ${resumeContent}

        Provide a detailed analysis including:
        1. Overall assessment (2-3 sentences)
        2. Key strengths and accomplishments (bullet points)
        3. Areas for improvement (bullet points)
        4. Specific recommendations for enhancement (bullet points)
        5. Industry and role fit based on experience

        Format your response in markdown with clear sections and bullet points.
        Be specific and actionable in your feedback.
        If you notice any red flags or missing important elements, highlight them.
      `);

      // Add analysis message
      setMessages(prev => [...prev.filter(m => m.content !== 'Analyzing your resume...'), {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse.toString(),
        timestamp: Date.now()
      }]);

    } catch (error) {
      console.error('Error uploading/analyzing file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process resume';
      toast.error(errorMessage);
      
      // Remove loading message if present
      setMessages(prev => prev.filter(m => 
        !['📄 Processing your resume...', 'Analyzing your resume...'].includes(m.content)
      ));

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${errorMessage}. Please try uploading again or try a different file format.`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = ''; // Reset file input
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Career Companion</h2>
          </div>
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('resume-upload')?.click()}
            disabled={isUploading || !isPuterReady}
            title={!isPuterReady ? "Initializing AI..." : undefined}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : !isPuterReady ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'} gap-2`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'assistant'
                      ? 'bg-card border'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isProcessing}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}