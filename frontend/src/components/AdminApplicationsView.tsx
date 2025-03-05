import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ThumbsUp, ThumbsDown, Star, Mail, Phone, FileText, MessageSquare, Clock, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'new' | 'reviewed' | 'contacted' | 'rejected';
  feedback?: {
    rating: number;
    comment: string;
  };
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export function AdminApplicationsView() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications/admin');
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const updateApplicationStatus = async (id: string, status: Application['status']) => {
    try {
      await fetch(`/api/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderChatHistory = (messages: Application['messages']) => (
    <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-muted/20 rounded-lg">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              msg.role === 'user'
                ? 'bg-primary/10 ml-auto'
                : 'bg-muted'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Job Applications</h1>
          <p className="text-muted-foreground">Review and manage candidate applications</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="search"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 rounded-md border bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-2 rounded-md border bg-background"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredApplications.map(app => (
            <Card
              key={app.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedApplication?.id === app.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedApplication(app)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{app.name}</h3>
                  <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'contacted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {app.email}
                </span>
                {app.feedback && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {app.feedback.rating}/5
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Applied {format(new Date(app.createdAt), 'MMM d, yyyy')}
              </div>
            </Card>
          ))}
        </div>

        {selectedApplication && (
          <Card className="p-6 lg:sticky lg:top-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">{selectedApplication.name}</h2>
                <p className="text-muted-foreground">{selectedApplication.jobTitle}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant={selectedApplication.status === 'reviewed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewed')}
                >
                  Mark as Reviewed
                </Button>
                <Button
                  variant={selectedApplication.status === 'contacted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'contacted')}
                >
                  Mark as Contacted
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Contact Information</p>
                  <div className="space-y-2">
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {selectedApplication.email}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {selectedApplication.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Application Details</p>
                  <div className="space-y-2">
                    <p className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Applied {format(new Date(selectedApplication.createdAt), 'PPP')}
                    </p>
                    {selectedApplication.feedback && (
                      <p className="text-sm flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        Rating: {selectedApplication.feedback.rating}/5
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedApplication.resumeUrl && (
                <div>
                  <p className="text-sm font-medium mb-2">Resume</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(selectedApplication.resumeUrl, '_blank')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                </div>
              )}

              {selectedApplication.coverLetter && (
                <div>
                  <p className="text-sm font-medium mb-2">Cover Letter</p>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Chat History</p>
                {renderChatHistory(selectedApplication.messages)}
              </div>

              {selectedApplication.feedback?.comment && (
                <div>
                  <p className="text-sm font-medium mb-2">Candidate Feedback</p>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm">{selectedApplication.feedback.comment}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}