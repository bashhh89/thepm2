import React, { useEffect, useState } from 'react';
import { AuthGuard } from '../components/AuthGuard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { chatWithAI } from '../utils/puter-ai';

export default function AnalyticsPage() {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await chatWithAI(
          'Analyze this business data and provide 3 key insights: ' +
          'Active Leads: 24, Projects: 12, Tasks Completed: 89%, AI Conversations: 156'
        );
        const insights = response.message?.content?.split('\n').filter(Boolean) || [];
        setInsights(insights);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics & Insights</h1>
              <p className="text-muted-foreground mt-2">
                AI-powered analytics and business intelligence
              </p>
            </div>
            <Button>Export Report</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Lead Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Conversion Rate</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="h-2 bg-secondary/20 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '32%' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">24 Active Leads</span>
                  <span className="text-sm text-green-600">↑ 12%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Project Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <div className="h-2 bg-secondary/20 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '89%' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">12 Active Projects</span>
                  <span className="text-sm text-green-600">↑ 8%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">AI Engagement</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Resolution Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="h-2 bg-secondary/20 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">156 AI Conversations</span>
                  <span className="text-sm text-green-600">↑ 25%</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">AI-Generated Insights</h2>
            {isLoading ? (
              <div className="text-muted-foreground">Analyzing business data...</div>
            ) : (
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {[
                  { time: '09:00 AM', event: 'Daily team standup', type: 'meeting' },
                  { time: '10:30 AM', event: 'New lead generated', type: 'lead' },
                  { time: '11:45 AM', event: 'Project milestone achieved', type: 'project' },
                  { time: '02:15 PM', event: 'AI assistant configuration updated', type: 'system' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-20">{item.time}</span>
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm">{item.event}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Upcoming Tasks</h3>
              <div className="space-y-4">
                {[
                  { task: 'Review AI conversation logs', priority: 'High', due: 'Today' },
                  { task: 'Update project milestones', priority: 'Medium', due: 'Tomorrow' },
                  { task: 'Lead follow-up calls', priority: 'High', due: 'Today' },
                  { task: 'Team performance review', priority: 'Medium', due: 'Next Week' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">{item.task}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {item.priority}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}