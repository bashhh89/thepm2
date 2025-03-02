import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { KanbanBoard } from '../components/KanbanBoard';
import { usePipeline } from '../contexts/PipelineContext';
import { PipelineManager } from '../components/PipelineManager';
import { Lead } from '../types/pipeline';
import { cn } from '../lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignee?: string;
}

interface HistoryItem {
  date: string;
  action: string;
}

interface Activity {
  id: string;
  type: 'note' | 'email' | 'call' | 'meeting' | 'task' | 'status_change';
  description: string;
  timestamp: string;
  user: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  // Load leads including those from chat widget
  useEffect(() => {
    const chatLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(prevLeads => {
      // Combine existing leads with chat leads, avoiding duplicates
      const existingIds = new Set(prevLeads.map(l => l.id));
      const newLeads = chatLeads.filter(l => !existingIds.has(l.id));
      return [...prevLeads, ...newLeads];
    });
  }, []);

  // Save leads back to localStorage when they change
  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    status: 'new',
    pipelineId: 'default'
  });

  const { pipelines, currentPipelineId } = usePipeline();
  const currentPipeline = pipelines.find(p => p.id === currentPipelineId);

  const handleLeadMove = (leadId: string, newStatus: string) => {
    setLeads(leads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleCloseDetails = () => {
    setSelectedLead(null);
  };

  const handleNewLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeadWithId: Lead = {
      ...newLead as Lead,
      id: Math.random().toString(36).substr(2, 9),
      pipelineId: currentPipelineId
    };
    setLeads([...leads, newLeadWithId]);
    setIsNewLeadModalOpen(false);
    setNewLead({ status: 'new', pipelineId: currentPipelineId });
  };

  // Filter leads for current pipeline
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => lead.pipelineId === currentPipelineId);
  }, [leads, currentPipelineId]);

  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [activities, setActivities] = useState<Record<string, Activity[]>>({});
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<Record<string, string>>({});
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  const generateAiSummary = async (leadId: string) => {
    setAiSummaryLoading(true);
    // Here you would integrate with your AI service
    // For now, we'll simulate a response
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setAiSummary({
        ...aiSummary,
        [leadId]: `Based on the available data, ${lead.name} from ${lead.company} appears to be a ${lead.value} opportunity. They were first contacted through ${lead.source || 'direct contact'}. Regular follow-ups and engagement through email and phone calls suggest active interest in our solutions.`
      });
    }
    setAiSummaryLoading(false);
  };

  const handleAddTask = (leadId: string) => {
    if (!newTask.title) return;
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      completed: false,
      dueDate: newTask.dueDate,
      assignee: newTask.assignee
    };
    setTasks({
      ...tasks,
      [leadId]: [...(tasks[leadId] || []), task]
    });
    setNewTask({});
    setShowNewTaskForm(false);
    
    // Add task creation to activities
    const activity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'task',
      description: `Task created: ${task.title}`,
      timestamp: new Date().toISOString(),
      user: 'Current User' // Replace with actual user info
    };
    setActivities({
      ...activities,
      [leadId]: [...(activities[leadId] || []), activity]
    });
  };

  const handleToggleTask = (leadId: string, taskId: string) => {
    setTasks({
      ...tasks,
      [leadId]: tasks[leadId].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads Pipeline</h2>
          <p className="text-muted-foreground">Manage and track your leads through the sales pipeline.</p>
        </div>
        <Button onClick={() => setIsNewLeadModalOpen(true)}>Add Lead</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b">
          <PipelineManager />
        </div>
        <div className="h-[calc(100vh-16rem)]">
          <KanbanBoard
            leads={filteredLeads}
            onLeadMove={handleLeadMove}
            onLeadClick={handleLeadClick}
          />
        </div>
      </Card>
  
      {selectedLead && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedLead.name}</h2>
                  <p className="text-muted-foreground">{selectedLead.company}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseDetails}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  {/* AI Summary Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">AI-Generated Summary</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateAiSummary(selectedLead.id)}
                        disabled={aiSummaryLoading}
                      >
                        {aiSummaryLoading ? 'Generating...' : 'Generate Summary'}
                      </Button>
                    </div>
                    {aiSummary[selectedLead.id] ? (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                        {aiSummary[selectedLead.id]}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Click the button above to generate an AI summary of this lead.
                      </p>
                    )}
                  </div>

                  {/* Contact and Lead Details */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold">Contact Information</h3>
                      <div className="space-y-2">
                        {selectedLead.email && (
                          <p className="text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                              <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            {selectedLead.email}
                          </p>
                        )}
                        {selectedLead.phone && (
                          <p className="text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            {selectedLead.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold">Lead Details</h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Value:</span>{' '}
                          <span className="font-medium">{selectedLead.value}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Status:</span>{' '}
                          <span className="font-medium capitalize">{selectedLead.status}</span>
                        </p>
                        {selectedLead.source && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Source:</span>{' '}
                            <span className="font-medium">{selectedLead.source}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tasks Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Tasks</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNewTaskForm(true)}
                      >
                        Add Task
                      </Button>
                    </div>
                    {showNewTaskForm && (
                      <Card className="p-4">
                        <div className="space-y-4">
                          <div>
                            <input
                              type="text"
                              placeholder="Task title"
                              className="w-full p-2 rounded-md border bg-background"
                              value={newTask.title || ''}
                              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="date"
                              className="p-2 rounded-md border bg-background"
                              value={newTask.dueDate || ''}
                              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="Assignee"
                              className="p-2 rounded-md border bg-background"
                              value={newTask.assignee || ''}
                              onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowNewTaskForm(false);
                                setNewTask({});
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddTask(selectedLead.id)}
                            >
                              Add Task
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                    <div className="space-y-2">
                      {(tasks[selectedLead.id] || []).map(task => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(selectedLead.id, task.id)}
                            className="rounded border-gray-300"
                          />
                          <div className="flex-1">
                            <p className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                              {task.title}
                            </p>
                            {(task.dueDate || task.assignee) && (
                              <p className="text-xs text-muted-foreground">
                                {task.dueDate && `Due: ${task.dueDate}`}
                                {task.dueDate && task.assignee && ' • '}
                                {task.assignee && `Assigned to: ${task.assignee}`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Activity</h3>
                  <div className="space-y-4">
                    {[...(activities[selectedLead.id] || []), ...((selectedLead.history || []) as HistoryItem[])].sort((a, b) => {
                      const dateA = new Date('timestamp' in a ? a.timestamp : a.date);
                      const dateB = new Date('timestamp' in b ? b.timestamp : b.date);
                      return dateB.getTime() - dateA.getTime();
                    }).map((item, index) => (
                      <div key={index} className="flex gap-3 text-sm">
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                        <div>
                          <p className="text-muted-foreground">
                            {new Date('timestamp' in item ? item.timestamp : item.date).toLocaleString()}
                          </p>
                          <p>{'description' in item ? item.description : item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {isNewLeadModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <form onSubmit={handleNewLeadSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add New Lead</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 rounded-md border bg-background"
                      value={newLead.name || ''}
                      onChange={e => setNewLead({...newLead, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md border bg-background"
                      value={newLead.company || ''}
                      onChange={e => setNewLead({...newLead, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 rounded-md border bg-background"
                      value={newLead.email || ''}
                      onChange={e => setNewLead({...newLead, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-2 rounded-md border bg-background"
                      value={newLead.phone || ''}
                      onChange={e => setNewLead({...newLead, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Value</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 rounded-md border bg-background"
                      value={newLead.value || ''}
                      onChange={e => setNewLead({...newLead, value: e.target.value})}
                      placeholder="$0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Source</label>
                    <select
                      className="w-full p-2 rounded-md border bg-background"
                      value={newLead.source || ''}
                      onChange={e => setNewLead({...newLead, source: e.target.value})}
                    >
                      <option value="">Select source...</option>
                      <option value="Website Form">Website Form</option>
                      <option value="Direct Contact">Direct Contact</option>
                      <option value="Partner Referral">Partner Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Trade Show">Trade Show</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pipeline Stage</label>
                    <select
                      className="w-full p-2 rounded-md border bg-background"
                      value={newLead.status}
                      onChange={e => setNewLead({...newLead, status: e.target.value})}
                      required
                    >
                      {currentPipeline?.stages.map(stage => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      className="w-full p-2 rounded-md border bg-background resize-none"
                      rows={3}
                      value={newLead.notes || ''}
                      onChange={e => setNewLead({...newLead, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewLeadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Lead
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
  
    </div>
  );
}
