import React from 'react';
import { AuthGuard } from '../components/AuthGuard';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function JobsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Project Management</h1>
            <p className="text-muted-foreground mt-2">Track and manage ongoing projects</p>
          </div>
          <Button>Create Project</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="font-semibold text-2xl mb-2">10</h3>
            <p className="text-muted-foreground">Active Projects</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-2xl mb-2">4</h3>
            <p className="text-muted-foreground">Due This Week</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-2xl mb-2">85%</h3>
            <p className="text-muted-foreground">On Schedule</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-2xl mb-2">15</h3>
            <p className="text-muted-foreground">Team Members</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
              <div className="space-y-4">
                {[
                  { name: 'Website Redesign', progress: 75, deadline: '2024-04-01', team: 4 },
                  { name: 'Mobile App Development', progress: 45, deadline: '2024-05-15', team: 6 },
                  { name: 'Marketing Campaign', progress: 90, deadline: '2024-03-20', team: 3 },
                  { name: 'Data Migration', progress: 30, deadline: '2024-06-01', team: 5 },
                ].map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-muted-foreground">Progress: {project.progress}%</span>
                        <span className="text-sm text-muted-foreground">Team: {project.team} members</span>
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">Add Task</Button>
                <Button variant="outline" className="w-full">Schedule Meeting</Button>
                <Button variant="outline" className="w-full">Generate Report</Button>
                <Button variant="outline" className="w-full">Resource Planning</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Project Categories</h3>
              <div className="space-y-2">
                {[
                  'Development',
                  'Design',
                  'Marketing',
                  'Infrastructure',
                  'Research',
                ].map((category) => (
                  <div key={category} className="flex justify-between items-center">
                    <span>{category}</span>
                    <span className="text-muted-foreground">3</span>
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
