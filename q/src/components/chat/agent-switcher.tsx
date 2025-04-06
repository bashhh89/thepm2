"use client";

import { useState, useRef, useEffect } from 'react';
import { useSettingsStore, Agent } from '@/store/settingsStore';
import { cn } from '@/lib/utils';
import { Bot, X, Pencil, Trash2, Wrench, Check } from 'lucide-react';
import { toasts } from '@/components/ui/toast-wrapper';

interface AgentManagerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentManagerPanel({ isOpen, onClose }: AgentManagerPanelProps) {
  const { 
    agents, 
    addAgent, 
    updateAgent, 
    deleteAgent, 
    selectedAgentId,
    setSelectedAgentId,
    defaultAgents,
    activeTextModel,
    activeImageModel,
    activeVoice,
    setAgentModelPreference
  } = useSettingsStore();
  
  // Check if agents list includes default agents that can't be deleted
  const isDefaultAgent = (agentId: string): boolean => {
    // You could implement a check based on agent ID patterns or reserved names
    // For now, let's assume agents with IDs starting with 'default-' are system defaults
    return agentId.startsWith('default-');
  };

  const [agentName, setAgentName] = useState("");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (agentName.trim() === "" || agentPrompt.trim() === "") {
      toasts.error("Please enter both a name and a system prompt for the new agent.");
      return;
    }
    
    if (editingAgent) {
      // Update existing agent
      updateAgent(editingAgent.id, {
        name: agentName,
        systemPrompt: agentPrompt
      });
      
      toasts.success(`${agentName} has been updated.`);
    } else {
      // Add new agent with default model preferences
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: agentName,
        systemPrompt: agentPrompt,
        system_prompt: agentPrompt,
        modelPreferences: {
          textModel: activeTextModel,
          imageModel: activeImageModel,
          voiceModel: activeVoice
        }
      };
      
      addAgent(newAgent);
      setSelectedAgentId(newAgent.id);
      
      toasts.success(`${agentName} is now ready to use.`);
    }
    
    // Reset form
    setAgentName("");
    setAgentPrompt("");
    setEditingAgent(null);
  };
  
  const handleEditAgent = (agent: Agent) => {
    setAgentName(agent.name);
    setAgentPrompt(agent.systemPrompt);
    setEditingAgent(agent);
  };
  
  const handleDeleteAgent = (agentId: string) => {
    // Don't allow deleting default agents
    if (isDefaultAgent(agentId)) {
      toasts.error("Default agents cannot be deleted.");
      return;
    }
    
    deleteAgent(agentId);
    setShowConfirmDelete(null);
    
    toasts.success("The agent has been removed.");
  };

  return (
    <div 
      className={cn(
        "fixed right-0 top-0 bottom-0 w-[350px] bg-zinc-900 border-l border-zinc-700/50 shadow-xl z-50 transition-transform duration-300 ease-in-out overflow-auto",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
        <h2 className="text-lg font-semibold text-white">Manage Assistants</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Agent Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
            {editingAgent ? "Edit Assistant" : "Create New Assistant"}
          </h3>
          <form onSubmit={handleAddAgent} className="space-y-4">
            <div>
              <label htmlFor="agentName" className="block text-sm font-medium text-zinc-400 mb-1">
                Name
              </label>
              <input
                id="agentName"
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. Marketing Expert"
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="agentPrompt" className="block text-sm font-medium text-zinc-400 mb-1">
                System Prompt
              </label>
              <textarea
                id="agentPrompt"
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Describe what this assistant should do..."
                rows={4}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                {editingAgent ? "Update Assistant" : "Create Assistant"}
              </button>
              {editingAgent && (
                <button
                  type="button"
                  onClick={() => {
                    setAgentName("");
                    setAgentPrompt("");
                    setEditingAgent(null);
                  }}
                  className="py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-md transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800"></div>

        {/* Agents List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
            Your Assistants
          </h3>
          <div className="space-y-2">
            {agents.map((agent) => (
              <div 
                key={agent.id} 
                className={cn(
                  "p-3 rounded-md border transition-colors",
                  agent.id === selectedAgentId
                    ? "bg-zinc-800/80 border-zinc-700"
                    : "bg-zinc-800/40 border-transparent hover:border-zinc-700"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-white">{agent.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {agent.systemPrompt.length > 60 
                          ? `${agent.systemPrompt.substring(0, 60)}...` 
                          : agent.systemPrompt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {!isDefaultAgent(agent.id) && (
                      <>
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        
                        {showConfirmDelete === agent.id ? (
                          <>
                            <button
                              onClick={() => handleDeleteAgent(agent.id)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-zinc-700 rounded transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setShowConfirmDelete(null)}
                              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setShowConfirmDelete(agent.id)}
                            className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </>
                    )}
                    
                    <button
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={cn(
                        "px-2 py-1 text-xs rounded",
                        agent.id === selectedAgentId
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                      )}
                    >
                      {agent.id === selectedAgentId ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAgentManager, setShowAgentManager] = useState(false);
  const { activeAgent, setActiveAgent, agents } = useSettingsStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card/60 hover:bg-card/80 text-foreground transition-colors"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-medium">
            {activeAgent?.name?.charAt(0) || 'G'}
          </div>
          <span className="text-sm font-medium max-w-[120px] truncate">{activeAgent?.name || 'General Assistant'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14" 
            height="14"
            viewBox="0 0 24 24"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={cn("transition-transform", isOpen ? "rotate-180" : "")}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="fixed md:absolute top-[calc(100%+5px)] left-0 w-72 md:w-64 bg-card rounded-md border border-border shadow-lg overflow-hidden z-[100]">
            <div className="p-2 border-b border-border">
              <h3 className="text-xs font-semibold text-muted-foreground">SWITCH AGENT</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto py-1">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  className={cn(
                    "w-full text-left p-2 hover:bg-muted/50 flex items-start gap-2 transition-colors",
                    agent.id === activeAgent?.id ? "bg-primary/10" : ""
                  )}
                  onClick={() => {
                    setActiveAgent(agent);
                    setIsOpen(false);
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    {agent.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{agent.name}</div>
                    {agent.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{agent.description}</div>
                    )}
                  </div>
                  {agent.id === activeAgent?.id && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                className="w-full text-left p-2 text-xs font-medium text-primary hover:bg-muted/50 rounded transition-colors"
                onClick={() => {
                  setShowAgentManager(true);
                  setIsOpen(false);
                }}
              >
                Manage agents...
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Agent Manager Panel */}
      <AgentManagerPanel 
        isOpen={showAgentManager} 
        onClose={() => setShowAgentManager(false)} 
      />
    </>
  );
}