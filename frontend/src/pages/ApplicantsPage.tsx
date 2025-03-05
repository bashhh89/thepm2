import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/Dialog';
import { 
  Search, 
  FileText, 
  Mail, 
  Phone, 
  Calendar, 
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  UserCircle2,
  Building2
} from 'lucide-react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

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
  conversation_history: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }[];
  feedback?: string;
  admin_dashboard_viewed: boolean;
  job?: {
    title: string;
    department: string;
  };
  status?: 'pending' | 'reviewing' | 'approved' | 'rejected';
}

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs (
            title,
            department
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(handleSupabaseError(error).error);
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
      toast.error(handleSupabaseError(error).error);
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'reviewing':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status?: string) => {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Applicant Tracking</h1>
          <p className="text-muted-foreground mt-1">Manage and review job applications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <Card className="p-6 h-fit lg:col-span-1 border-2">
          <h2 className="font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
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
          </div>
        </Card>

        {/* Applications List */}
        <div className="lg:col-span-3">
          <Card className="p-6 border-2">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or job title..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <UserCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No applications found</h3>
                  <p className="text-muted-foreground mt-1">
                    {applications.length === 0 
                      ? 'No applications have been submitted yet.' 
                      : 'Try adjusting your search or filters'}
                  </p>
                </div>
              ) : (
                filteredApplications.map(application => (
                  <Card 
                    key={application.id} 
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedApplicationId === application.id ? "shadow-lg" : "hover:shadow-md"
                    )}
                  >
                    <div 
                      className={cn(
                        "p-4 cursor-pointer",
                        expandedApplicationId === application.id ? "bg-muted/50" : "hover:bg-muted/30"
                      )}
                      onClick={() => setExpandedApplicationId(expandedApplicationId === application.id ? null : application.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {application.application_data.name}
                            </h3>
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                              getStatusColor(application.status)
                            )}>
                              {getStatusIcon(application.status)}
                              {application.status || 'Pending'}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {application.job?.title || 'Unknown Position'}
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
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(application.application_data.resumeUrl, '_blank');
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {expandedApplicationId === application.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedApplicationId === application.id && (
                      <div className="p-4 border-t">
                        <div className="space-y-4">
                          {/* Contact Information */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{application.application_data.email}</span>
                              </div>
                              {application.application_data.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  <span>{application.application_data.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Application Materials */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Application Materials</h4>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => window.open(application.application_data.resumeUrl, '_blank')}
                              >
                                <FileText className="w-4 h-4" />
                                View Resume
                              </Button>
                            </div>
                          </div>

                          {/* Cover Letter */}
                          {application.application_data.coverLetter && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                              <div className="bg-muted/30 rounded-lg p-4">
                                <p className="text-sm whitespace-pre-wrap">
                                  {application.application_data.coverLetter}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Status Update */}
                          <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Update Status</h4>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateApplicationStatus(application.id, 'reviewing')}
                                className={cn(
                                  application.status === 'reviewing' && "border-yellow-500 text-yellow-500"
                                )}
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Reviewing
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateApplicationStatus(application.id, 'approved')}
                                className={cn(
                                  application.status === 'approved' && "border-green-500 text-green-500"
                                )}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                className={cn(
                                  application.status === 'rejected' && "border-red-500 text-red-500"
                                )}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>

                          {/* Conversation History */}
                          <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Chat History</h4>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {application.conversation_history.map((message, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "p-2 rounded-lg text-sm",
                                    message.role === 'user' 
                                      ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                                      : message.role === 'assistant'
                                      ? "bg-muted max-w-[80%]"
                                      : "bg-muted/50 text-center text-xs"
                                  )}
                                >
                                  <p className="whitespace-pre-wrap">{message.content}</p>
                                  <span className="text-xs opacity-70 block mt-1">
                                    {format(new Date(message.timestamp), 'MMM d, yyyy h:mm a')}
                                  </span>
                                </div>
                              ))}
                            </div>
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
    </div>
  );
}