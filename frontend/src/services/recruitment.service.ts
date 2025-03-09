import { supabase } from '../AppWrapper';
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

export class RecruitmentService {
  // Job Management
  async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateJob(id: string, job: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getJobs(tenantId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, company:companies(*)')
      .eq('tenantId', tenantId);

    if (error) throw error;
    return data;
  }

  async getJob(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, company:companies(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Candidate Management
  async createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidate)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCandidate(id: string, candidate: Partial<Candidate>) {
    const { data, error } = await supabase
      .from('candidates')
      .update(candidate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCandidates(tenantId: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*, applications:job_applications(*)')
      .eq('tenantId', tenantId);

    if (error) throw error;
    return data;
  }

  async getCandidate(id: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*, applications:job_applications(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Application Management
  async createApplication(application: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert(application)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateApplication(id: string, application: Partial<JobApplication>) {
    const { data, error } = await supabase
      .from('job_applications')
      .update(application)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getApplications(tenantId: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, job:jobs(*), candidate:candidates(*)')
      .eq('tenantId', tenantId);

    if (error) throw error;
    return data;
  }

  // Interview Management
  async scheduleInterview(interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('interviews')
      .insert(interview)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateInterview(id: string, interview: Partial<Interview>) {
    const { data, error } = await supabase
      .from('interviews')
      .update(interview)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getInterviews(applicationId: string) {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('applicationId', applicationId);

    if (error) throw error;
    return data;
  }

  // Assessment Management
  async createAssessment(assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('assessments')
      .insert(assessment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateAssessment(id: string, assessment: Partial<Assessment>) {
    const { data, error } = await supabase
      .from('assessments')
      .update(assessment)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAssessments(candidateId: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('candidateId', candidateId);

    if (error) throw error;
    return data;
  }

  // Notes Management
  async addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getNotes(params: { applicationId?: string; interviewId?: string }) {
    let query = supabase.from('notes').select('*');
    
    if (params.applicationId) {
      query = query.eq('applicationId', params.applicationId);
    }
    if (params.interviewId) {
      query = query.eq('interviewId', params.interviewId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Analytics
  async getRecruiterStats(tenantId: string): Promise<RecruiterStats> {
    const { data, error } = await supabase.rpc('get_recruiter_stats', {
      p_tenant_id: tenantId
    });

    if (error) throw error;
    return data;
  }

  async getRecruitmentMetrics(tenantId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<RecruitmentMetrics> {
    const { data, error } = await supabase.rpc('get_recruitment_metrics', {
      p_tenant_id: tenantId,
      p_period: period
    });

    if (error) throw error;
    return data;
  }
}