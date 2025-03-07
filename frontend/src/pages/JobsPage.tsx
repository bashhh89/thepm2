import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Card } from '../components/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/Dialog';
import { Label } from '../components/Label';
import { Wand2, Briefcase, Building2, MapPin, Clock, Loader2, X, Search, Sparkles, ChevronDown, ChevronUp, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  created_at: string;  // Match backend field name
  updated_at: string;  // Match backend field name
  status?: 'active' | 'filled' | 'draft' | 'archived';
  trainingData?: string; // Add optional training data field
}

// Add new interface for AI generation
interface AIGenerationState {
  title: boolean;
  description: boolean;
  requirements: boolean;
  benefits: boolean;
  trainingData: boolean;
}

interface PuterAI {
  chat: (messages: Array<{ role: string; content: string }>) => Promise<PuterAIResponse>;
}

interface PuterWindow extends Window {
  puter?: {
    ai?: PuterAI;
  };
}

interface PuterAIResponse {
  message?: {
    content: string;
    tool_calls?: any[];
    role?: string;
  };
  text?: string;
  content?: string | Record<string, any>;
  type?: string;
}

const callPuterAI = async (prompt: string): Promise<string> => {
  console.log("callPuterAI called with prompt:", prompt);

  try {
    const puter = (window as PuterWindow).puter;
    if (!puter?.ai?.chat) {
      throw new Error('Puter AI is not initialized');
    }

    const messages = [
      {
        role: 'system',
        content: 'You are a professional HR assistant helping to create job postings. Provide concise, professional responses.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await puter.ai.chat(messages);

    console.log("Puter AI Response:", response);

    if (typeof response === 'string') {
      return response;
    }

    if ('message' in response && typeof response.message?.content === 'string') {
      return response.message.content;
    }

    if ('content' in response && response.content) {
      return typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
    }

    if ('text' in response && typeof response.text === 'string') {
      return response.text;
    }

    throw new Error('Unexpected response format from Puter AI');
  } catch (error) {
    console.error('Puter AI error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};

export default function JobsPage() {
  // State for job list and filters
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  
  // State for job creation
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    description: '',
    requirements: [''],
    benefits: [''],
    trainingData: '' // Add training data field
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState<AIGenerationState>({
    title: false,
    description: false,
    requirements: false,
    benefits: false,
    trainingData: false
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');

      const { fileUrl } = await response.json();
      setNewJob(prev => ({ ...prev, trainingData: fileUrl }));
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploadedFile(null);
    }
  };

  // Add editing state
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Add delete confirmation dialog state
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [debouncedTitleValue, setDebouncedTitleValue] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch jobs on component mount
  React.useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data: response, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Update to match backend response format which includes jobs in data
      setJobs(response || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error(handleSupabaseError(error).error);
    }
  };

  const createJob = async () => {
    if (!newJob.title || !newJob.department || !newJob.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Add validation for training data
    if (!newJob.trainingData) {
      const proceed = window.confirm('No training data provided. Training data helps our AI better understand the role and provide more accurate responses to applicants. Would you like to proceed anyway?');
      if (!proceed) return;
    }

    setIsCreating(true);
    try {
      if (editingJob) {
        // Update existing job
        const { data, error } = await supabase
          .from('jobs')
          .update({
            title: newJob.title,
            department: newJob.department,
            location: newJob.location,
            type: newJob.type,
            experience: newJob.experience,
            description: newJob.description,
            requirements: newJob.requirements.filter(Boolean),
            benefits: newJob.benefits.filter(Boolean),
            trainingData: newJob.trainingData || null, // Include training data in update
            updated_at: new Date().toISOString(),
            status: 'active'
          })
          .eq('id', editingJob.id)
          .select();

        if (error) throw error;
        
        toast.success('Job updated successfully!');
      } else {
        // Create new job - match backend JobCreate model
        const jobData = {
          title: newJob.title,
          department: newJob.department,
          location: newJob.location,
          type: newJob.type,
          experience: newJob.experience,
          description: newJob.description,
          requirements: newJob.requirements.filter(Boolean),
          benefits: newJob.benefits.filter(Boolean)
        };

        const { data, error } = await supabase
          .from('jobs')
          .insert([jobData])
          .select();

        if (error) throw error;

        toast.success('Job created successfully!');
      }

      // Reset form and refresh jobs
      setShowJobDialog(false);
      setEditingJob(null);
      setNewJob({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        experience: '',
        description: '',
        requirements: [''],
        benefits: [''],
        trainingData: ''
      });
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(handleSupabaseError(error).error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    setNewJob(prev => {
      const requirements = [...prev.requirements];
      requirements[index] = value;
      return { ...prev, requirements };
    });
  };

  const handleBenefitChange = (index: number, value: string) => {
    setNewJob(prev => {
      const benefits = [...prev.benefits];
      benefits[index] = value;
      return { ...prev, benefits };
    });
  };

  const addRequirement = () => {
    setNewJob(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const addBenefit = () => {
    setNewJob(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setNewJob(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const removeBenefit = (index: number) => {
    setNewJob(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  // Update the generateWithAI function to handle responses properly and auto-populate fields
const generateWithAI = async (field: keyof AIGenerationState) => {
  setIsGeneratingAI(prev => ({ ...prev, [field]: true }));
  try {
    let prompt = '';
    switch (field) {
      case 'title':
        prompt = `Generate a professional job title for this position:
        Department: ${newJob.department || 'Not specified'}
        Experience Level: ${newJob.experience || 'Not specified'}
        Current Title: ${newJob.title || 'Not specified'}
        
        Return only the job title, no additional text.`;
        break;
      case 'description':
        prompt = `Write a professional job description for this position:
        Title: ${newJob.title}
        Department: ${newJob.department}
        Experience Level: ${newJob.experience}
        
        Include key responsibilities and qualifications. Be concise and professional.`;
        break;
      case 'requirements':
        prompt = `List 5-7 key requirements for this position:
        Title: ${newJob.title}
        Department: ${newJob.department}
        Experience Level: ${newJob.experience}
        
        Format as a bullet list. Be specific and relevant to the role.`;
        break;
      case 'benefits':
        prompt = `List 4-6 competitive benefits for this position:
        Title: ${newJob.title}
        Department: ${newJob.department}
        
        Format as a bullet list. Focus on attractive and relevant benefits.`;
        break;
      case 'trainingData':
        prompt = `Generate comprehensive training data for a ${newJob.title} position in the ${newJob.department} department.
        Experience Level: ${newJob.experience}
        
        Include:
        1. Core Skills and Competencies
        2. Technical Knowledge Requirements
        3. Soft Skills Development
        4. Learning Objectives
        5. Training Milestones`;
        break;
    }

    const content = await callPuterAI(prompt);
    
    // Process the content based on the field
    switch (field) {
      case 'title':
        setNewJob(prev => ({ ...prev, title: content.trim() }));
        break;
      case 'description':
        setNewJob(prev => ({ ...prev, description: content.trim() }));
        break;
      case 'requirements':
        const requirements = content
          .split('\n')
          .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean);
        setNewJob(prev => ({ ...prev, requirements }));
        break;
      case 'benefits':
        const benefits = content
          .split('\n')
          .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean);
        setNewJob(prev => ({ ...prev, benefits }));
        break;
      case 'trainingData':
        setNewJob(prev => ({ ...prev, trainingData: content.trim() }));
        break;
    }

    toast.success(`Generated ${field} successfully!`);
  } catch (error) {
    console.error(`Error generating ${field}:`, error);
    toast.error(`Failed to generate ${field}. Please try again.`);
  } finally {
    setIsGeneratingAI(prev => ({ ...prev, [field]: false }));
  }
};
  // Update generateFullJob to use the correct request format
const generateTrainingData = async () => {
  if (!newJob.title || !newJob.department) {
    toast.error('Please provide job title and department first');
    return;
  }
  // Show explanation tooltip about training data
  toast.info(`🎯 Training Data Importance

This AI training data is crucial for:

✨ Enhancing AI Understanding:
- Helps our AI system comprehend specific job requirements
- Enables more accurate candidate screening
- Improves response quality to applicant questions

🎓 Better Candidate Experience:
- Provides tailored responses to job-related queries
- Ensures consistent and accurate information
- Streamlines the application process

📊 Improved Screening:
- More accurate skill matching
- Better qualification assessment
- Reduced manual screening time

This data significantly improves both the hiring process and candidate experience.`, { duration: 10000 });

  setIsGeneratingAI(prev => ({ ...prev, trainingData: true }));
  try {
    const prompt = `Generate comprehensive training data for a ${newJob.title} position in the ${newJob.department} department.
    Include key skills, knowledge areas, and learning objectives.
    Consider experience level: ${newJob.experience || 'Not specified'}
    
    FORMAT YOUR RESPONSE AS A STRUCTURED TEXT:
    1. Core Skills and Competencies
    2. Technical Knowledge Requirements
    3. Soft Skills Development
    4. Learning Objectives
    5. Training Milestones
    
    Make it detailed and specific to the role.`;

    const response = await callPuterAI(prompt);
    const cleanedContent = response.replace(/```.*?```/gs, '').trim();
    
    setNewJob(prev => ({
      ...prev,
      trainingData: cleanedContent
    }));

    toast.success('Training data generated successfully!');
  } catch (error) {
    console.error('Error generating training data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Failed to generate training data: ${errorMessage}`);
  } finally {
    setIsGeneratingAI(prev => ({ ...prev, trainingData: false }));
  }
};

const generateFullJob = async () => {
  if (!newJob.department || !newJob.experience) {
    toast.error('Please select a department and experience level first');
    return;
  }

  setIsCreating(true);
  try {
    const prompt = `Create a complete job posting for a position with these details:
    Department: ${newJob.department}
    Experience Level: ${newJob.experience}
    Location: ${newJob.location || 'Remote'}
    
    FORMAT YOUR RESPONSE EXACTLY LIKE THIS JSON:
    {
      "title": "Professional job title",
      "description": "Detailed job description with overview, responsibilities, and qualifications",
      "requirements": [
        "Specific requirement 1",
        "Specific requirement 2",
        "Specific requirement 3"
      ],
      "benefits": [
        "Specific benefit 1",
        "Specific benefit 2",
        "Specific benefit 3"
      ]
    }`;

    const content = await callPuterAI(prompt);

    // Parse the content
    let generated;
    try {
      // Clean up the response before parsing
      const cleanedContent = content.replace(/```json\n?|```/g, '').trim();
      generated = JSON.parse(cleanedContent);
    } catch (e) {
      console.error('Failed to parse content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate and update the form
    if (!generated || typeof generated !== 'object') {
      throw new Error('Invalid job data structure');
    }

    setNewJob(prev => ({
      ...prev,
      title: generated.title || prev.title,
      description: generated.description || prev.description,
      requirements: Array.isArray(generated.requirements) ? 
        generated.requirements.filter(Boolean) : 
        prev.requirements,
      benefits: Array.isArray(generated.benefits) ? 
        generated.benefits.filter(Boolean) : 
        prev.benefits
    }));

    toast.success('Job details generated successfully!');
  } catch (error) {
    console.error('Error generating job:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Failed to generate job details: ${errorMessage}`);
  } finally {
    setIsCreating(false);
  }
};

  // Add test job creation function
  const createTestJob = async () => {
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([{
          title: 'Test Software Engineer',
          department: 'Engineering',
          location: 'Remote',
          type: 'Full-time',
          experience: 'Mid Level',
          description: 'This is a test job posting to verify the Supabase integration.',
          requirements: ['JavaScript', 'React', 'Node.js'],
          benefits: ['Health Insurance', 'Remote Work', '401k'],
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      toast.success('Test job created successfully!');
      fetchJobs();
    } catch (error) {
      console.error('Error creating test job:', error);
      toast.error(handleSupabaseError(error).error);
    }
  };

  // Add delete function
  const deleteJob = async (job: Job) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', job.id);

      if (error) throw error;
      
      toast.success('Job deleted successfully!');
      setJobToDelete(null);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(handleSupabaseError(error).error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fix the syntax error by removing the extra closing bracket
  const startEditing = (job: Job) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      description: job.description,
      requirements: job.requirements || [''],
      benefits: job.benefits || [''],
      trainingData: job.trainingData || ''
    });
    setShowJobDialog(true);
  };

  const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'Customer Support'];
  const locations = ['All', 'Remote', 'New York', 'London', 'Berlin', 'Singapore'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  // Add debouncing effect for title suggestions
  useEffect(() => {
    if (!debouncedTitleValue) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        if (debouncedTitleValue.trim()) {
          await generateWithAI('title');
        }
      } catch (error) {
        console.error('Error generating title suggestions:', error);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [debouncedTitleValue]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Job Board</h1>
          <p className="text-muted-foreground mt-1">Manage and post job opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={createTestJob}
            className="flex items-center gap-2"
          >
            Create Test Job
          </Button>
          <Button 
            onClick={() => setShowJobDialog(true)}
            className="flex items-center gap-2 bg-primary"
          >
            <Briefcase className="w-4 h-4" />
            Create New Job
          </Button>
        </div>
      </div>

      {/* Filters and Job List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <Card className="p-6 h-fit lg:col-span-1 border-2">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V21l-4-4v-3.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z" />
            </svg>
            Filters
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="department" className="text-sm font-medium">Department</Label>
              <select
                id="department"
                className="w-full mt-1 p-2 rounded-md border bg-background"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <select
                id="location"
                className="w-full mt-1 p-2 rounded-md border bg-background"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Job List */}
        <div className="lg:col-span-3">
          <Card className="p-6 border-2">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search jobs by title or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">Try adjusting your search or filters</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDepartment('All');
                      setSelectedLocation('All');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <Card 
                    key={job.id} 
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedJobId === job.id ? "shadow-lg" : "hover:shadow-md"
                    )}
                  >
                    <div 
                      className={cn(
                        "p-4 cursor-pointer",
                        expandedJobId === job.id ? "bg-muted/50" : "hover:bg-muted/30"
                      )}
                      onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {job.department}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(job);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setJobToDelete(job);
                            }}
                          >
                            Delete
                          </Button>
                          {expandedJobId === job.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedJobId === job.id && (
                      <div className="p-4 border-t bg-card">
                        <div className="space-y-4">
                          <div className="pl-4 border-l-2 border-primary/30">
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-muted-foreground">{job.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {job.requirements.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-primary"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Requirements
                                </h4>
                                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                                  {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {job.benefits.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Benefits
                                </h4>
                                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                                  {job.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Job Creation/Edit Dialog */}
      <Dialog open={showJobDialog} onOpenChange={(open) => {
        if (!open) {
          setEditingJob(null);
          setNewJob({
            title: '',
            department: '',
            location: '',
            type: 'Full-time',
            experience: '',
            description: '',
            requirements: [''],
            benefits: [''],
            trainingData: ''
          });
        }
        setShowJobDialog(open);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
            </DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update the details of this job posting.' : 'Create a new job posting with the details below.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* AI Assistant Banner */}
            <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium mb-1">AI Job Creation Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Let AI help you create professional job postings. Fill in the department and experience level, then click "Generate Full Job" or use individual AI buttons to generate specific sections.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job-title">Job Title</Label>
                <div className="flex gap-2">
                  <Input
                    id="job-title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => generateWithAI('title')}
                    disabled={isGeneratingAI.title}
                  >
                    {isGeneratingAI.title ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="job-department">Department</Label>
                <select
                  id="job-department"
                  className="w-full p-2 rounded-md border bg-background"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                >
                  <option value="">Select department</option>
                  {departments.slice(1).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="job-location">Location</Label>
                <Input
                  id="job-location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  placeholder="e.g. Remote, New York"
                />
              </div>
              <div>
                <Label htmlFor="job-experience">Experience Level</Label>
                <select
                  id="job-experience"
                  className="w-full p-2 rounded-md border bg-background"
                  value={newJob.experience}
                  onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="job-description">Job Description</Label>
              <div className="space-y-2">
                <Textarea
                  id="job-description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  rows={6}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateWithAI('description')}
                  disabled={isGeneratingAI.description}
                  className="w-full"
                >
                  {isGeneratingAI.description ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating description...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Description with AI
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Add Training Data field */}
            <div>
              <Label htmlFor="job-training-data">Training Data</Label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateTrainingData}
                    disabled={isGeneratingAI.trainingData}
                    className="flex-1"
                  >
                    {isGeneratingAI.trainingData ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating training data...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Training Data with AI
                      </>
                    )}
                  </Button>
                  <div className="relative">
                    <Input
                      type="file"
                      className="hidden"
                      id="training-data-upload"
                      onChange={handleFileUpload}
                      accept=".txt,.doc,.docx,.pdf"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('training-data-upload')?.click()}
                      className="whitespace-nowrap"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="job-training-data"
                  value={newJob.trainingData}
                  onChange={(e) => setNewJob(prev => ({ ...prev, trainingData: e.target.value }))}
                  placeholder="Enter or paste training materials to help the chat application answer questions about this position..."
                  rows={6}
                />
                {uploadedFile && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Uploaded: {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Requirements</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateWithAI('requirements')}
                  disabled={isGeneratingAI.requirements}
                >
                  {isGeneratingAI.requirements ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                {newJob.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder="Add a requirement"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                      disabled={newJob.requirements.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addRequirement}>
                  Add Requirement
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Benefits</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateWithAI('benefits')}
                  disabled={isGeneratingAI.benefits}
                >
                  {isGeneratingAI.benefits ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                {newJob.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder="Add a benefit"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                      disabled={newJob.benefits.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addBenefit}>
                  Add Benefit
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={generateFullJob}
              disabled={isCreating || !newJob.department || !newJob.experience}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Full Job...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Full Job
                </>
              )}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setShowJobDialog(false);
                setEditingJob(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={createJob}
                disabled={isCreating || !newJob.title}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingJob ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingJob ? 'Update Job' : 'Create Job'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The job posting will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{jobToDelete?.title}"?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setJobToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => jobToDelete && deleteJob(jobToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Job'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
