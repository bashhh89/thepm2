import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl: string;
  jobId: string;
  jobTitle: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
  appliedAt: Date;
  coverLetter?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export default function Applicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await fetch('/api/applications');
      if (!response.ok) throw new Error('Failed to fetch applicants');
      const data = await response.json();
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to load applicants');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setApplicants(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus as Applicant['status'] } : app
        )
      );

      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Job Applicants</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border bg-background px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="interviewed">Interviewed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredApplicants.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No applicants found</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredApplicants.map((applicant) => (
            <Card key={applicant.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{applicant.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                      {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Applied for: {applicant.jobTitle}
                  </p>
                  
                  <div className="space-y-1 text-sm">
                    <p>{applicant.email}</p>
                    {applicant.phone && <p>{applicant.phone}</p>}
                  </div>
                  
                  <div className="flex gap-2 text-sm">
                    {applicant.socialLinks?.linkedin && (
                      <a href={applicant.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn
                      </a>
                    )}
                    {applicant.socialLinks?.github && (
                      <a href={applicant.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(applicant.resumeUrl, '_blank')}
                  >
                    View Resume
                  </Button>
                  
                  <select
                    value={applicant.status}
                    onChange={(e) => updateApplicationStatus(applicant.id, e.target.value)}
                    className="rounded-md border bg-background px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}