import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Card } from '../components/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/Dialog';
import { Label } from '../components/Label';
import { Wand2, Briefcase, Building2, MapPin, Clock, Loader2, X, Search, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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
  createdAt: string;
}

// Add new interface for AI generation
interface AIGenerationState {
  title: boolean;
  description: boolean;
  requirements: boolean;
  benefits: boolean;
}

// Update the type definitions at the top of the file
interface PuterAIResponse {
  message?: {
    content: string | any;
    tool_calls?: any[];
  };
  text?: string;
  content?: string | Record<string, any>;
}

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
    benefits: ['']
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState<AIGenerationState>({
    title: false,
    description: false,
    requirements: false,
    benefits: false
  });

  // Add editing state
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Add delete confirmation dialog state
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Fetch jobs on component mount
  React.useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { error, data } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error(handleSupabaseError(error).error);
    }
  };

  const createJob = async () => {
    if (!newJob.title) {
      toast.error('Please enter a job title');
      return;
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
            requirements: newJob.requirements,
            benefits: newJob.benefits,
            employment_type: newJob.type,
            remote_policy: newJob.location.toLowerCase().includes('remote') ? 'remote' : 'on-site',
            updated_at: new Date().toISOString()
          })
          .eq('id', editingJob.id)
          .select()
          .single();

        if (error) throw error;
        toast.success('Job updated successfully!');
      } else {
        // Create new job
        const { data, error } = await supabase
          .from('jobs')
          .insert([{
            title: newJob.title,
            department: newJob.department,
            location: newJob.location,
            type: newJob.type,
            experience: newJob.experience,
            description: newJob.description,
            requirements: newJob.requirements,
            benefits: newJob.benefits,
            status: 'active',
            employment_type: newJob.type, // Match schema
            remote_policy: newJob.location.toLowerCase().includes('remote') ? 'remote' : 'on-site',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;

        toast.success('Job created successfully!');
      }

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
        benefits: ['']
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

  const generateWithAI = async (field: keyof AIGenerationState) => {
    setIsGeneratingAI(prev => ({ ...prev, [field]: true }));
    try {
      let prompt = '';
      switch (field) {
        case 'title':
          prompt = `Suggest 3 professional job titles for a ${newJob.title || 'new'} position.
          FORMAT YOUR RESPONSE EXACTLY LIKE THIS JSON ARRAY:
          
          ["First Job Title", "Second Job Title", "Third Job Title"]
          
          Do not return anything other than this JSON array format.`;
          break;
        case 'description':
          prompt = `Create a job description for ${newJob.title || 'this'} position.
          Include sections for:
          - Overview
          - Key Responsibilities
          - What We're Looking For
          
          Return as plain text without any JSON formatting or code blocks.
          Do not include any section headers or other formatting.`;
          break;
        case 'requirements':
          prompt = `List 5-7 key requirements for ${newJob.title || 'this'} position.
          FORMAT YOUR RESPONSE EXACTLY LIKE THIS JSON ARRAY:
          
          [
            "First specific requirement",
            "Second specific requirement",
            "Third specific requirement"
          ]
          
          Do not return anything other than this JSON array format.`;
          break;
        case 'benefits':
          prompt = `List 5-7 competitive benefits for ${newJob.title || 'this'} position.
          FORMAT YOUR RESPONSE EXACTLY LIKE THIS JSON ARRAY:
          
          [
            "First specific benefit",
            "Second specific benefit",
            "Third specific benefit"
          ]
          
          Do not return anything other than this JSON array format.`;
          break;
      }

      if (typeof window === 'undefined' || !window.puter?.ai) {
        throw new Error('Puter AI not initialized');
      }

      console.log('Sending prompt to AI:', prompt);

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'claude-3-5-sonnet',
        stream: false
      });

      console.log('Raw AI response:', response);

      // Extract content from the response with improved object handling
      let content = '';
      
      if (typeof response === 'string') {
        content = response;
      } else if (response && typeof response === 'object') {
        // Handle message.content object or string
        if (response.message && typeof response.message === 'object') {
          if (typeof response.message.content === 'string') {
            content = response.message.content;
          } else if (response.message.content && typeof response.message.content === 'object') {
            // If content is an object (like a direct array), stringify it properly
            content = JSON.stringify(response.message.content);
          }
        } 
        // Handle text property
        else if ('text' in response && response.text) {
          content = String(response.text);
        }
        // Handle content property
        else if ('content' in response) {
          if (typeof response.content === 'string') {
            content = response.content;
          } else if (response.content && typeof response.content === 'object') {
            // If content is a direct array or object, stringify it properly
            content = JSON.stringify(response.content);
          }
        }
      }

      // If content is still not set, try to stringify the entire response as a last resort
      if (!content && response) {
        try {
          content = JSON.stringify(response);
        } catch (e) {
          console.error('Failed to stringify response:', e);
        }
      }

      if (!content || content === 'undefined' || content === '[object Object]') {
        console.error('Invalid content extracted:', content);
        throw new Error('Failed to extract valid content from AI response');
      }

      console.log('Extracted content:', content);

      // Clean and normalize the content
      content = content.replace(/```json\n?|```\n?/g, '').trim();
      
      console.log('Cleaned content:', content);

      try {
        switch (field) {
          case 'title': {
            // For title, parse the JSON array directly or extract from text
            let titles: string[] = [];
            
            try {
              // First try direct JSON parse
          const parsed = JSON.parse(content);
              if (Array.isArray(parsed)) {
                titles = parsed.map(t => String(t));
              } else if (typeof parsed === 'object' && parsed !== null) {
                // If parsed is an object but not array, check if it has values we can use
                const values = Object.values(parsed);
                if (values.length > 0 && values.every(v => typeof v === 'string')) {
                  titles = values;
                }
              }
            } catch (e) {
              console.log('Direct JSON parse failed, trying to extract array:', e);
              
              // Try to extract array from text
              const arrayMatch = content.match(/\[([\s\S]*?)\]/);
              if (arrayMatch) {
                try {
                  titles = JSON.parse(arrayMatch[0]);
                } catch (e) {
                  // If JSON parse fails, split by commas
                  titles = arrayMatch[1]
                    .split(',')
                    .map(t => t.trim().replace(/^["']|["']$/g, ''))
                    .filter(Boolean);
                }
              }
              
              // If still no titles, split by lines
              if (titles.length === 0) {
                titles = content
                  .split('\n')
                  .map(line => line.trim().replace(/^[-*\d.\s]+/, '').trim())
                  .filter(Boolean);
              }
            }
            
            if (titles.length > 0) {
              setNewJob(prev => ({ ...prev, title: titles[0] }));
              if (titles.length > 1) {
                toast.success(`Alternative titles: ${titles.slice(1).join(', ')}`);
              }
            } else {
              throw new Error('No valid titles found in response');
            }
            break;
          }
          case 'description': {
            // For description, use the content directly
            const description = content
              .replace(/```[a-z]*\n|```/g, '')
              .replace(/[\r\n]+/g, '\n')
              .trim();
              
            if (!description) {
              throw new Error('Empty description in response');
            }
            setNewJob(prev => ({ ...prev, description }));
            break;
          }
          case 'requirements':
          case 'benefits': {
            // For requirements and benefits, parse the JSON array
            let items: string[] = [];
            
            try {
              // First try direct JSON parse
              const parsed = JSON.parse(content);
              if (Array.isArray(parsed)) {
                items = parsed.map(item => String(item));
              } else if (typeof parsed === 'object' && parsed !== null) {
                // Handle object with values
                const values = Object.values(parsed);
                if (values.length > 0) {
                  items = values.map(v => String(v));
                }
              }
            } catch (e) {
              console.log('JSON parse failed, trying to extract array:', e);
              
              // Try to extract array from text
              const arrayMatch = content.match(/\[([\s\S]*?)\]/);
              if (arrayMatch) {
                try {
                  items = JSON.parse(arrayMatch[0]);
                } catch (e) {
                  // If JSON parse fails, split by lines or commas
                  items = arrayMatch[1]
                    .split(/[,\n]/)
                    .map(item => item.trim().replace(/^["']|["']$/g, '').replace(/^[-*•\d.\s]+/, ''))
                    .filter(Boolean);
                }
              } else {
                // If no array found, split by lines
                items = content
                  .split('\n')
                  .map(line => line.trim().replace(/^[-*•\d.\s]+/, '').trim())
                  .filter(Boolean);
              }
            }
            
            if (items.length > 0) {
              setNewJob(prev => ({ ...prev, [field]: items }));
            } else {
              throw new Error(`No valid ${field} found in response`);
            }
            break;
          }
        }
        toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} generated successfully!`);
      } catch (e) {
        console.error(`Error processing ${field}:`, e);
        throw new Error(`Failed to process AI response for ${field}: ${e.message}`);
      }
    } catch (error: unknown) {
      console.error(`Error generating ${field}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to generate ${field}: ${errorMessage}`);
    } finally {
      setIsGeneratingAI(prev => ({ ...prev, [field]: false }));
    }
  };

  // Also fix the generateFullJob function to handle Puter.js response format correctly
  const generateFullJob = async () => {
    if (!newJob.department || !newJob.experience) {
      toast.error('Please select a department and experience level first');
      return;
    }

    setIsCreating(true);
    try {
      const prompt = `Create a complete job posting with these details:
      Department: ${newJob.department}
      Experience Level: ${newJob.experience}
      Location: ${newJob.location || 'Remote'}
      
      FORMAT YOUR RESPONSE EXACTLY LIKE THIS JSON, replacing the placeholders with appropriate content:

      {
        "title": "Actual Professional Job Title",
        "description": "Actual job description with sections for Overview, Responsibilities, and Requirements.",
        "requirements": [
          "Actual requirement 1",
          "Actual requirement 2",
          "Actual requirement 3"
        ],
        "benefits": [
          "Actual benefit 1",
          "Actual benefit 2",
          "Actual benefit 3"
        ]
      }

      Do not return anything other than this JSON format.`;

      if (typeof window === 'undefined' || !window.puter?.ai) {
        throw new Error('Puter AI not initialized');
      }

      console.log('Sending full job prompt to AI:', prompt);

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'claude-3-5-sonnet',
        stream: false
      });

      console.log('Raw full job AI response:', response);

      // Extract content from the response with improved object handling
      let result = '';
      
      if (typeof response === 'string') {
        result = response;
      } else if (response && typeof response === 'object') {
        // Handle message.content object or string
        if (response.message && typeof response.message === 'object') {
          if (typeof response.message.content === 'string') {
            result = response.message.content;
          } else if (response.message.content && typeof response.message.content === 'object') {
            // If content is an object, stringify it properly
            result = JSON.stringify(response.message.content);
          }
        } 
        // Handle text property
        else if ('text' in response && response.text) {
          result = String(response.text);
        }
        // Handle content property
        else if ('content' in response) {
          if (typeof response.content === 'string') {
            result = response.content;
          } else if (response.content && typeof response.content === 'object') {
            // If content is a direct object, stringify it properly
            result = JSON.stringify(response.content);
          }
        }
      }

      // If result is still not set, try to stringify the entire response as a last resort
      if (!result && response) {
        try {
          result = JSON.stringify(response);
        } catch (e) {
          console.error('Failed to stringify response:', e);
        }
      }

      if (!result || result === 'undefined' || result === '[object Object]') {
        console.error('Invalid content extracted:', result);
        throw new Error('Failed to extract valid content from AI response');
      }

      console.log('Extracted full job content:', result);

      // Clean the content and extract JSON
      result = result.replace(/```json\n?|```\n?/g, '').trim();
      
      console.log('Cleaned full job content:', result);
      
      // Try to find a JSON object in the response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = jsonMatch[0];
      }

      let generated;
      try {
        generated = JSON.parse(result);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid JSON format in AI response. Please try again.');
      }

      if (!generated || typeof generated !== 'object') {
        throw new Error('Invalid data structure in AI response');
      }

      // Update job details with generated content
      setNewJob(prev => ({
        ...prev,
        title: generated.title || prev.title,
        description: generated.description || prev.description,
        requirements: Array.isArray(generated.requirements) ? generated.requirements : prev.requirements,
        benefits: Array.isArray(generated.benefits) ? generated.benefits : prev.benefits
      }));

      toast.success('Job details generated successfully!');
    } catch (error: unknown) {
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
          employment_type: 'Full-time',
          remote_policy: 'remote',
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

  // Add edit function
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
      benefits: job.benefits || ['']
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
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
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
                                    className="w-4 h-4 text-primary"
                                    viewBox="0 0 24 24"
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
            benefits: ['']
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
