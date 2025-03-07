import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Briefcase,
  Search,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Users
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from 'sonner';
import { ChatApplicationForm } from '../components/ChatApplicationForm';
import { JobApplicationForm } from '../components/JobApplicationForm';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
  deadlineDate?: string;
  numberOfPositions: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationType, setApplicationType] = useState<'chat' | 'form' | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (job: Job, type: 'chat' | 'form') => {
    setSelectedJob(job);
    setApplicationType(type);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    setSelectedJob(null);
    setApplicationType(null);
    toast.success('Application submitted successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Open Positions</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search jobs by title, department, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-lg"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No jobs found matching your search criteria</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{job.numberOfPositions} position{job.numberOfPositions !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {format(new Date(job.postedDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  <p className="text-sm mt-4">{job.description}</p>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  <Button
                    onClick={() => handleApply(job, 'chat')}
                    className="w-full"
                  >
                    Quick Apply with AI
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleApply(job, 'form')}
                    className="w-full"
                  >
                    Standard Application
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed inset-6 bg-background border rounded-lg shadow-lg overflow-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Apply for {selectedJob.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowApplicationForm(false);
                  setSelectedJob(null);
                  setApplicationType(null);
                }}
              >
                ×
              </Button>
            </div>
            
            <div className="p-4">
              {applicationType === 'chat' ? (
                <ChatApplicationForm
                  jobId={selectedJob.id}
                  jobTitle={selectedJob.title}
                  onSuccess={handleApplicationSuccess}
                  onCancel={() => setShowApplicationForm(false)}
                />
              ) : (
                <JobApplicationForm
                  jobId={selectedJob.id}
                  jobTitle={selectedJob.title}
                  onSuccess={handleApplicationSuccess}
                  onCancel={() => setShowApplicationForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
