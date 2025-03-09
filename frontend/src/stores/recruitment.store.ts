import { create } from 'zustand';
import { RecruitmentService } from '../services/recruitment.service';
import type { 
  Job, 
  Candidate, 
  JobApplication, 
  Interview,
  Assessment,
  Note,
  RecruiterStats,
  RecruitmentMetrics
} from '../types/recruitment';

interface RecruitmentState {
  // Data
  jobs: Job[];
  candidates: Candidate[];
  applications: JobApplication[];
  stats: RecruiterStats | null;
  metrics: RecruitmentMetrics | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;

  // Service instance
  service: RecruitmentService;

  // Actions
  loadJobs: (tenantId: string) => Promise<void>;
  loadCandidates: (tenantId: string) => Promise<void>;
  loadApplications: (tenantId: string) => Promise<void>;
  loadStats: (tenantId: string) => Promise<void>;
  loadMetrics: (tenantId: string, period: 'day' | 'week' | 'month' | 'year') => Promise<void>;
  
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Job>;
  updateJob: (id: string, job: Partial<Job>) => Promise<Job>;
  
  createCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Candidate>;
  updateCandidate: (id: string, candidate: Partial<Candidate>) => Promise<Candidate>;
  
  createApplication: (application: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<JobApplication>;
  updateApplication: (id: string, application: Partial<JobApplication>) => Promise<JobApplication>;
  
  scheduleInterview: (interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Interview>;
  updateInterview: (id: string, interview: Partial<Interview>) => Promise<Interview>;
  
  createAssessment: (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Assessment>;
  updateAssessment: (id: string, assessment: Partial<Assessment>) => Promise<Assessment>;
  
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
}

export const useRecruitmentStore = create<RecruitmentState>((set, get) => ({
  // Initial state
  jobs: [],
  candidates: [],
  applications: [],
  stats: null,
  metrics: null,
  isLoading: false,
  error: null,
  service: new RecruitmentService(),

  // Load data
  loadJobs: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      const jobs = await get().service.getJobs(tenantId);
      set({ jobs, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  loadCandidates: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      const candidates = await get().service.getCandidates(tenantId);
      set({ candidates, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  loadApplications: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      const applications = await get().service.getApplications(tenantId);
      set({ applications, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  loadStats: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      const stats = await get().service.getRecruiterStats(tenantId);
      set({ stats, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  loadMetrics: async (tenantId: string, period) => {
    try {
      set({ isLoading: true, error: null });
      const metrics = await get().service.getRecruitmentMetrics(tenantId, period);
      set({ metrics, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Job actions
  createJob: async (job) => {
    try {
      set({ isLoading: true, error: null });
      const newJob = await get().service.createJob(job);
      set(state => ({ 
        jobs: [...state.jobs, newJob],
        isLoading: false 
      }));
      return newJob;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateJob: async (id, job) => {
    try {
      set({ isLoading: true, error: null });
      const updatedJob = await get().service.updateJob(id, job);
      set(state => ({
        jobs: state.jobs.map(j => j.id === id ? updatedJob : j),
        isLoading: false
      }));
      return updatedJob;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Candidate actions
  createCandidate: async (candidate) => {
    try {
      set({ isLoading: true, error: null });
      const newCandidate = await get().service.createCandidate(candidate);
      set(state => ({
        candidates: [...state.candidates, newCandidate],
        isLoading: false
      }));
      return newCandidate;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCandidate: async (id, candidate) => {
    try {
      set({ isLoading: true, error: null });
      const updatedCandidate = await get().service.updateCandidate(id, candidate);
      set(state => ({
        candidates: state.candidates.map(c => c.id === id ? updatedCandidate : c),
        isLoading: false
      }));
      return updatedCandidate;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Application actions
  createApplication: async (application) => {
    try {
      set({ isLoading: true, error: null });
      const newApplication = await get().service.createApplication(application);
      set(state => ({
        applications: [...state.applications, newApplication],
        isLoading: false
      }));
      return newApplication;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateApplication: async (id, application) => {
    try {
      set({ isLoading: true, error: null });
      const updatedApplication = await get().service.updateApplication(id, application);
      set(state => ({
        applications: state.applications.map(a => a.id === id ? updatedApplication : a),
        isLoading: false
      }));
      return updatedApplication;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Interview actions
  scheduleInterview: async (interview) => {
    try {
      set({ isLoading: true, error: null });
      const newInterview = await get().service.scheduleInterview(interview);
      set({ isLoading: false });
      return newInterview;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateInterview: async (id, interview) => {
    try {
      set({ isLoading: true, error: null });
      const updatedInterview = await get().service.updateInterview(id, interview);
      set({ isLoading: false });
      return updatedInterview;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Assessment actions
  createAssessment: async (assessment) => {
    try {
      set({ isLoading: true, error: null });
      const newAssessment = await get().service.createAssessment(assessment);
      set({ isLoading: false });
      return newAssessment;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateAssessment: async (id, assessment) => {
    try {
      set({ isLoading: true, error: null });
      const updatedAssessment = await get().service.updateAssessment(id, assessment);
      set({ isLoading: false });
      return updatedAssessment;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Note actions
  addNote: async (note) => {
    try {
      set({ isLoading: true, error: null });
      const newNote = await get().service.addNote(note);
      set({ isLoading: false });
      return newNote;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));