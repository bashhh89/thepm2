"use client"

import { useState, useEffect } from "react"
import { useSettingsStore, Agent, defaultAgents } from "@/store/settingsStore"
import { useChatStore, ChatSession } from "@/store/chatStore"
import { AVAILABLE_MODELS } from "@/lib/pollinationsApi"
import { toast } from "@/components/ui/use-toast"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showAgentForm, setShowAgentForm] = useState(false)
  const [showAgentModelPrefs, setShowAgentModelPrefs] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [isEditingChatName, setIsEditingChatName] = useState<string | null>(null)
  const [newChatName, setNewChatName] = useState("")
  const [showWidgetPreview, setShowWidgetPreview] = useState(false)
  
  // Form states for new agent
  const [agentName, setAgentName] = useState("")
  const [agentPrompt, setAgentPrompt] = useState("")
  
  // Settings store
  const {
    darkMode, 
    setDarkMode,
    activeTextModel, 
    setActiveTextModel,
    activeImageModel, 
    setActiveImageModel,
    activeVoice, 
    setActiveVoice,
    activeAgent,
    agents,
    setActiveAgent,
    addAgent,
    updateAgent,
    deleteAgent,
    setAgentModelPreference,
    selectedAgentId,
    setSelectedAgentId
  } = useSettingsStore()

  // Chat store
  const {
    chatSessions,
    activeChatId,
    createChat,
    deleteChat,
    setActiveChat,
    renameChat
  } = useChatStore()

  // Get current agent's model preferences
  const currentAgent = agents.find(a => a.id === activeAgent?.id);
  const agentPrefs = currentAgent?.modelPreferences || {};

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    
    // Update document class
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Apply dark mode on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Create a new chat
  const handleNewChat = () => {
    createChat()
    toast({
      title: "New chat created",
      description: "Started a new conversation",
    })
  }

  // Handle chat rename
  const handleRenameChat = (chatId: string) => {
    if (!newChatName.trim()) {
      setIsEditingChatName(null)
      return
    }
    
    renameChat(chatId, newChatName.trim())
    setIsEditingChatName(null)
    setNewChatName("")
  }

  // Start editing chat name
  const startEditingChatName = (chat: ChatSession) => {
    setIsEditingChatName(chat.id)
    setNewChatName(chat.name)
  }

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (agentName.trim() === "" || agentPrompt.trim() === "") {
      toast({
        title: "Missing information",
        description: "Please enter both a name and a system prompt for the new agent.",
        variant: "destructive"
      })
      return
    }
    
    if (editingAgent) {
      // Update existing agent
      updateAgent(editingAgent.id, {
        name: agentName,
        systemPrompt: agentPrompt
      })
      
      toast({
        title: "Agent updated",
        description: `${agentName} has been updated.`
      })
    } else {
      // Add new agent with default model preferences
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: agentName,
        systemPrompt: agentPrompt,
        modelPreferences: {
          textModel: activeTextModel,
          imageModel: activeImageModel,
          voiceModel: activeVoice
        }
      }
      
      addAgent(newAgent)
      setActiveAgent(newAgent.id)
      
      toast({
        title: "Agent created",
        description: `${agentName} is now ready to use.`
      })
    }
    
    // Reset form
    setAgentName("")
    setAgentPrompt("")
    setShowAgentForm(false)
    setEditingAgent(null)
  }
  
  const handleEditAgent = (agent: Agent) => {
    setAgentName(agent.name)
    setAgentPrompt(agent.systemPrompt)
    setEditingAgent(agent)
    setShowAgentForm(true)
  }
  
  const handleDeleteAgent = (agentId: string) => {
    // Don't allow deleting default agents
    if (defaultAgents.find(a => a.id === agentId)) {
      toast({
        title: "Cannot delete default agent",
        description: "Default agents cannot be deleted.",
        variant: "destructive"
      })
      return
    }
    
    deleteAgent(agentId)
    
    toast({
      title: "Agent deleted",
      description: "The agent has been removed."
    })
  }
  
  // Update model preferences for the current agent
  const handleSaveModelPreferences = () => {
    if (activeAgent) {
      // Save the current model selections as preferences for this agent
      if (activeTextModel) {
        setAgentModelPreference(activeAgent.id, 'textModel', activeTextModel);
      }
      
      if (activeImageModel) {
        setAgentModelPreference(activeAgent.id, 'imageModel', activeImageModel);
      }
      
      if (activeVoice) {
        setAgentModelPreference(activeAgent.id, 'voiceModel', activeVoice);
      }
      
      toast({
        title: "Preferences saved",
        description: `Model preferences for ${activeAgent.name} have been updated.`
      });
      
      setShowAgentModelPrefs(false);
    }
  }

  // Copy widget embed code to clipboard
  const copyWidgetCode = () => {
    if (!selectedAgentId) {
      toast({
        title: "No agent selected",
        description: "Please select an agent for the widget first.",
        variant: "destructive"
      });
      return;
    }

    const embedCode = `<script src="${window.location.origin}/widget.js" data-agent-id="${selectedAgentId}"></script>`;
    navigator.clipboard.writeText(embedCode);
    
    toast({
      title: "Copied to clipboard",
      description: "Widget embed code has been copied to your clipboard."
    });
  }

  return (
    <aside className={`flex flex-col h-screen bg-muted/40 border-r transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b">
        {!isCollapsed && <h2 className="font-semibold">Chat Assistant</h2>}
        <button 
          className="p-2 rounded-md hover:bg-muted"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          )}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          className="w-full flex items-center justify-center gap-2 p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={handleNewChat}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <div className={`p-4 ${isCollapsed ? 'hidden' : ''}`}>
          <h3 className="text-sm font-medium mb-2">Chat History</h3>
          {chatSessions.length > 0 ? (
            <ul className="space-y-1">
              {chatSessions.map((chat) => (
                <li key={chat.id}>
                  {isEditingChatName === chat.id ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                        className="flex-1 p-1 text-sm border rounded"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRenameChat(chat.id)
                          } else if (e.key === 'Escape') {
                            setIsEditingChatName(null)
                          }
                        }}
                      />
                      <button 
                        className="ml-1 p-1" 
                        onClick={() => handleRenameChat(chat.id)}
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div 
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${activeChatId === chat.id ? 'bg-muted' : 'hover:bg-muted/50'} group`}
                      onClick={() => setActiveChat(chat.id)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span className="truncate text-sm">{chat.name}</span>
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100">
                        <button 
                          className="p-1 hover:bg-background rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditingChatName(chat)
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                          </svg>
                        </button>
                        <button 
                          className="p-1 hover:bg-background rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteChat(chat.id)
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-2">
              No chat history
            </div>
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div className="border-t p-4">
        {/* Agent Selector */}
        {!isCollapsed && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Agent</h3>
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded">New</span>
            </div>
            
            {/* Agent Card UI */}
            <div className="border rounded-md p-2 mb-3 bg-background hover:shadow-sm transition-shadow relative">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"/>
                  </svg>
                </div>
                <select
                  className="flex-1 p-1 bg-transparent text-sm border-none focus:outline-none focus:ring-0"
                  value={activeAgent?.id || ''}
                  onChange={(e) => setActiveAgent(e.target.value)}
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {activeAgent?.systemPrompt ? `${activeAgent.systemPrompt.substring(0, 60)}...` : 'No system prompt defined'}
              </div>
            </div>
            
            <div className="mt-2 flex gap-2">
              <button
                className="flex-1 text-xs p-1 bg-primary/10 hover:bg-primary/20 rounded"
                onClick={() => {
                  setAgentName("");
                  setAgentPrompt("");
                  setEditingAgent(null);
                  setShowAgentForm(!showAgentForm);
                  setShowAgentModelPrefs(false);
                  setShowWidgetPreview(false);
                }}
              >
                {showAgentForm ? "Cancel" : "Add Agent"}
              </button>
              
              {activeAgent && !defaultAgents.find(a => a.id === activeAgent.id) && (
                <>
                  <button
                    className="flex-1 text-xs p-1 bg-primary/10 hover:bg-primary/20 rounded"
                    onClick={() => {
                      const agent = agents.find(a => a.id === activeAgent.id);
                      if (agent) handleEditAgent(agent);
                      setShowAgentModelPrefs(false);
                      setShowWidgetPreview(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 text-xs p-1 bg-destructive/10 hover:bg-destructive/20 rounded"
                    onClick={() => handleDeleteAgent(activeAgent.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            
            {/* Lead Widget Preview Button */}
            <button
              className="w-full mt-2 text-xs p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded flex items-center justify-center gap-2"
              onClick={() => {
                setShowWidgetPreview(!showWidgetPreview);
                setShowAgentForm(false);
                setShowAgentModelPrefs(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              {showWidgetPreview ? "Hide Widget Preview" : "Lead Generation Widget"}
            </button>

            {/* Lead Widget Preview */}
            {showWidgetPreview && (
              <div className="mt-3 border rounded-md p-3 bg-muted/30">
                <h4 className="text-sm font-medium mb-2">Widget Setup</h4>
                
                <div className="mb-2">
                  <label className="text-xs mb-1 block">Select Agent for Widget</label>
                  <select
                    className="w-full p-1.5 text-xs bg-background border rounded-md"
                    value={selectedAgentId || ''}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                  >
                    <option value="">Select an agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-xs bg-black/10 dark:bg-white/10 p-2 rounded mb-2 font-mono overflow-x-auto whitespace-nowrap">
                  {`<script src="${window.location.origin || 'https://your-domain.com'}/widget.js" data-agent-id="${selectedAgentId || 'YOUR-AGENT-ID'}"></script>`}
                </div>
                
                <button
                  className="w-full text-xs p-1.5 bg-primary text-primary-foreground rounded"
                  onClick={copyWidgetCode}
                >
                  Copy Embed Code
                </button>
                
                {/* Widget Visualization */}
                <div className="mt-3 relative h-40 bg-background border rounded overflow-hidden">
                  <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-20 right-3 w-64 bg-white dark:bg-gray-800 rounded-md shadow-xl p-3 transform scale-90 origin-bottom-right">
                    <div className="text-sm font-medium mb-2">Chat with us</div>
                    <div className="h-20 w-full bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
                    <button className="w-full py-1 bg-primary text-white rounded text-xs">Submit</button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Model preferences button */}
            {!showWidgetPreview && (
              <div className="mt-2">
                <button
                  className="w-full text-xs p-1 bg-secondary/80 hover:bg-secondary rounded"
                  onClick={() => {
                    setShowAgentModelPrefs(!showAgentModelPrefs);
                    setShowAgentForm(false);
                  }}
                >
                  {showAgentModelPrefs ? "Hide Model Settings" : "Model Settings"}
                </button>
              </div>
            )}

            {showAgentForm && (
              <form onSubmit={handleAddAgent} className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Agent name"
                  className="w-full p-2 text-sm bg-background border rounded-md"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
                <textarea
                  placeholder="System prompt"
                  className="w-full p-2 text-sm bg-background border rounded-md min-h-[100px]"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-primary text-primary-foreground text-sm rounded-md"
                >
                  {editingAgent ? "Update Agent" : "Create Agent"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Show model settings only when agent model prefs are active */}
        {!isCollapsed && showAgentModelPrefs && (
          <div className="bg-muted/60 p-3 rounded-lg mb-4 border">
            <div className="text-sm font-medium mb-1">{activeAgent.name} Model Settings</div>
            <p className="text-xs text-muted-foreground mb-2">
              Set preferred models for this agent
            </p>
            
            <div className="mb-3">
              <label className="text-xs font-medium">Text Model</label>
              <select
                className="w-full p-2 text-sm bg-background border rounded-md"
                value={activeTextModel}
                onChange={(e) => setActiveTextModel(e.target.value)}
              >
                {AVAILABLE_MODELS.text.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="text-xs font-medium">Image Model</label>
              <select
                className="w-full p-2 text-sm bg-background border rounded-md"
                value={activeImageModel}
                onChange={(e) => setActiveImageModel(e.target.value)}
              >
                {AVAILABLE_MODELS.image.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="text-xs font-medium">Voice</label>
              <select
                className="w-full p-2 text-sm bg-background border rounded-md"
                value={activeVoice}
                onChange={(e) => setActiveVoice(e.target.value)}
              >
                {AVAILABLE_MODELS.voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              className="w-full p-2 bg-primary text-primary-foreground text-sm rounded-md"
              onClick={handleSaveModelPreferences}
            >
              Save Model Preferences
            </button>
          </div>
        )}
        
        {/* Only show these when not in agent model prefs mode */}
        {!isCollapsed && !showAgentModelPrefs && !showAgentForm && !showWidgetPreview && (
          <>
            {/* Text Model Selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Text Model</h3>
              <select
                className="w-full p-2 bg-background border rounded-md"
                value={activeTextModel}
                onChange={(e) => setActiveTextModel(e.target.value)}
              >
                {AVAILABLE_MODELS.text.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} {agentPrefs.textModel === model.id ? '(Agent Default)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Model Selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Image Model</h3>
              <select
                className="w-full p-2 bg-background border rounded-md"
                value={activeImageModel}
                onChange={(e) => setActiveImageModel(e.target.value)}
              >
                {AVAILABLE_MODELS.image.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} {agentPrefs.imageModel === model.id ? '(Agent Default)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Voice</h3>
              <select
                className="w-full p-2 bg-background border rounded-md"
                value={activeVoice}
                onChange={(e) => setActiveVoice(e.target.value)}
              >
                {AVAILABLE_MODELS.voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} {agentPrefs.voiceModel === voice.id ? '(Agent Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <button 
            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
                {!isCollapsed && <span>Light Mode</span>}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                {!isCollapsed && <span>Dark Mode</span>}
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}