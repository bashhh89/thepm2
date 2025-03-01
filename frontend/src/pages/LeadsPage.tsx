import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { KanbanBoard } from '../components/KanbanBoard';
import { usePipeline } from '../contexts/PipelineContext';
import { PipelineManager } from '../components/PipelineManager';
import { Lead } from '../types/pipeline';

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Leads Pipeline</h2>
              <p className="text-muted-foreground">Manage and track your leads through the sales pipeline.</p>
            </div>
            <Button onClick={() => setIsNewLeadModalOpen(true)}>Add Lead</Button>
          </div>

          <Card className="p-6">
            <PipelineManager />
            <KanbanBoard
              leads={leads}
              onLeadMove={handleLeadMove}
              onLeadClick={handleLeadClick}
              selectedLead={selectedLead}
              onCloseDetails={handleCloseDetails}
            />
          </Card>
      
          {selectedLead && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
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
  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        {selectedLead.email && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Email:</span> {selectedLead.email}
                          </p>
                        )}
                        {selectedLead.phone && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Phone:</span> {selectedLead.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Lead Details</h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Value:</span> {selectedLead.value}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Status:</span>{' '}
                          <span className="capitalize">{selectedLead.status}</span>
                        </p>
                        {selectedLead.source && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Source:</span> {selectedLead.source}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
  
                  {selectedLead.notes && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <p className="text-sm whitespace-pre-wrap">{selectedLead.notes}</p>
                    </div>
                  )}
  
                  {selectedLead.history && selectedLead.history.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">History</h3>
                      <div className="space-y-2">
                        {selectedLead.history.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-muted-foreground">{item.date}:</span>
                            <span>{item.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
