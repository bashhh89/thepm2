import axios from 'axios';
import { API_URL } from '../../constants';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  created_at: string;
  updated_at: string;
  status: 'active' | 'filled' | 'draft' | 'archived';
  remote_policy?: string;
  work_schedule?: string;
  employment_type?: string;
  team_size?: number;
  reports_to?: string;
}

export interface JobCreate {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
}

const jobsApi = {
  getAll: async (): Promise<Job[]> => {
    const response = await axios.get(`${API_URL}/routes/jobs`);
    return response.data.jobs || [];
  },

  getById: async (id: string): Promise<Job> => {
    const response = await axios.get(`${API_URL}/routes/jobs/${id}`);
    return response.data;
  },

  create: async (job: JobCreate): Promise<Job> => {
    const response = await axios.post(`${API_URL}/routes/jobs`, job);
    return response.data;
  },

  update: async (id: string, job: Partial<JobCreate>): Promise<Job> => {
    const response = await axios.put(`${API_URL}/routes/jobs/${id}`, job);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/routes/jobs/${id}`);
  }
};

export default jobsApi;