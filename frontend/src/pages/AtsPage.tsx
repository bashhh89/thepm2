import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { 
  Search, 
  FileText, 
  Mail, 
  Phone, 
  Calendar, 
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  UserCircle2,
  Building2,
  MessagesSquare,
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/Dialog";
import { Label } from '../components/Label';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface Application {
  id: string;
  created_at: string;
  updated_at: string;
  job_id: string;
  user_name: string;
  application_data: {
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter?: string;
  };
  conversation_history: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
  feedback?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  job?: {
    title: string;
    department: string;
  };
}

export default function AtsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(\`
          *,
          job:jobs (
            title,
            department
          )
        \`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      
      toast.success('Application status updated');
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update status');
    }
  };

  const addFeedback = async (applicationId: string, feedback: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ feedback })
        .eq('id', applicationId);

      if (error) throw error;
      
      toast.success('Feedback added');
      fetchApplications();
      setSelectedApplication(null);
      setFeedback('');
    } catch (error) {
      console.error('Error adding feedback:', error);
      toast.error('Failed to add feedback');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.application_data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_data.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-500/10';
      case 'rejected':
        return 'text-red-500 bg-red-500/10';
      case 'reviewing':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'reviewing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Applicant Tracking</h1>
            <p className="text-muted-foreground mt-1">Manage and review job applications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <Card className="p-6 h-fit lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4" />
              <h2 className="font-semibold">Filters</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <select
                  className="w-full mt-1 p-2 rounded-md border bg-background"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search applicants..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Applications List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {isLoading ? (
                <Card className="p-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </Card>
              ) : filteredApplications.length === 0 ? (
                <Card className="p-8 text-center">
                  <UserCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No applications found</h3>
                  <p className="text-muted-foreground mt-1">
                    {applications.length === 0 
                      ? 'No applications have been submitted yet.' 
                      : 'Try adjusting your search or filters'}
                  </p>
                </Card>
              ) : (
                filteredApplications.map(application => (
                  <Card key={application.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {application.application_data.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            {application.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {application.job?.title || 'Unknown Position'}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {application.job?.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {application.application_data.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(application.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(application.application_data.resumeUrl, '_blank')}
                          className="flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          Resume
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                          className="flex items-center gap-1"
                        >
                          <MessagesSquare className="w-4 h-4" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Application Review Dialog */}
        <Dialog 
          open={!!selectedApplication} 
          onOpenChange={(open) => !open && setSelectedApplication(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Review</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                {/* Applicant Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Applicant Information</h3>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <UserCircle2 className="w-4 h-4 text-muted-foreground" />
                        {selectedApplication.application_data.name}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {selectedApplication.application_data.email}
                      </p>
                      {selectedApplication.application_data.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {selectedApplication.application_data.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Application Details</h3>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {selectedApplication.job?.title}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Applied {format(new Date(selectedApplication.created_at), 'PP')}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedApplication.application_data.resumeUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Resume
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.application_data.coverLetter && (
                  <div>
                    <h3 className="font-semibold mb-2">Cover Letter</h3>
                    <Card className="p-4 bg-muted/50">
                      <p className="whitespace-pre-wrap">
                        {selectedApplication.application_data.coverLetter}
                      </p>
                    </Card>
                  </div>
                )}

                {/* Chat History */}
                <div>
                  <h3 className="font-semibold mb-2">Interview Chat History</h3>
                  <Card className="p-4 max-h-60 overflow-y-auto space-y-4">
                    {selectedApplication.conversation_history.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : message.role === 'assistant'
                              ? 'bg-muted'
                              : 'bg-muted/50 text-center text-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {format(new Date(message.timestamp), 'PP p')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>

                {/* Feedback Section */}
                <div>
                  <h3 className="font-semibold mb-2">Feedback</h3>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add your feedback here..."
                    className="mb-4"
                  />
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewing')}
                        className="flex items-center gap-1"
                      >
                        <Clock className="w-4 h-4" />
                        Mark as Reviewing
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                        className="flex items-center gap-1 hover:text-green-500"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                        className="flex items-center gap-1 hover:text-red-500"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        if (feedback.trim()) {
                          addFeedback(selectedApplication.id, feedback);
                        }
                      }}
                      disabled={!feedback.trim()}
                    >
                      Save Feedback
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}