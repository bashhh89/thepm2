import React, { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { useNavigate } from 'react-router-dom';
import { chatWithAI } from '../utils/puter-ai';
import { Card } from './Card';
import { Button } from './Button';

export function DashboardOverview() {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAiInsight = async () => {
      try {
        const response = await chatWithAI('Provide a short, motivational business insight for today.');
        setAiInsight(response.message?.content || 'AI insights are currently unavailable.');
      } catch (error) {
        console.error('Failed to get AI insight:', error);
        setAiInsight('AI insights are currently unavailable.');
      } finally {
        setIsLoadingInsight(false);
      }
    };

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

    getAiInsight();
    fetchInsights();
  }, []);

  return (
    <div className="space-y-4 bg-background p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Overview & Analytics</h2>
          <p className="text-muted-foreground">Your AI-powered business intelligence platform.</p>
        </div>
        <Button>Export Report</Button>
      </div>
      
      <Card className="p-4 bg-primary/5 bg-background">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-1">Daily Business Insight</h4>
            <p className="text-sm text-muted-foreground">
              {isLoadingInsight ? 'Loading insight...' : aiInsight}
            </p>
          </div>
        </div>
      </Card>

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
  );
}
