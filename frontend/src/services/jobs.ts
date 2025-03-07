import axios from 'axios';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  created_at: string;
  updated_at: string;
  status?: 'active' | 'filled' | 'draft' | 'archived';
}

export interface JobCreate {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const jobsApi = {
  getJobs: async (): Promise<Job[]> => {
    const response = await axios.get(`${API_URL}/jobs`);
    return response.data.jobs;
  },

  getJob: async (id: string): Promise<Job> => {
    const response = await axios.get(`${API_URL}/jobs/${id}`);
    return response.data;
  },

  createJob: async (job: JobCreate): Promise<Job> => {
    const response = await axios.post(`${API_URL}/jobs`, job);
    return response.data;
  },

  updateJob: async (id: string, job: Partial<JobCreate>): Promise<Job> => {
    const response = await axios.put(`${API_URL}/jobs/${id}`, job);
    return response.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/jobs/${id}`);
  }
};