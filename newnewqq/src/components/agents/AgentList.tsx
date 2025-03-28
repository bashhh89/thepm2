'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Edit, Trash2, Code2, CheckCircle } from "lucide-react";
import AgentForm from "./AgentForm";
import { useSettingsStore } from "@/store/settingsStore";
import { supabase } from "@/lib/supabaseClient";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Agent {
  id: string;
  name: string;
  system_prompt: string;
  created_at: string;
  owner_id: string;
}

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [widgetAgent, setWidgetAgent] = useState<Agent | null>(null);
  const [widgetCode, setWidgetCode] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const { setActiveAgent, activeAgent } = useSettingsStore();
  const { toast } = useToast();
  
  // Fetch agents when component mounts
  useEffect(() => {
    fetchAgents();
  }, []);
  
  async function fetchAgents() {
    try {
      setLoading(true);
      const response = await fetch("/api/agents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch agents");
      }
      
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function createAgent(agent: { name: string; system_prompt: string }) {
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: agent.name,
          system_prompt: agent.system_prompt,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create agent");
      }
      
      // Refresh the agent list
      fetchAgents();
    } catch (error: any) {
      throw new Error(error.message || "Failed to create agent");
    }
  }
  
  async function updateAgent(agent: { id?: string; name: string; system_prompt: string }) {
    if (!agent.id) return;
    
    try {
      const response = await fetch("/api/agents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: agent.id,
          name: agent.name,
          system_prompt: agent.system_prompt,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update agent");
      }
      
      // Refresh the agent list
      fetchAgents();
      
      // Reset editing state
      setEditingAgent(null);
    } catch (error: any) {
      throw new Error(error.message || "Failed to update agent");
    }
  }
  
  async function deleteAgent(agent: Agent) {
    try {
      const response = await fetch(`/api/agents?id=${agent.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete agent");
      }
      
      // Refresh the agent list
      fetchAgents();
      
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete agent",
        variant: "destructive",
      });
    } finally {
      setAgentToDelete(null);
      setDeleteDialogOpen(false);
    }
  }
  
  function handleSelectAgent(agent: Agent) {
    // Map the Supabase agent to the format used in the settings store
    setActiveAgent({
      id: agent.id,
      name: agent.name,
      systemPrompt: agent.system_prompt
    });
    
    toast({
      title: "Agent Selected",
      description: `${agent.name} is now your active agent`,
    });
  }
  
  function generateWidgetCode(agent: Agent) {
    setWidgetAgent(agent);
    // Generate a simple widget embed code
    const hostUrl = window.location.origin;
    const widgetCode = `
<!-- MENA Launchpad Lead Generation Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = "${hostUrl}/widget.js";
    script.async = true;
    script.dataset.agentId = "${agent.id}";
    script.dataset.apiEndpoint = "${hostUrl}/api/create-lead";
    document.head.appendChild(script);
  })();
</script>
<!-- End MENA Launchpad Widget -->
`;
    setWidgetCode(widgetCode);
  }
  
  function copyWidgetCode() {
    navigator.clipboard.writeText(widgetCode);
    toast({
      title: "Copied to clipboard",
      description: "Widget embed code copied successfully",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Agents</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Agent</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <AgentForm onSubmit={createAgent} />
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">You haven&apos;t created any agents yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {agent.name}
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingAgent(agent);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAgentToDelete(agent);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  System Prompt (first 100 chars):{" "}
                  {agent.system_prompt.length > 100
                    ? `${agent.system_prompt.substring(0, 100)}...`
                    : agent.system_prompt}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-6 flex justify-between">
                <Button
                  variant={activeAgent?.id === agent.id ? "default" : "outline"}
                  onClick={() => handleSelectAgent(agent)}
                  className="flex items-center space-x-1"
                >
                  {activeAgent?.id === agent.id && <CheckCircle className="h-4 w-4 mr-1" />}
                  {activeAgent?.id === agent.id ? "Selected" : "Select Agent"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => generateWidgetCode(agent)}
                  className="flex items-center"
                >
                  <Code2 className="h-4 w-4 mr-1" />
                  <span>Get Widget</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit Agent Dialog */}
      {editingAgent && (
        <Dialog open={!!editingAgent} onOpenChange={(open) => !open && setEditingAgent(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Agent: {editingAgent.name}</DialogTitle>
            </DialogHeader>
            <AgentForm
              agent={editingAgent}
              onSubmit={updateAgent}
              onCancel={() => setEditingAgent(null)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Widget Code Dialog */}
      {widgetAgent && (
        <Dialog open={!!widgetAgent} onOpenChange={(open) => !open && setWidgetAgent(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Widget Code for {widgetAgent.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Copy and paste this code into your website to embed the lead generation widget:
              </p>
              <Textarea className="font-mono h-32" value={widgetCode} readOnly />
              <div className="flex justify-end">
                <Button onClick={copyWidgetCode}>Copy Code</Button>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mt-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> You need to deploy a widget script at 
                  {" " + window.location.origin + "/widget.js"} 
                  for this embed code to work correctly.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {agentToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => agentToDelete && deleteAgent(agentToDelete)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}