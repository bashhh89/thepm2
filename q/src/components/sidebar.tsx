"use client"

import { useState, useEffect, useRef } from "react"
import { useSettingsStore, Agent, defaultAgents } from "@/store/settingsStore"
import { useChatStore, ChatSession } from "@/store/chatStore"
import { toasts } from '@/components/ui/toast-wrapper'
import { usePathname, useRouter } from 'next/navigation'
import { Home, MessageSquare, ChevronDown, ChevronRight, Folder, Users, Bot, Wrench, Presentation, Palette, LayoutPanelLeft, Trash2, Pencil, Check, X, FileText, Search, BookOpen } from "lucide-react"
import type { LucideIcon } from 'lucide-react'
import React from 'react'
import { useAuth } from "@/context/AuthContext"
import { useSidebarStore } from "@/store/sidebarStore"
import { FiSettings, FiShield, FiLogOut } from 'react-icons/fi'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { IntelliSearchButton } from './search/IntelliSearchButton'

interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user';
}

interface SidebarProps {
  user: User | null;
  isExpanded: boolean;
  onToggle: () => void;
}

// Define static model options to avoid dependency on AVAILABLE_MODELS
const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' }
]

const TEXT_MODEL_OPTIONS = [
  { id: 'openai', name: 'OpenAI GPT-4' },
  { id: 'google-gemini-pro', name: 'Google Gemini Pro' },
  { id: 'gemini-1.5-flash-001', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro' }
]

const IMAGE_MODEL_OPTIONS = [
  { id: 'flux', name: 'Flux' },
  { id: 'sdxl', name: 'Stable Diffusion XL' }
]

interface SubMenuItem {
  name: string;
  path: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  submenu?: SubMenuItem[];
}

export default function Sidebar() {
  const { isExpanded, setIsExpanded } = useSidebarStore()
  const [mounted, setMounted] = useState(false)
  const [showAgentForm, setShowAgentForm] = useState(false)
  const [showAgentModelPrefs, setShowAgentModelPrefs] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [showWidgetPreview, setShowWidgetPreview] = useState(false)
  const [agentName, setAgentName] = useState("")
  const [agentPrompt, setAgentPrompt] = useState("")
  const [showAllChats, setShowAllChats] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [isChatListExpanded, setIsChatListExpanded] = useState(true)

  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { darkMode, setDarkMode } = useSettingsStore()

  // Combined store hooks
  const {
    activeTextModel,
    setActiveTextModel,
    activeImageModel,
    setActiveImageModel,
    activeVoice,
    setActiveVoice,
    activeAgent,
    agents,
    addAgent,
    updateAgent,
    deleteAgent,
    setAgentModelPreference,
    selectedAgentId,
    setSelectedAgentId
  } = useSettingsStore()

  // Subscribe to chat store with specific selectors
  const chatSessions = useChatStore(state => state.chatSessions)
  const activeChatId = useChatStore(state => state.activeChatId)
  const createChat = useChatStore(state => state.createChat)
  const deleteChat = useChatStore(state => state.deleteChat)
  const setActiveChat = useChatStore(state => state.setActiveChat)
  const renameChat = useChatStore(state => state.renameChat)

  // Handle mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize with a default chat if none exists
  useEffect(() => {
    if (mounted && (!chatSessions || chatSessions.length === 0)) {
      console.log('Creating initial chat...');
      createChat()
    }
  }, [mounted, chatSessions, createChat])

  // Debug logging
  useEffect(() => {
    console.log('Current chat sessions:', chatSessions);
    console.log('Active chat ID:', activeChatId);
  }, [chatSessions, activeChatId])

  // Handle dark mode
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [darkMode, mounted])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select(); // Select text for easy replacement
    }
  }, [isEditingTitle]);

  // Early return if not mounted or no user
  if (!mounted || !user) {
    return (
      <aside className="fixed inset-y-0 left-0 z-50 w-16 overflow-hidden">
        <div className="h-full bg-zinc-900 border-r border-zinc-700/50" />
      </aside>
    )
  }

  const isActive = (path: string) => pathname === path

  const navItems: NavItem[] = [
    // Main Features
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Chat",
      path: "/chat",
      icon: MessageSquare,
    },
    {
      name: "IntelliSearch",
      path: "/search",
      icon: Search,
    },
    {
      name: "Advanced Research",
      path: "/advanced-search",
      icon: BookOpen,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: Folder,
    },
    {
      name: "Products",
      path: "/products",
      icon: Wrench,
    },
    {
      name: "Presentations",
      path: "/tools/presentation-generator",
      icon: Presentation,
      submenu: [
        {
          name: "New Presentation",
          path: "/tools/presentation-generator"
        },
        {
          name: "My Presentations",
          path: "/my-presentations"
        }
      ]
    },
    {
      name: "Proposals",
      path: "/proposals",
      icon: FileText,
    },
    {
      name: "Website Builder",
      path: "/website-builder",
      icon: LayoutPanelLeft,
    },

    // Content & Marketing
    {
      name: "Blog",
      path: "/dashboard/blog-posts",
      icon: Folder,
    },
    {
      name: "Company",
      path: "/company",
      icon: Palette,
    },
    {
      name: "Leads",
      path: "/leads",
      icon: Users,
    },
  ]

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

  // Handle chat rename logic
  const handleRenameChatConfirm = (chatId: string) => {
    const trimmedTitle = editedTitle.trim();
    if (trimmedTitle && chatId === isEditingTitle) {
      renameChat(chatId, trimmedTitle);
    }
    setIsEditingTitle(null); // Exit editing mode regardless of save
    setEditedTitle(''); // Reset edited title
  };

  // Create a new chat
  const handleNewChat = () => {
    try {
      const newChatId = createChat();
      setActiveChat(newChatId);
      router.push('/chat');
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  }

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (agentName.trim() === "" || agentPrompt.trim() === "") {
      toasts.error("Please enter both a name and a system prompt for the new agent.");
      return
    }
    
    if (editingAgent) {
      // Update existing agent
      updateAgent(editingAgent.id, {
        name: agentName,
        systemPrompt: agentPrompt
      })
      
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
      }
      
      addAgent(newAgent)
      
      toasts.success(`${agentName} is now ready to use.`);
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
      toasts.error("Default agents cannot be deleted.");
      return
    }
    
    deleteAgent(agentId)
    
    toasts.success("The agent has been removed.");
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
      
      toasts.success(`Model preferences for ${activeAgent.name} have been updated.`);
      
      setShowAgentModelPrefs(false);
    }
  }

  // Copy widget embed code to clipboard
  const copyWidgetCode = () => {
    if (!selectedAgentId) {
      toasts.error("Please select an agent for the widget first.");
      return;
    }

    const embedCode = `<script src="${window.location.origin}/widget.js" data-agent-id="${selectedAgentId}"></script>`;
    navigator.clipboard.writeText(embedCode);
    
    toasts.success("Widget embed code has been copied to your clipboard.");
  }

  // Handle chat selection
  const handleChatSelect = (chatId: string) => {
    try {
      setActiveChat(chatId);
      router.push('/chat');
      setConfirmingDeleteId(null);
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex flex-col h-full">
      <div 
        className={`h-full bg-zinc-900 border-r border-zinc-700/50 transition-all duration-200 ease-in-out overflow-hidden flex flex-col ${
          isExpanded ? 'w-56' : 'w-16'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute right-0 top-4 z-50 bg-zinc-800 border border-zinc-700 rounded-full p-1 hover:bg-zinc-700 transform translate-x-1/2 text-zinc-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-3 h-3 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Logo / Branding */}
          <div className={`px-3 flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            {isExpanded ? (
              <h1 className="text-xl font-semibold text-white">QanDu AI</h1>
            ) : (
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                Q
              </div>
            )}
          </div>
          
          {/* New Chat Button */}
          <div className="px-3">
            <button
              onClick={handleNewChat}
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center transition-all p-2 ${
                isExpanded ? 'w-full justify-center space-x-2' : 'w-full justify-center'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              {isExpanded && <span>New Chat</span>}
            </button>
          </div>

          {/* Chat History */}
          <div className="px-2">
            <div className="flex items-center justify-between px-2 mb-2 text-xs text-zinc-400 uppercase tracking-wide">
              <button
                onClick={() => setIsChatListExpanded(!isChatListExpanded)}
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                {isChatListExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <span>{isExpanded ? 'Recent Chats' : ''}</span>
              </button>
              
              {isExpanded && (
                <button
                  onClick={() => setShowAllChats(!showAllChats)}
                  className="text-xs hover:text-white transition-colors"
                >
                  {showAllChats ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>
            
            {isChatListExpanded && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {(showAllChats ? chatSessions : chatSessions?.slice(0, 5))?.map((chat) => (
                  <div key={chat.id} className="flex items-center group">
                    <button
                      onClick={() => handleChatSelect(chat.id)}
                      className={`flex-1 text-left px-2 py-1.5 rounded-md ${
                        isExpanded ? 'text-sm' : 'justify-center'
                      } ${
                        chat.id === activeChatId
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <MessageSquare className={`h-4 w-4 flex-shrink-0 ${!isExpanded ? 'mx-auto' : 'mr-2'}`} />
                        
                        {isExpanded && (
                          isEditingTitle === chat.id ? (
                            <input
                              ref={titleInputRef}
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleRenameChatConfirm(chat.id);
                                } else if (e.key === 'Escape') {
                                  setIsEditingTitle(null);
                                  setEditedTitle('');
                                }
                              }}
                              onBlur={() => handleRenameChatConfirm(chat.id)}
                              className="bg-zinc-700 text-white px-1 rounded w-full"
                              autoFocus
                            />
                          ) : (
                            <span className="truncate w-32">
                              {chat.title || 'New Chat'}
                            </span>
                          )
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && chat.id === activeChatId && !isEditingTitle && (
                      <div className="flex space-x-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setIsEditingTitle(chat.id);
                            setEditedTitle(chat.title || 'New Chat');
                          }}
                          className="p-0.5 text-zinc-400 hover:text-white rounded-sm"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        
                        {confirmingDeleteId === chat.id ? (
                          <>
                            <button
                              onClick={() => {
                                deleteChat(chat.id);
                                setConfirmingDeleteId(null);
                              }}
                              className="p-0.5 text-red-400 hover:text-red-300 rounded-sm"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setConfirmingDeleteId(null)}
                              className="p-0.5 text-zinc-400 hover:text-white rounded-sm"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmingDeleteId(chat.id)}
                            className="p-0.5 text-zinc-400 hover:text-red-400 rounded-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <div className="px-2 space-y-1">
            <div className="flex items-center px-2 mb-1 text-xs text-zinc-400 uppercase tracking-wide">
              {isExpanded && <span>Navigation</span>}
            </div>

            {navItems.map((item) => (
              <div key={item.path}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center ${
                    isExpanded ? 'justify-between' : 'justify-center'
                  } px-2 py-1.5 rounded-md ${
                    isActive(item.path)
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className={`h-4 w-4 ${!isExpanded ? '' : 'mr-3'}`} />
                    {isExpanded && <span>{item.name}</span>}
                  </div>
                  {isExpanded && item.submenu && (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {/* Submenu */}
                {isExpanded && item.submenu && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.path}
                        onClick={() => router.push(subitem.path)}
                        className={`w-full text-left px-2 py-1 text-sm rounded-md ${
                          isActive(subitem.path)
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                      >
                        {subitem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Agents Section */}
          <div className="px-2">
            <div className="flex items-center justify-between px-2 mb-2 text-xs text-zinc-400 uppercase tracking-wide">
              {isExpanded && <span>Assistants</span>}
              {isExpanded && (
                <button
                  onClick={() => {
                    setAgentName("");
                    setAgentPrompt("");
                    setEditingAgent(null);
                    setShowAgentForm(true);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + New
                </button>
              )}
            </div>

            <div className="space-y-1">
              {agents.map((agent) => (
                <div key={agent.id} className="flex group items-center">
                  <button
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`flex-1 flex items-center ${
                      isExpanded ? 'justify-between' : 'justify-center'
                    } px-2 py-1.5 rounded-md ${
                      agent.id === selectedAgentId
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Bot className={`h-4 w-4 ${!isExpanded ? '' : 'mr-3'}`} />
                      {isExpanded && <span>{agent.name}</span>}
                    </div>
                  </button>
                  
                  {isExpanded && agent.id === selectedAgentId && (
                    <div className="flex space-x-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!defaultAgents.find(a => a.id === agent.id) && (
                        <>
                          <button
                            onClick={() => handleEditAgent(agent)}
                            className="p-0.5 text-zinc-400 hover:text-white rounded-sm"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="p-0.5 text-zinc-400 hover:text-red-400 rounded-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => setShowAgentModelPrefs(true)}
                        className="p-0.5 text-zinc-400 hover:text-white rounded-sm"
                      >
                        <Wrench className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings & Account */}
        <div className="px-2 py-2 space-y-1">
          <IntelliSearchButton 
            variant="ghost" 
            className={`w-full justify-start ${isExpanded ? '' : 'justify-center'}`}
          />
          
          <button
            onClick={() => router.push('/settings')}
            className={`w-full flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'} px-3 py-1.5 text-sm rounded-md text-zinc-300 hover:bg-zinc-800`}
          >
            <FiSettings className="h-4 w-4 flex-shrink-0" />
            {isExpanded && <span>Settings</span>}
          </button>
          
          {user && 'role' in user && user.role === 'admin' && (
            <button
              onClick={() => router.push('/admin')}
              className={`w-full flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'} px-3 py-1.5 text-sm rounded-md text-zinc-300 hover:bg-zinc-800`}
            >
              <FiShield className="h-4 w-4 flex-shrink-0" />
              {isExpanded && <span>Admin</span>}
            </button>
          )}

          <button
            onClick={() => router.push('/account')}
            className={`w-full flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'} px-3 py-1.5 text-sm rounded-md text-zinc-300 hover:bg-zinc-800`}
          >
            <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            {isExpanded && <span>Account</span>}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={`bg-zinc-900 border-r border-t border-zinc-700/50 py-2 transition-all duration-200 ease-in-out ${isExpanded ? 'w-56' : 'w-16'}`}>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            <FiLogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {!isExpanded && (
        <div className={`bg-zinc-900 border-r border-t border-zinc-700/50 py-2 transition-all duration-200 ease-in-out ${isExpanded ? 'w-56' : 'w-16'}`}>
          <button 
            onClick={() => signOut()}
            className="flex items-center justify-center w-full px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            <FiLogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
} 