import React, { useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { Card } from './Card';
import { Button } from './Button';
import { Message } from '../types';
import { FileText, Send, Info, Users, CheckCircle, Star, Gift, Calendar, BookOpen, ListChecks, Target, Briefcase } from 'lucide-react';

interface ChatApplicationAssistantProps {
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  companyInfo?: {
    culture?: string;
    benefits?: string;
    team?: { name: string; role: string; }[];
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface ResumeAnalysis {
  matchScore: number;
  keySkillsMatch: string[];
  missingSkills: string[];
  experienceMatch: string;
  suggestions: string[];
  completeness: {
    hasContactInfo: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    missingSections: string[];
  };
  relevantExperienceHighlights: { text: string; relevanceScore: number; }[];
}

// Add file processing utility functions
const extractTextFromPDF = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/extract-text', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract text from PDF');
    }

    const { text } = await response.json();
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

const processFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/extract-text', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract text from document');
    }

    const { text } = await response.json();
    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
};

export function ChatApplicationAssistant({
  jobId,
  jobTitle,
  jobDescription,
  companyInfo,
  onSuccess,
  onCancel
}: ChatApplicationAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome! I'm your AI recruiting assistant for the ${jobTitle} position. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationState, setApplicationState] = useState<
    'initial' | 'qualification_check' | 'analyzing' | 'reviewed' | 'submitting' | 'completed'
  >('initial');
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeContent, setResumeContent] = useState<string>('');
  const [qualificationAnswers, setQualificationAnswers] = useState<Record<string, string>>({});

  const addMessage = (role: 'assistant' | 'user', content: string) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  // Information retrieval functions
  const showRoleDetails = () => {
    const keyPoints = extractKeyPoints(jobDescription);
    addMessage('assistant', `Here's what you need to know about the ${jobTitle} role:\n\n${keyPoints}`);
  };

  const showCompanyCulture = () => {
    if (companyInfo?.culture) {
      addMessage('assistant', `Let me tell you about our company culture:\n\n${companyInfo.culture}`);
    } else {
      addMessage('assistant', 'I apologize, but I don\'t have detailed company culture information at the moment. Please check the company website or ask your recruiter for more details.');
    }
  };

  const showBenefits = () => {
    if (companyInfo?.benefits) {
      addMessage('assistant', `Here are the benefits offered:\n\n${companyInfo.benefits}`);
    } else {
      addMessage('assistant', 'I apologize, but I don\'t have detailed benefits information at the moment. Please check with your recruiter for the complete benefits package.');
    }
  };

  const showTeam = () => {
    if (companyInfo?.team?.length) {
      const teamInfo = companyInfo.team
        .map(member => `${member.name} - ${member.role}`)
        .join('\n');
      addMessage('assistant', `Here's the team you'll be working with:\n\n${teamInfo}`);
    } else {
      addMessage('assistant', 'Team information is not available at the moment. You\'ll get to meet the team during the interview process!');
    }
  };

  const startQualificationCheck = () => {
    setApplicationState('qualification_check');
    addMessage('assistant', `Let's quickly check if you meet the key qualifications for ${jobTitle}. Please answer these questions:\n\n1. Do you have the required education level?\n2. Do you have the minimum years of experience?\n3. Are you authorized to work in this location?`);
  };

  const showApplicationSteps = () => {
    addMessage('assistant', `Here's the application process for ${jobTitle}:\n\n1. Initial Qualification Check\n2. Resume Upload & Analysis\n3. Skills Assessment\n4. Application Review\n5. Interview Process\n\nI'll guide you through each step!`);
  };

  // Resume analysis functions
  const checkResumeCompleteness = async () => {
    if (!resumeContent) {
      addMessage('assistant', 'Please upload your resume first so I can review it for you.');
      return;
    }

    const analysis = resumeAnalysis?.completeness;
    if (analysis) {
      const missingItems = analysis.missingSections.length > 0
        ? `\n\nConsider adding these sections to strengthen your application:\n${analysis.missingSections.join('\n')}`
        : '\n\nYour resume appears to have all the essential sections!';

      addMessage('assistant', `Resume Completeness Check:\n
✓ Contact Information: ${analysis.hasContactInfo ? 'Present' : 'Missing'}
✓ Experience: ${analysis.hasExperience ? 'Present' : 'Missing'}
✓ Education: ${analysis.hasEducation ? 'Present' : 'Missing'}
✓ Skills: ${analysis.hasSkills ? 'Present' : 'Missing'}${missingItems}`);
    }
  };

  const highlightRelevantExperience = () => {
    if (!resumeAnalysis?.relevantExperienceHighlights) {
      addMessage('assistant', 'Please upload your resume first so I can analyze your relevant experience.');
      return;
    }

    const highlights = resumeAnalysis.relevantExperienceHighlights
      .filter(h => h.relevanceScore > 0.7)
      .map(h => `• ${h.text}`)
      .join('\n');

    addMessage('assistant', `Here are the most relevant experiences from your resume:\n\n${highlights}`);
  };

  const analyzeResume = async (fileContent: string) => {
    // Here we would integrate with an AI service to analyze the resume
    const analysis = await window.puter.ai.chat(`
      Analyze this resume for the ${jobTitle} position:
      ${fileContent}
      
      Job Description:
      ${jobDescription}
      
      Provide analysis in this JSON format:
      {
        "matchScore": number between 0-100,
        "keySkillsMatch": [matching skills found],
        "missingSkills": [important skills not found],
        "experienceMatch": "description of experience match",
        "suggestions": [improvement suggestions],
        "completeness": {
          "hasContactInfo": boolean,
          "hasExperience": boolean,
          "hasEducation": boolean,
          "hasSkills": boolean,
          "missingSections": [missing sections]
        },
        "relevantExperienceHighlights": [{ "text": string, "relevanceScore": number }]
      }
    `);

    try {
      const analysisData = JSON.parse(analysis.message?.content || '{}');
      setResumeAnalysis(analysisData);
      return analysisData;
    } catch (error) {
      console.error('Error parsing resume analysis:', error);
      return null;
    }
  };

  const generateCoverLetter = async () => {
    if (!resumeContent) return;

    const prompt = `
      Generate a professional cover letter based on this resume:
      ${resumeContent}
      
      For this job:
      ${jobTitle}
      
      Job Description:
      ${jobDescription}
    `;

    const response = await window.puter.ai.chat(prompt);
    const coverLetter = response.message?.content || 'Error generating cover letter';
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Here\'s a suggested cover letter for your application:\n\n' + coverLetter,
      timestamp: new Date()
    }]);
  };

  const handleFileAttachment = async (file: File) => {
    if (!file) return;
  
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
  
    if (!allowedTypes.includes(file.type)) {
      addMessage('assistant', 'Please upload a PDF, Word document, or text file.');
      return;
    }

    // Validate file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      addMessage('assistant', 'File size must be less than 5MB.');
      return;
    }

    try {
      addMessage('assistant', 'Processing your document...');
      
      // Extract text from the document
      const formData = new FormData();
      formData.append('file', file);
      
      const extractResponse = await fetch('http://localhost:8000/routes/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!extractResponse.ok) {
        const errorText = await extractResponse.text();
        console.error('Server error:', errorText);
        throw new Error('Failed to extract text from document');
      }

      const result = await extractResponse.json();
      if (!result || !result.text) {
        throw new Error('Invalid response format from server');
      }

      const textContent = result.text;
      setResumeContent(textContent);

      // Analyze the resume
      const analysis = await analyzeResume(textContent);
      
      if (analysis) {
        const matchPercentage = Math.round(analysis.matchScore);
        const responseText = `
          I've analyzed your resume for the ${jobTitle} position:

          Match Score: ${matchPercentage}%
          Key Skills Match: ${analysis.keySkillsMatch.join(', ')}
          ${analysis.missingSkills.length > 0 ? `\nConsider adding experience in: ${analysis.missingSkills.join(', ')}` : ''}
          
          ${analysis.suggestions.length > 0 ? `\nSuggestions to improve your application:\n${analysis.suggestions.map(s => `• ${s}`).join('\n')}` : ''}
          
          Would you like me to:
          1. Generate a tailored cover letter
          2. Highlight your most relevant experience
          3. Provide detailed skills analysis
          4. Proceed with submitting your application
        `;
        
        setResumeAnalysis(analysis);
        setApplicationState('reviewed');
        addMessage('assistant', responseText);
      }
    } catch (error) {
      console.error('Error processing document:', error);
      addMessage('assistant', `I apologize, but I encountered an error: ${error.message}. Please try again or upload a different file.`);
    }
  };

  const handleSendMessage = async (content: string, attachment?: { url: string; type: string; name: string }) => {
    if (isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
      attachment
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      if (attachment) {
        // Add a loading message
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Processing your document...',
          timestamp: new Date()
        }]);

        // Fetch the file content
        const response = await fetch(attachment.url);
        const blob = await response.blob();
        const file = new File([blob], attachment.name, { type: blob.type });

        try {
          // Extract text from the document
          const textContent = await processFile(file);
          setResumeContent(textContent);

          // Update the loading message
          setMessages(prev => [...prev.slice(0, -1), {
            role: 'assistant',
            content: 'Analyzing your resume...',
            timestamp: new Date()
          }]);

          // Analyze the resume
          const analysis = await analyzeResume(textContent);
          
          if (analysis) {
            const responseText = `
              I've analyzed your resume for the ${jobTitle} position:
              
              Match Score: ${analysis.matchScore}%
              Key Skills Match: ${analysis.keySkillsMatch.join(', ')}
              Areas for Improvement: ${analysis.missingSkills.join(', ')}
              Experience Match: ${analysis.experienceMatch}
              
              Would you like to:
              1. Generate a tailored cover letter
              2. See detailed skill analysis
              3. Get improvement suggestions
              4. Proceed with submitting your application
              
              Please select an option or ask any questions you have.
            `;
            
            setResumeAnalysis(analysis);
            setApplicationState('reviewed');
            
            setMessages(prev => [...prev.slice(0, -1), {
              role: 'assistant',
              content: responseText,
              timestamp: new Date()
            }]);
          }
        } catch (error) {
          console.error('Error processing document:', error);
          setMessages(prev => [...prev.slice(0, -1), {
            role: 'assistant',
            content: 'I apologize, but I had trouble processing your document. Please make sure it\'s a PDF, Word document, or text file and try again.',
            timestamp: new Date()
          }]);
        }
      } else if (content.toLowerCase().includes('cover letter')) {
        await generateCoverLetter();
      } else if (content.toLowerCase().includes('submit')) {
        setApplicationState('submitting');
        
        // Here you would integrate with your application submission endpoint
        const applicationData = {
          jobId,
          resumeContent,
          coverLetter: messages.find(m => m.content.includes('Here\'s a suggested cover letter'))?.content,
          analysis: resumeAnalysis
        };

        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setApplicationState('completed');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Your application has been submitted successfully! We\'ll review it and get back to you soon.',
          timestamp: new Date()
        }]);

        onSuccess();
      } else {
        // Handle other chat interactions
        const chatPrompt = `
          Previous conversation: ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
          User message: ${content}
          Job title: ${jobTitle}
          Job description: ${jobDescription}
          Resume analysis: ${JSON.stringify(resumeAnalysis)}
          
          Provide a helpful response to guide them through the application process.
        `;

        const aiResponse = await window.puter.ai.chat(chatPrompt);
        const responseText = aiResponse.message?.content || 'I apologize, I encountered an issue. Please try again.';
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: responseText,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-4">
        <ChatMessages messages={messages} isTyping={isProcessing} />
      </div>
      
      {applicationState === 'initial' && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={showRoleDetails}>
            <Info className="h-4 w-4 mr-2" />
            Learn More About the Role
          </Button>
          <Button variant="outline" onClick={showCompanyCulture}>
            <Users className="h-4 w-4 mr-2" />
            Company Culture
          </Button>
          <Button variant="outline" onClick={startQualificationCheck}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Am I Qualified?
          </Button>
          <Button variant="outline" onClick={showBenefits}>
            <Gift className="h-4 w-4 mr-2" />
            Benefits Quick View
          </Button>
          <Button variant="outline" onClick={showTeam}>
            <Users className="h-4 w-4 mr-2" />
            Meet the Team
          </Button>
          <Button variant="outline" onClick={showApplicationSteps}>
            <ListChecks className="h-4 w-4 mr-2" />
            Application Steps
          </Button>
        </div>
      )}

      {resumeAnalysis && applicationState === 'reviewed' && (
        <div className="mb-4 flex gap-2 flex-wrap">
          <Button variant="outline" onClick={checkResumeCompleteness}>
            <ListChecks className="h-4 w-4 mr-2" />
            Resume Completeness Check
          </Button>
          <Button variant="outline" onClick={highlightRelevantExperience}>
            <Target className="h-4 w-4 mr-2" />
            Highlight Relevant Experience
          </Button>
          <Button variant="outline" onClick={() => generateCoverLetter()}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Cover Letter
          </Button>
          <Button
            variant="default"
            onClick={() => handleSendMessage('submit application')}
            disabled={isProcessing || applicationState === 'completed'}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Application
          </Button>
        </div>
      )}

      <ChatInput
        onSendMessage={handleSendMessage}
        isDisabled={isProcessing || applicationState === 'completed'}
        placeholder={
          applicationState === 'initial'
            ? "Upload your resume or ask me anything about the position..."
            : applicationState === 'qualification_check'
            ? "Answer the qualification questions..."
            : applicationState === 'analyzing'
            ? "Analyzing your resume..."
            : applicationState === 'reviewed'
            ? "Select an action above or ask any questions..."
            : applicationState === 'submitting'
            ? "Submitting your application..."
            : "Application submitted successfully!"
        }
      />
    </Card>
  );
}

// Helper function to extract key points from job description
function extractKeyPoints(description: string): string {
  // Implementation would use AI to extract and format key points
  return description;
}