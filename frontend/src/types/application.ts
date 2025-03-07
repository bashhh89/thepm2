export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewed' | 'approved' | 'rejected';

export type ChatButtonType = 
  | 'LEARN_MORE' 
  | 'COMPANY_CULTURE'
  | 'QUALIFICATION_CHECK'
  | 'KEY_SKILLS'
  | 'BENEFITS'
  | 'MEET_TEAM'
  | 'PROCESS_STEPS'
  | 'RESUME_CHECK'
  | 'HIGHLIGHT_EXPERIENCE'
  | 'PREFILL_APPLICATION'
  | 'SKILLS_ASSESSMENT'
  | 'CULTURE_FIT'
  | 'EXPRESS_INTEREST';

export interface ChatButton {
  type: ChatButtonType;
  label: string;
  action: string;
  requiresResume?: boolean;
  disabled?: boolean;
  tooltip?: string;
  order?: number; // For controlling button display order
  category?: 'onboarding' | 'resume' | 'assessment' | 'action';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  buttons?: ChatButton[];
  attachments?: {
    type: 'resume' | 'coverLetter' | 'portfolio';
    url: string;
    name: string;
  }[];
}

export interface QualificationQuestion {
  id: string;
  text: string;
  type: 'yes_no' | 'multiple_choice' | 'short_answer';
  options?: string[];
  required: boolean;
  weight?: number; // For scoring importance
  minimumRequirement?: boolean; // If this is a must-have qualification
}

export interface QualificationAssessment {
  qualified: boolean;
  score: number;
  feedback: string;
  missingRequirements?: string[];
  recommendedNext?: ChatButtonType;
}

export interface QualificationCheck {
  questions: Array<{
    text: string;
    type: 'yes_no' | 'multiple_choice';
    options?: string[];
    answer?: string;
    required: boolean;
  }>;
  assessment?: {
    qualified: boolean;
    score: number;
    feedback: string;
  };
}

export interface ResumeAnalysis {
  completeness: {
    score: number;
    missingSections?: string[];
    suggestions: string[];
  };
  relevantExperience: Array<{
    section: string;
    text: string;
    relevanceScore: number;
    highlights: string[];
    matchedKeywords?: string[];
  }>;
  skills: {
    matching: string[];
    missing: string[];
    additional: string[];
    relevanceScores?: Record<string, number>;
  };
  suggestedImprovements?: string[];
}

export interface ApplicationData {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  portfolioUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  expectedSalary?: number;
  noticePeriod?: number;
  preScreeningAnswers?: {
    qualificationResponses: Record<string, string | boolean>;
    skillsAssessment?: {
      questions: Array<{
        question: string;
        answer: string;
        score?: number;
      }>;
      overallScore?: number;
    };
    cultureFitResponses?: Array<{
      question: string;
      response: string;
    }>;
  };
  chatInteractions?: {
    buttonsClicked: ChatButtonType[];
    qualificationResponses?: Record<string, string>;
    cultureFitResponses?: Record<string, string>;
    skillsAssessmentScore?: number;
    lastInteractionAt: string;
  };
  aiAnalysis?: {
    initialQualificationCheck?: QualificationAssessment;
    resumeAnalysis?: ResumeAnalysis;
    cultureFitScore?: number;
    skillsAssessmentResults?: {
      overallScore: number;
      bySkill: Record<string, number>;
      recommendations?: string[];
    };
    suggestedNextSteps?: ChatButtonType[];
  };
}

export interface Application {
  id: string;
  jobId: string;
  applicationData: ApplicationData;
  status: ApplicationStatus;
  createdAt: string;
  job?: {
    title: string;
    department: string;
    description: string;
    requirements: string[];
    benefits: string[];
    teamInfo?: {
      members: Array<{
        name: string;
        role: string;
        photoUrl?: string;
      }>;
    };
  };
  chatHistory?: ChatMessage[];
  aiAnalysis?: {
    qualificationScore?: number;
    relevantSkills?: string[];
    suggestedQuestions?: string[];
    cultureFitScore?: number;
    resumeCompleteness?: {
      score: number;
      missingSections?: string[];
    };
    highlightedExperience?: {
      sections: Array<{
        text: string;
        relevanceScore: number;
      }>;
    };
  };
}