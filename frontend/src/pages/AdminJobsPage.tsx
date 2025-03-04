import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';
import { Textarea } from '../components/Textarea';
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Link,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  bannerImage?: string;
  requirements: string[];
  benefits: string[];
}

interface BrandingContent {
  id: string;
  type: 'image' | 'video' | 'text';
  title: string;
  content: string;
  subtitle?: string;
  description?: string;
  order: number;
  category: 'team' | 'about' | 'vision' | 'perks' | 'stories';
}

interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  notes?: string;
  createdAt: string;
  job: Job;
}

export default function AdminJobsPage() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [brandingContent, setBrandingContent] = useState<BrandingContent[]>([]);
  const [newJob, setNewJob] = useState<Partial<Job>>({});
  const [newContent, setNewContent] = useState<Partial<BrandingContent>>({});
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [brandingTab, setBrandingTab] = useState<'team' | 'about' | 'vision' | 'perks' | 'stories'>('team');
  const [jobImagePreview, setJobImagePreview] = useState<string | null>(null);
  const [isEditingJob, setIsEditingJob] = useState<string | null>(null);
  const [jobImageType, setJobImageType] = useState<'upload' | 'url' | 'ai' | null>(null);
  const [jobImageUrl, setJobImageUrl] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Application['status']>('pending');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all');

  useEffect(() => {
    fetchJobs();
    fetchBrandingContent();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.map((job: Job) => ({
        ...job,
        requirements: JSON.parse(job.requirements || '[]'),
        benefits: JSON.parse(job.benefits || '[]')
      })));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    }
  };

  const fetchBrandingContent = async () => {
    try {
      const response = await fetch('/api/branding-content');
      const data = await response.json();
      setBrandingContent(data);
    } catch (error) {
      console.error('Error fetching branding content:', error);
      toast.error('Failed to fetch branding content');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    }
  };

  const handleJobImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setJobImagePreview(reader.result as string);
        setNewJob({ ...newJob, bannerImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJobImageUrl = () => {
    if (jobImageUrl) {
      setJobImagePreview(jobImageUrl);
      setNewJob({ ...newJob, bannerImage: jobImageUrl });
    }
  };

  const handleGenerateAIImage = async () => {
    // TODO: Implement AI image generation
    toast.info('AI image generation coming soon!');
  };

  const handleEditJob = (job: Job) => {
    setIsEditingJob(job.id);
    setNewJob(job);
    setJobImagePreview(job.bannerImage || null);
    setIsAddingJob(true);
  };

  const handleAddJob = async () => {
    if (!newJob.title || !newJob.department || !newJob.location || !newJob.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const jobData = {
        ...newJob,
        type: newJob.type || 'Full-time',
        requirements: JSON.stringify(newJob.requirements?.filter(r => r.trim()) || []),
        benefits: JSON.stringify(newJob.benefits?.filter(b => b.trim()) || []),
        experience: newJob.experience || 'Entry Level',
        bannerImage: newJob.bannerImage || null,
      };

      const method = isEditingJob ? 'PUT' : 'POST';
      const url = isEditingJob ? `/api/jobs/${isEditingJob}` : '/api/jobs';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save job');
      }

      const job = await response.json();
      
      if (isEditingJob) {
        setJobs(jobs.map(j => j.id === job.id ? job : j));
        toast.success('Job updated successfully');
      } else {
        setJobs([...jobs, job]);
        toast.success('Job posted successfully');
      }

      setNewJob({});
      setIsAddingJob(false);
      setIsEditingJob(null);
      setJobImagePreview(null);
      setJobImageType(null);
      setJobImageUrl('');
      await fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save job');
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete job');

      setJobs(jobs.filter(job => job.id !== id));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleAddContent = async () => {
    if (!newContent.title || !newContent.type || !newContent.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newContent.title);
      formData.append('type', newContent.type);
      formData.append('category', newContent.category);
      formData.append('order', String(brandingContent.filter(c => c.category === newContent.category).length));
      
      if (newContent.subtitle) formData.append('subtitle', newContent.subtitle);
      if (newContent.description) formData.append('description', newContent.description);

      if (newContent.type === 'text') {
        formData.append('content', newContent.content || '');
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch('/api/branding-content', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to create content');

      const content = await response.json();
      setBrandingContent([...brandingContent, content]);
      setNewContent({});
      setSelectedFile(null);
      setIsAddingContent(false);
      toast.success('Content created successfully');
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      const response = await fetch(`/api/branding-content/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete content');

      setBrandingContent(brandingContent.filter(content => content.id !== id));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: Application['status']) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleUpdateApplicationNotes = async (applicationId: string, notes: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update application notes');
      }

      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, notes } : app
      ));
      toast.success('Notes updated');
    } catch (error) {
      console.error('Error updating application notes:', error);
      toast.error('Failed to update notes');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === app.status;
    const matchesJob = selectedJobFilter === 'all' || app.jobId === selectedJobFilter;
    return matchesStatus && matchesJob;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Jobs & Branding Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="branding">Employment Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Job Postings</h2>
              <Button onClick={() => setIsAddingJob(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Job
              </Button>
            </div>

            {isAddingJob && (
              <Card className="p-4 mb-6 border-2 border-primary">
                <h3 className="text-lg font-medium mb-4">
                  {isEditingJob ? 'Edit Job Posting' : 'New Job Posting'}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Banner Image</h4>
                    {jobImagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <img
                          src={jobImagePreview}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setJobImagePreview(null);
                            setNewJob({ ...newJob, bannerImage: undefined });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant={jobImageType === 'upload' ? 'default' : 'outline'}
                        onClick={() => setJobImageType('upload')}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      <Button
                        variant={jobImageType === 'url' ? 'default' : 'outline'}
                        onClick={() => setJobImageType('url')}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Image URL
                      </Button>
                      <Button
                        variant={jobImageType === 'ai' ? 'default' : 'outline'}
                        onClick={() => setJobImageType('ai')}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate with AI
                      </Button>
                    </div>
                    {jobImageType === 'upload' && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleJobImageUpload}
                        className="w-full"
                      />
                    )}
                    {jobImageType === 'url' && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter image URL"
                          value={jobImageUrl}
                          onChange={(e) => setJobImageUrl(e.target.value)}
                        />
                        <Button onClick={handleJobImageUrl}>Preview</Button>
                      </div>
                    )}
                    {jobImageType === 'ai' && (
                      <div className="space-y-2">
                        <Input
                          placeholder="Describe the image you want to generate..."
                          value={newJob.title || ''}
                        />
                        <Button onClick={handleGenerateAIImage}>Generate</Button>
                      </div>
                    )}
                  </div>

                  <Input
                    placeholder="Job Title"
                    value={newJob.title || ''}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                  <Input
                    placeholder="Department"
                    value={newJob.department || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, department: e.target.value })}
                  />
                  <Input
                    placeholder="Location"
                    value={newJob.location || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                  <Input
                    placeholder="Experience Required"
                    value={newJob.experience || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, experience: e.target.value })}
                  />
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newJob.type || 'Full-time'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewJob({ ...newJob, type: e.target.value })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <Textarea
                    placeholder="Job Description"
                    value={newJob.description || ''}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewJob({ ...newJob, description: e.target.value })}
                  />
                  <Textarea
                    placeholder="Requirements (one per line)"
                    value={newJob.requirements?.join('\n') || ''}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                      setNewJob({ ...newJob, requirements: e.target.value.split('\n').filter(r => r.trim()) })
                    }
                  />
                  <Textarea
                    placeholder="Benefits (one per line)"
                    value={newJob.benefits?.join('\n') || ''}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                      setNewJob({ ...newJob, benefits: e.target.value.split('\n').filter(b => b.trim()) })
                    }
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAddJob}>
                      {isEditingJob ? 'Update Job' : 'Save Job'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingJob(false);
                        setIsEditingJob(null);
                        setNewJob({});
                        setJobImagePreview(null);
                        setJobImageType(null);
                        setJobImageUrl('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {job.bannerImage && (
                        <img
                          src={job.bannerImage}
                          alt={job.title}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.department} • {job.location} • {job.experience}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditJob(job)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Applications</h2>
              <div className="flex gap-4">
                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                >
                  <option value="all">All Jobs</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Application['status'])}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredApplications.map(application => (
                <Card key={application.id} className="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{application.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Applied for: {application.job.title}
                        </p>
                        <div className="flex gap-2 mt-1 text-sm">
                          <a href={`mailto:${application.email}`} className="text-primary hover:underline">
                            {application.email}
                          </a>
                          {application.phone && (
                            <span className="text-muted-foreground">• {application.phone}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={application.status}
                          onChange={(e) => handleUpdateApplicationStatus(application.id, e.target.value as Application['status'])}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Resume</h4>
                        <Button variant="outline" className="w-full" onClick={() => window.open(application.resumeUrl, '_blank')}>
                          View Resume
                        </Button>
                      </div>
                      {application.coverLetter && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                          <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                            {application.coverLetter}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Recruiter Notes</h4>
                      <Textarea
                        placeholder="Add notes about this candidate..."
                        value={application.notes || ''}
                        onChange={(e) => handleUpdateApplicationNotes(application.id, e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </Card>
              ))}

              {filteredApplications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No applications found for the selected filters.
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Employment Branding Content</h2>
              <Button onClick={() => setIsAddingContent(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>

            <Tabs value={brandingTab} onValueChange={(value: any) => setBrandingTab(value)} className="mt-6">
              <TabsList className="mb-8 grid grid-cols-5 gap-4">
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="vision">Vision & Mission</TabsTrigger>
                <TabsTrigger value="perks">Perks & Benefits</TabsTrigger>
                <TabsTrigger value="stories">Success Stories</TabsTrigger>
              </TabsList>

              {isAddingContent && (
                <Card className="p-4 mb-6 border-2 border-primary">
                  <h3 className="text-lg font-medium mb-4">New {brandingTab.charAt(0).toUpperCase() + brandingTab.slice(1)} Content</h3>
                  <div className="space-y-4">
                    {/* Team Member Form */}
                    {brandingTab === 'team' && (
                      <>
                        <Input
                          placeholder="Team Member Name"
                          value={newContent.title || ''}
                          onChange={(e) => setNewContent({ 
                            ...newContent, 
                            title: e.target.value,
                            type: 'text',
                            category: 'team',
                            content: newContent.content || '' 
                          })}
                        />
                        <Input
                          placeholder="Position/Role"
                          value={newContent.subtitle || ''}
                          onChange={(e) => setNewContent({ ...newContent, subtitle: e.target.value })}
                        />
                        <Textarea
                          placeholder="Bio"
                          value={newContent.content || ''}
                          onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                        />
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleFileChange(e);
                              setNewContent({
                                ...newContent,
                                type: 'image',
                                category: 'team'
                              });
                            }}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Upload team member photo
                              <br />
                              PNG, JPG or GIF
                            </p>
                          </label>
                        </div>
                      </>
                    )}

                    {/* About Form */}
                    {brandingTab === 'about' && (
                      <>
                        <Input
                          placeholder="Section Title"
                          value={newContent.title || ''}
                          onChange={(e) => setNewContent({ 
                            ...newContent, 
                            title: e.target.value,
                            type: 'text',
                            category: 'about',
                            content: newContent.content || '' 
                          })}
                        />
                        <Textarea
                          placeholder="About Content"
                          value={newContent.content || ''}
                          onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                        />
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleFileChange(e);
                              setNewContent({
                                ...newContent,
                                type: 'image',
                                category: 'about'
                              });
                            }}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Upload section image (optional)
                              <br />
                              PNG, JPG or GIF
                            </p>
                          </label>
                        </div>
                      </>
                    )}

                    {/* Vision & Mission Form */}
                    {brandingTab === 'vision' && (
                      <>
                        <Input
                          placeholder="Vision/Mission Title"
                          value={newContent.title || ''}
                          onChange={(e) => setNewContent({ 
                            ...newContent, 
                            title: e.target.value,
                            type: 'text',
                            category: 'vision',
                            content: newContent.content || '' 
                          })}
                        />
                        <Textarea
                          placeholder="Vision/Mission Statement"
                          value={newContent.content || ''}
                          onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                        />
                        <Input
                          placeholder="Short Description"
                          value={newContent.subtitle || ''}
                          onChange={(e) => setNewContent({ ...newContent, subtitle: e.target.value })}
                        />
                      </>
                    )}

                    {/* Perks & Benefits Form */}
                    {brandingTab === 'perks' && (
                      <>
                        <Input
                          placeholder="Perk Title"
                          value={newContent.title || ''}
                          onChange={(e) => setNewContent({ 
                            ...newContent, 
                            title: e.target.value,
                            type: 'text',
                            category: 'perks',
                            content: newContent.content || '' 
                          })}
                        />
                        <Input
                          placeholder="Short Description"
                          value={newContent.subtitle || ''}
                          onChange={(e) => setNewContent({ ...newContent, subtitle: e.target.value })}
                        />
                        <Textarea
                          placeholder="Detailed Description"
                          value={newContent.content || ''}
                          onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                        />
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleFileChange(e);
                              setNewContent({
                                ...newContent,
                                type: 'image',
                                category: 'perks'
                              });
                            }}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Upload perk icon/image
                              <br />
                              PNG, JPG or GIF
                            </p>
                          </label>
                        </div>
                      </>
                    )}

                    {/* Success Stories Form */}
                    {brandingTab === 'stories' && (
                      <>
                        <Input
                          placeholder="Story Title"
                          value={newContent.title || ''}
                          onChange={(e) => setNewContent({ 
                            ...newContent, 
                            title: e.target.value,
                            type: 'text',
                            category: 'stories',
                            content: newContent.content || '' 
                          })}
                        />
                        <Input
                          placeholder="Employee Name & Role"
                          value={newContent.subtitle || ''}
                          onChange={(e) => setNewContent({ ...newContent, subtitle: e.target.value })}
                        />
                        <Textarea
                          placeholder="Success Story"
                          value={newContent.content || ''}
                          onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                        />
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              handleFileChange(e);
                              const fileType = e.target.files?.[0]?.type.startsWith('video/') ? 'video' : 'image';
                              setNewContent({
                                ...newContent,
                                type: fileType,
                                category: 'stories'
                              });
                            }}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Upload photo or video
                              <br />
                              Image (PNG, JPG, GIF) or Video (MP4, WebM)
                            </p>
                          </label>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2 mt-6">
                      <Button onClick={handleAddContent}>Save Content</Button>
                      <Button variant="outline" onClick={() => {
                        setIsAddingContent(false);
                        setNewContent({});
                        setSelectedFile(null);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <TabsContent value="team" className="space-y-4">
                {brandingContent
                  .filter(content => content.category === 'team')
                  .map((content) => (
                    <BrandingContentCard key={content.id} content={content} onDelete={handleDeleteContent} />
                  ))}
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                {brandingContent
                  .filter(content => content.category === 'about')
                  .map((content) => (
                    <BrandingContentCard key={content.id} content={content} onDelete={handleDeleteContent} />
                  ))}
              </TabsContent>

              <TabsContent value="vision" className="space-y-4">
                {brandingContent
                  .filter(content => content.category === 'vision')
                  .map((content) => (
                    <BrandingContentCard key={content.id} content={content} onDelete={handleDeleteContent} />
                  ))}
              </TabsContent>

              <TabsContent value="perks" className="space-y-4">
                {brandingContent
                  .filter(content => content.category === 'perks')
                  .map((content) => (
                    <BrandingContentCard key={content.id} content={content} onDelete={handleDeleteContent} />
                  ))}
              </TabsContent>

              <TabsContent value="stories" className="space-y-4">
                {brandingContent
                  .filter(content => content.category === 'stories')
                  .map((content) => (
                    <BrandingContentCard key={content.id} content={content} onDelete={handleDeleteContent} />
                  ))}
              </TabsContent>
            </Tabs>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BrandingContentCard({ content, onDelete }: { content: BrandingContent; onDelete: (id: string) => void }) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {content.type === 'image' && <ImageIcon className="w-5 h-5" />}
          {content.type === 'video' && <Video className="w-5 h-5" />}
          {content.type === 'text' && <FileText className="w-5 h-5" />}
          <div>
            <h3 className="text-lg font-medium">{content.title}</h3>
            <p className="text-sm text-muted-foreground">
              {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
            </p>
            {content.type === 'text' && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{content.content}</p>
            )}
            {content.type === 'image' && (
              <img src={content.content} alt={content.title} className="mt-2 max-h-32 rounded-md" />
            )}
            {content.type === 'video' && (
              <video src={content.content} className="mt-2 max-h-32 rounded-md" controls />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(content.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 