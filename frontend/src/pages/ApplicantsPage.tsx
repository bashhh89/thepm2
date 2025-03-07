import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loader2, Mail, Phone, FileText, Calendar, User, Star, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Application, ApplicationStatus } from '../types/application';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
    try {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      setApplications(apps => 
        apps.map(app => 
          app.id === id ? { ...app, status } : app
        )
      );
      
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.applicationData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.applicationData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Job Applications</h1>
            <p className="text-muted-foreground mt-1">
              {applications.length} total applications
            </p>
          </div>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border bg-background px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="interviewed">Interviewed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="outline" onClick={() => fetchApplications()}>
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No applications found</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-semibold">{application.job?.title || 'Unknown Position'}</h2>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{application.job?.department}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{application.applicationData.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${application.applicationData.email}`} className="text-primary hover:underline">
                          {application.applicationData.email}
                        </a>
                      </div>
                      {application.applicationData.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${application.applicationData.phone}`} className="hover:underline">
                            {application.applicationData.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-muted-foreground">
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {application.applicationData.resumeUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(application.applicationData.resumeUrl, '_blank')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Resume
                        </Button>
                      )}
                      {application.applicationData.coverLetter && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.message('Cover Letter', {
                            description: application.applicationData.coverLetter
                          })}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Cover Letter
                        </Button>
                      )}
                      {application.applicationData.socialLinks?.linkedin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(application.applicationData.socialLinks?.linkedin, '_blank')}
                        >
                          LinkedIn
                        </Button>
                      )}
                      {application.applicationData.socialLinks?.github && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(application.applicationData.socialLinks?.github, '_blank')}
                        >
                          GitHub
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={application.status === 'approved' ? 'default' : 'outline'}
                        onClick={() => updateApplicationStatus(application.id, 'approved')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant={application.status === 'rejected' ? 'destructive' : 'outline'}
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant={application.status === 'reviewing' ? 'secondary' : 'outline'}
                        onClick={() => updateApplicationStatus(application.id, 'reviewing')}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Mark as Reviewing
                      </Button>
                      <Button
                        size="sm"
                        variant={application.status === 'interviewed' ? 'secondary' : 'outline'}
                        onClick={() => updateApplicationStatus(application.id, 'interviewed')}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Mark as Interviewed
                      </Button>
                    </div>

                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application.id, e.target.value as ApplicationStatus)}
                      className="w-full rounded-md border bg-background px-3 py-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}