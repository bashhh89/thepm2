"use client";

import { useState, useEffect, useMemo } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { usePipelineStore } from "@/store/pipelineStore";
import { toast } from "@/components/ui/use-toast";
import { CardUnified, CardUnifiedHeader, CardUnifiedTitle, CardUnifiedContent, CardUnifiedFooter } from "@/components/ui/card-unified";
import { ButtonUnified } from "@/components/ui/button-unified";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderUnified from "@/components/ui/header-unified";
import { layouts, componentStyles } from "@/lib/design-system";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { 
  UserPlus, MoreHorizontal, Plus, X, Clock, CheckCircle, 
  AlertCircle, PenLine, Filter, Users, ArrowLeft, ArrowRight 
} from "lucide-react";
import { KanbanBoard } from "@/components/leads/KanbanBoard";
import { PipelineManager } from "@/components/leads/PipelineManager";
import { LeadChatPanel } from "@/components/leads/LeadChatPanel";

// Types
interface Lead {
  id: string;
  name: string;
  email: string;
  initial_message: string;
  agent_id: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  notes?: string;
  created_at: string;
  source: string;
  agents?: {
    id: string;
    name: string;
  };
}

type StatusColumn = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

// Traditional List View - Lead Row Component
function LeadRow({ 
  lead, 
  onEdit,
  onDelete 
}: { 
  lead: Lead; 
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="border-b border-zinc-800 last:border-0">
      <td className="py-3">{lead.name}</td>
      <td className="py-3">{lead.email}</td>
      <td className="py-3">{lead.agents?.name || "-"}</td>
      <td className="py-3">
        <StatusBadge status={lead.status} />
      </td>
      <td className="py-3">{new Date(lead.created_at).toLocaleDateString()}</td>
      <td className="py-3">
        <div className="flex gap-2">
          <ButtonUnified 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(lead)}
          >
            <PenLine className="h-4 w-4 mr-1" /> 
            Edit
          </ButtonUnified>
          <ButtonUnified 
            variant="outline" 
            size="sm" 
            className="text-red-400 hover:text-red-300"
            onClick={() => onDelete(lead.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Delete
          </ButtonUnified>
        </div>
      </td>
    </tr>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusClasses = () => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "contacted":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "qualified":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "converted":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "closed":
        return "bg-zinc-700/30 text-zinc-400 border border-zinc-600";
      default:
        return "bg-zinc-700/30 text-zinc-400 border border-zinc-600";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClasses()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Main component
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [newNotes, setNewNotes] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [isAddingLead, setIsAddingLead] = useState<boolean>(false);
  const [newLead, setNewLead] = useState<{
    name: string;
    email: string;
    initial_message: string;
    agent_id: string;
  }>({
    name: "",
    email: "",
    initial_message: "",
    agent_id: "",
  });

  const { agents } = useSettingsStore();
  const { pipelines } = usePipelineStore();

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/leads?page=${currentPage}`;

      if (selectedAgentId) {
        url += `&agent_id=${selectedAgentId}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch leads");
      }

      setLeads(data.leads || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching leads");
      toast({
        title: "Error",
        description: err.message || "Failed to load leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch leads on initial load and when filters change
  useEffect(() => {
    fetchLeads();
  }, [currentPage, selectedAgentId]);

  // Helper to check if a status is valid
  const isValidStatus = (status: string): status is Lead['status'] => {
    return ['new', 'contacted', 'qualified', 'converted', 'closed'].includes(status);
  };

  // Handle lead status change
  const handleLeadMove = async (leadId: string, newStatus: string) => {
    // Find the lead to update
    const leadToUpdate = leads.find(lead => lead.id === leadId);
    if (!leadToUpdate) return;
    
    // Validate the new status
    if (!isValidStatus(newStatus)) {
      toast({
        title: "Error",
        description: `Invalid status: ${newStatus}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Optimistically update UI
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      
      // Call API to update status
      const response = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: leadId, 
          status: newStatus 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update lead status");
      }
      
      toast({
        title: "Status Updated",
        description: `Lead moved to ${pipelines.find(p => p.id === newStatus)?.name || newStatus}`,
      });
    } catch (err: any) {
      // Revert the optimistic update
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? leadToUpdate : lead
        )
      );
      
      toast({
        title: "Error",
        description: err.message || "Failed to update lead status",
        variant: "destructive",
      });
    }
  };

  // Update lead status and notes
  const updateLead = async () => {
    if (!editingLead) return;
    
    // Validate the new status if provided
    const statusToUpdate = newStatus || editingLead.status;
    if (!isValidStatus(statusToUpdate)) {
      toast({
        title: "Error",
        description: `Invalid status: ${statusToUpdate}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch("/api/leads", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingLead.id, 
          status: statusToUpdate, 
          notes: newNotes || editingLead.notes 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update lead");
      }

      // Update lead in state
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === editingLead.id 
            ? { 
                ...lead, 
                status: statusToUpdate, 
                notes: newNotes || lead.notes 
              } 
            : lead
        )
      );

      toast({
        title: "Success",
        description: "Lead updated successfully",
      });

      // Reset editing state
      setEditingLead(null);
      setNewNotes("");
      setNewStatus("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  // Handle lead deletion
  const deleteLead = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this lead? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/leads?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete lead");
      }

      // Remove lead from state
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));

      // Close edit modal if deleting the lead being edited
      if (editingLead?.id === id) {
        setEditingLead(null);
      }

      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  // Add lead function
  const addLead = async () => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create lead");
      }

      // Add new lead to state
      setLeads(prevLeads => [data.lead, ...prevLeads]);
      
      // Reset form and close modal
      setNewLead({
        name: "",
        email: "",
        initial_message: "",
        agent_id: "",
      });
      setIsAddingLead(false);
      
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create lead",
        variant: "destructive",
      });
    }
  };

  const columns: StatusColumn[] = [
    {
      id: "new",
      name: "New Leads",
      description: "Leads that have just entered the system",
      icon: <Clock className="h-5 w-5 text-blue-400" />,
      color: "blue",
    },
    {
      id: "contacted",
      name: "Contacted",
      description: "Leads that have been reached out to",
      icon: <PenLine className="h-5 w-5 text-amber-400" />,
      color: "amber",
    },
    {
      id: "qualified",
      name: "Qualified",
      description: "Leads that have shown serious interest",
      icon: <CheckCircle className="h-5 w-5 text-purple-400" />,
      color: "purple",
    },
    {
      id: "converted",
      name: "Converted",
      description: "Leads that have become customers",
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      color: "green",
    },
    {
      id: "closed",
      name: "Closed",
      description: "Leads that have been marked as lost or rejected",
      icon: <X className="h-5 w-5 text-zinc-400" />,
      color: "zinc",
    },
  ];

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen">
      <HeaderUnified 
        title="Leads & Clients" 
        description="Manage your sales pipeline and client relationships"
        icon={<Users className="h-5 w-5" />}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Leads" }
        ]}
        actions={
          <div className="flex space-x-3">
            <ButtonUnified 
              variant="outline" 
              onClick={() => setViewMode(viewMode === "kanban" ? "list" : "kanban")}
            >
              {viewMode === "kanban" ? "List View" : "Kanban View"}
            </ButtonUnified>
            <ButtonUnified onClick={() => setIsAddingLead(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lead
            </ButtonUnified>
          </div>
        }
      />

      <div className={layouts.container}>
        {/* Filter Controls */}
        <CardUnified className="mb-6">
          <CardUnifiedContent className="pt-5">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-grow max-w-xs">
                <label className="block mb-1 text-sm text-zinc-400">Filter by Agent</label>
                <select 
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                >
                  <option value="">All Agents</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-grow flex justify-end">
                <ButtonUnified 
                  variant="outline" 
                  onClick={fetchLeads}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </ButtonUnified>
              </div>
            </div>
          </CardUnifiedContent>
        </CardUnified>

        {error && (
          <CardUnified className="mb-6 border-red-500/50 bg-red-900/10">
            <CardUnifiedContent className="pt-5">
              <p className="text-red-400">{error}</p>
            </CardUnifiedContent>
          </CardUnified>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : leads.length === 0 ? (
          <CardUnified className="text-center py-12">
            <CardUnifiedContent className="pt-12 flex flex-col items-center">
              <Users className="h-12 w-12 text-zinc-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Leads Found</h3>
              <p className="text-zinc-400 mb-6">Start by adding your first lead to begin managing your pipeline.</p>
              <ButtonUnified onClick={() => setIsAddingLead(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Lead
              </ButtonUnified>
            </CardUnifiedContent>
          </CardUnified>
        ) : (
          <div>
            {viewMode === "kanban" ? (
              <div className="overflow-x-auto pb-6">
                <div className="grid grid-cols-5 gap-4 min-w-[1000px]">
                  {columns.map(column => (
                    <div key={column.id} className="flex flex-col h-full">
                      <div className={`flex items-center p-3 rounded-t-lg bg-${column.color}-500/10 border border-${column.color}-500/20`}>
                        {column.icon}
                        <h3 className="ml-2 font-medium">{column.name} ({getLeadsByStatus(column.id).length})</h3>
                      </div>
                      <div className="flex-grow bg-zinc-800/50 border border-t-0 border-zinc-700 rounded-b-lg p-3 min-h-[500px]">
                        {getLeadsByStatus(column.id).map(lead => (
                          <CardUnified 
                            key={lead.id} 
                            variant="interactive" 
                            className="mb-3"
                          >
                            <CardUnifiedContent className="pt-5">
                              <h4 className="font-medium">{lead.name}</h4>
                              <p className="text-sm text-zinc-400 mt-1">{lead.email}</p>
                              {lead.agents?.name && (
                                <div className="flex items-center mt-2 text-xs text-zinc-500">
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  {lead.agents.name}
                                </div>
                              )}
                              <div className="flex justify-end mt-2">
                                <ButtonUnified 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onEdit(lead)}
                                >
                                  <PenLine className="h-3 w-3" />
                                </ButtonUnified>
                              </div>
                            </CardUnifiedContent>
                          </CardUnified>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <CardUnified>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800 text-left">
                        <th className="p-3 font-medium">Name</th>
                        <th className="p-3 font-medium">Email</th>
                        <th className="p-3 font-medium">Agent</th>
                        <th className="p-3 font-medium">Status</th>
                        <th className="p-3 font-medium">Created</th>
                        <th className="p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <LeadRow 
                          key={lead.id} 
                          lead={lead} 
                          onEdit={setEditingLead} 
                          onDelete={deleteLead} 
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardUnified>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <ButtonUnified
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </ButtonUnified>
                
                <span className="text-zinc-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <ButtonUnified
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </ButtonUnified>
              </div>
            )}
          </div>
        )}

        {/* Add Lead Modal */}
        {isAddingLead && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <CardUnified className="w-full max-w-md">
              <CardUnifiedHeader>
                <CardUnifiedTitle>Add New Lead</CardUnifiedTitle>
              </CardUnifiedHeader>
              <CardUnifiedContent>
                {/* Form content for adding a new lead */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm text-zinc-400">Name</label>
                    <Input
                      className={componentStyles.input.base}
                      placeholder="Full Name"
                      value={newLead.name}
                      onChange={e => setNewLead({...newLead, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-zinc-400">Email</label>
                    <Input
                      className={componentStyles.input.base}
                      type="email"
                      placeholder="email@example.com"
                      value={newLead.email}
                      onChange={e => setNewLead({...newLead, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-zinc-400">Initial Message</label>
                    <Textarea
                      className={componentStyles.input.base}
                      placeholder="Initial contact message or notes..."
                      value={newLead.initial_message}
                      onChange={e => setNewLead({...newLead, initial_message: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-zinc-400">Assign to Agent</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                      value={newLead.agent_id}
                      onChange={e => setNewLead({...newLead, agent_id: e.target.value})}
                    >
                      <option value="">Unassigned</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardUnifiedContent>
              <CardUnifiedFooter className="flex justify-end space-x-3">
                <ButtonUnified 
                  variant="outline" 
                  onClick={() => setIsAddingLead(false)}
                >
                  Cancel
                </ButtonUnified>
                <ButtonUnified onClick={addLead}>
                  Add Lead
                </ButtonUnified>
              </CardUnifiedFooter>
            </CardUnified>
          </div>
        )}

        {/* Edit Lead Modal */}
        {editingLead && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <CardUnified className="w-full max-w-md">
              <CardUnifiedHeader>
                <CardUnifiedTitle>Edit Lead: {editingLead.name}</CardUnifiedTitle>
              </CardUnifiedHeader>
              <CardUnifiedContent>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm text-zinc-400">Status</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                      value={newStatus || editingLead.status}
                      onChange={e => setNewStatus(e.target.value)}
                    >
                      {columns.map(column => (
                        <option key={column.id} value={column.id}>
                          {column.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-zinc-400">Notes</label>
                    <Textarea
                      className={componentStyles.input.base}
                      placeholder="Add notes about this lead..."
                      value={newNotes || editingLead.notes || ""}
                      onChange={e => setNewNotes(e.target.value)}
                    />
                  </div>
                </div>
              </CardUnifiedContent>
              <CardUnifiedFooter className="flex justify-end space-x-3">
                <ButtonUnified 
                  variant="outline" 
                  onClick={() => {
                    setEditingLead(null);
                    setNewNotes("");
                    setNewStatus("");
                  }}
                >
                  Cancel
                </ButtonUnified>
                <ButtonUnified onClick={updateLead}>
                  Save Changes
                </ButtonUnified>
              </CardUnifiedFooter>
            </CardUnified>
          </div>
        )}
      </div>
    </div>
  );
}