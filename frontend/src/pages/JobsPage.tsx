import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Plus, Search, Building2, MapPin, Briefcase, Clock, Users, ArrowUpRight, X } from 'lucide-react';
import { ChatApplicationForm } from '../components/ChatApplicationForm';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs();
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
    }
  };

  const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'Customer Support'];
  const locations = ['All', 'Remote', 'New York', 'London', 'Berlin', 'Singapore'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const handleApply = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplicationSuccess = () => {
    setSelectedJob(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Job Board</h1>
          <p className="text-muted-foreground">Find your next opportunity to make an impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <select
                  className="w-full p-2 rounded-md border bg-background"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <select
                  className="w-full p-2 rounded-md border bg-background"
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

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Company Culture</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Learn about our values, mission, and what makes us unique.
              </p>
              <Button variant="outline" className="w-full">Learn More</Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {selectedJob ? (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-2xl">
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-0 -mt-12 z-50"
                    onClick={() => setSelectedJob(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <ChatApplicationForm
                    jobId={selectedJob.id}
                    jobTitle={selectedJob.title}
                    onSuccess={handleApplicationSuccess}
                    onCancel={() => setSelectedJob(null)}
                  />
                </div>
              </div>
            ) : null}

            {filteredJobs.map(job => (
              <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.experience}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Job Description</h4>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                    {job.requirements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Requirements</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {job.benefits.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Benefits</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {job.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button
                    className="flex items-center gap-2 whitespace-nowrap hover:bg-primary/90 transition-colors"
                    onClick={() => handleApply(job)}
                    type="button"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
