import React, { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { useNavigate } from 'react-router-dom';
import { chatWithAI } from '../utils/puter-ai';
import { Card } from './Card';

export function DashboardOverview() {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

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

    getAiInsight();
  }, []);

  return (
    <div className="space-y-4 bg-background p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to QanDu</h2>
        <p className="text-muted-foreground">Your AI-powered business intelligence platform.</p>
        
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
              <h4 className="text-sm font-medium mb-1">AI Business Insight</h4>
              <p className="text-sm text-muted-foreground">
                {isLoadingInsight ? 'Loading insight...' : aiInsight}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Business Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card shadow-sm rounded-lg p-4 border">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Active Leads</div>
          </div>
          <div className="bg-card shadow-sm rounded-lg p-4 border">
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-muted-foreground">AI Conversations</div>
          </div>
          <div className="bg-card shadow-sm rounded-lg p-4 border">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="bg-card shadow-sm rounded-lg p-4 border">
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </div>
        </div>
      </div>

      <Card className="p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New lead created', time: '2 hours ago', type: 'lead' },
            { action: 'AI Chat conversation', time: '3 hours ago', type: 'chat' },
            { action: 'Document uploaded', time: '5 hours ago', type: 'document' },
            { action: 'Project milestone completed', time: 'Yesterday', type: 'project' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="flex-1">{activity.action}</span>
              <span className="text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
