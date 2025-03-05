import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Loader2, Sparkles, MessageSquare, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface Application {
  id: string;
  jobId: string;
  userName: string;
  conversationHistory: Array<{ role: string; content: string }>;
  applicationData: {
    name: string;
    email: string;
    phone?: string;
    resumeUrl: string;
    coverLetter?: string;
    portfolioUrl?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      website?: string;
    };
    expectedSalary?: number;
    noticePeriod?: number;
  };
  feedback?: string;
  job?: {
    title: string;
    department: string;
  };
  adminDashboardViewed: boolean;
}

export function AdminJobApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    }
  };

  const analyzeApplication = async (application: Application) => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze this job application for ${application.job?.title || 'the position'}:

      Applicant: ${application.applicationData.name}
      Resume: ${application.applicationData.resumeUrl}
      Cover Letter: ${application.applicationData.coverLetter || 'Not provided'}
      
      Conversation History:
      ${application.conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}
      
      Please provide a comprehensive analysis including:
      1. Candidate's key qualifications and experience
      2. Communication style and professionalism
      3. Potential fit for the role
      4. Areas of concern or missing information
      5. Recommended next steps
      
      Format the response in a clear, structured way.`;

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o',
        stream: false
      });

      setAiAnalysis(response.message.content);

      // Update application as viewed
      if (!application.adminDashboardViewed) {
        await fetch(`/api/applications/${application.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminDashboardViewed: true })
        });
      }
    } catch (error) {
      console.error('Error analyzing application:', error);
      toast.error('Failed to analyze application');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFeedback = async (application: Application) => {
    try {
      const prompt = `Generate a professional feedback email for ${application.applicationData.name} 
      regarding their application for ${application.job?.title || 'the position'}.
      
      Analysis context:
      ${aiAnalysis}
      
      Make the email:
      1. Professional and courteous
      2. Specific to their application
      3. Constructive and helpful
      4. Clear about next steps
      
      Return just the email content.`;

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o',
        stream: false
      });

      const feedback = response.message.content;

      // Save the feedback
      await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });

      setApplications(prev => 
        prev.map(app => 
          app.id === application.id 
            ? { ...app, feedback }
            : app
        )
      );

      toast.success('Feedback generated and saved');
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error('Failed to generate feedback');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
          {applications.map(app => (
            <Card
              key={app.id}
              className={cn(
                "p-4 cursor-pointer hover:shadow-md transition-shadow",
                selectedApp?.id === app.id && "border-primary",
                !app.adminDashboardViewed && "border-warning"
              )}
              onClick={() => {
                setSelectedApp(app);
                analyzeApplication(app);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{app.applicationData.name}</h3>
                  <p className="text-sm text-muted-foreground">{app.job?.title}</p>
                  <p className="text-sm text-muted-foreground">{app.applicationData.email}</p>
                </div>
                {!app.adminDashboardViewed && (
                  <span className="px-2 py-1 bg-warning/10 text-warning rounded-md text-xs">
                    New
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Application Details */}
        {selectedApp && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedApp.applicationData.name}</h2>
                  <p className="text-muted-foreground">
                    {selectedApp.job?.title} - {selectedApp.job?.department}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedApp.applicationData.resumeUrl)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApp(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">AI Analysis</h3>
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-primary" />
                  )}
                </div>
                <Card className="p-4 bg-muted/50">
                  {aiAnalysis ? (
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>') }} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Analyzing application...
                    </div>
                  )}
                </Card>
              </div>

              {/* Conversation History */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Application Conversation</h3>
                <Card className="p-4 max-h-[300px] overflow-y-auto">
                  <div className="space-y-4">
                    {selectedApp.conversationHistory.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            message.role === 'user'
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-6">
                {!selectedApp.feedback && aiAnalysis && (
                  <Button onClick={() => generateFeedback(selectedApp)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Generate Feedback
                  </Button>
                )}
              </div>

              {/* Feedback Preview */}
              {selectedApp.feedback && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Generated Feedback</h3>
                  <Card className="p-4 bg-muted/50">
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: selectedApp.feedback.replace(/\n/g, '<br/>')
                      }} />
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}