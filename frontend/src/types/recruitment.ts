export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  department?: string;
  location: string;
  type: JobType;
  experience?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  status: JobStatus;
  companyId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type JobType = 
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'temporary'
  | 'internship';

export type JobStatus = 
  | 'draft'
  | 'published'
  | 'closed'
  | 'archived';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  company: string;
  title: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrentRole?: boolean;
  description?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  grade?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  tenantId: string;
  status: ApplicationStatus;
  stage: ApplicationStage;
  coverLetter?: string;
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationStatus =
  | 'pending'
  | 'reviewing'
  | 'shortlisted'
  | 'interviewed'
  | 'offered'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type ApplicationStage =
  | 'new'
  | 'screening'
  | 'first_interview'
  | 'assessment'
  | 'second_interview'
  | 'final_interview'
  | 'reference_check'
  | 'offer'
  | 'closed';

export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  scheduledAt: Date;
  duration: number; // in minutes
  status: InterviewStatus;
  feedback?: string;
  recording?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterviewType =
  | 'phone'
  | 'video'
  | 'onsite'
  | 'technical'
  | 'cultural';

export type InterviewStatus =
  | 'scheduled'
  | 'rescheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Assessment {
  id: string;
  candidateId: string;
  type: AssessmentType;
  score?: number;
  results?: Record<string, any>;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AssessmentType =
  | 'technical'
  | 'personality'
  | 'cognitive'
  | 'language'
  | 'skills';

export interface Note {
  id: string;
  content: string;
  type: NoteType;
  applicationId?: string;
  interviewId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteType =
  | 'general'
  | 'feedback'
  | 'interview'
  | 'offer'
  | 'internal';

export interface RecruiterStats {
  openJobs: number;
  activeCandidates: number;
  pendingApplications: number;
  scheduledInterviews: number;
  offersPending: number;
  timeToHire: number;
  costPerHire: number;
}

export interface RecruitmentMetrics {
  jobMetrics: {
    totalJobs: number;
    activeJobs: number;
    fillRate: number;
    averageTimeToFill: number;
  };
  candidateMetrics: {
    totalCandidates: number;
    activeApplications: number;
    conversionRate: number;
    sourceEffectiveness: Record<string, number>;
  };
  interviewMetrics: {
    scheduledInterviews: number;
    completedInterviews: number;
    passRate: number;
    noShowRate: number;
  };
  offerMetrics: {
    offersExtended: number;
    offersAccepted: number;
    acceptanceRate: number;
    averageSalary: number;
  };
}