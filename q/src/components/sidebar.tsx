"use client"

import { useState, useEffect, useRef } from "react"
import { useSettingsStore, Agent, defaultAgents } from "@/store/settingsStore"
import { useChatStore, ChatSession } from "@/store/chatStore"
import { toasts } from '@/components/ui/toast-wrapper'
import { usePathname, useRouter } from 'next/navigation'
import { Home, MessageSquare, ChevronDown, ChevronRight, Folder, Users, Bot, Wrench, Presentation, Palette, LayoutPanelLeft, Trash2, Pencil, Check, X, FileText, Search, BookOpen, ChevronLeft, Plus, Sun, Moon } from "lucide-react"
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
  category?: string;
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

  // Simplified navigation items with more focused categories
  const navItems: NavItem[] = [
    // Core Tools - Most important, keep these at the top
    {
      name: "Chat",
      path: "/chat",
      icon: MessageSquare,
      category: "core"
    },
    {
      name: "IntelliSearch",
      path: "/search",
      icon: Search,
      category: "core"
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
      category: "core"
    },
    
    // Projects & Work
    {
      name: "Projects",
      path: "/projects",
      icon: Folder,
      category: "projects"
    },
    {
      name: "Leads",
      path: "/leads",
      icon: Users,
      category: "projects"
    },
    
    // Creation Tools - Merge these into a single category
    {
      name: "Creation Tools",
      path: "/creation",
      icon: Palette,
      category: "creation",
      submenu: [
        {
          name: "Presentations",
          path: "/tools/presentation-generator"
        },
        {
          name: "Website Builder",
          path: "/website-builder"
        },
        {
          name: "Blog Posts",
          path: "/dashboard/blog-posts"
        }
      ]
    }
  ]

  // Group navigation items by category for better organization
  const groupedNavItems: Record<string, NavItem[]> = navItems.reduce((acc, item) => {
    const category = item.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, NavItem[]>)

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

  const handleEditTitle = (chat: ChatSession) => {
    setIsEditingTitle(chat.id);
    setEditedTitle(chat.name || 'New Chat');
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="h-full flex flex-col overflow-hidden bg-zinc-900 border-r border-zinc-700/50">
        {/* Sidebar Header */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-800">
          {isExpanded && (
            <div className="text-lg font-semibold text-zinc-100">QanDu</div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-400 hover:text-zinc-300 focus:outline-none p-1 rounded-md"
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Chat Sessions Section */}
        <div className="flex-shrink-0 border-b border-zinc-800">
          <div 
            className="p-3 flex items-center justify-between cursor-pointer"
            onClick={() => setIsChatListExpanded(!isChatListExpanded)}
          >
            <div className="flex items-center">
              {isChatListExpanded ? (
                <ChevronDown className="h-4 w-4 text-zinc-400 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 text-zinc-400 mr-2" />
              )}
              {isExpanded && <span className="text-sm font-medium text-zinc-300">Recent Chats</span>}
            </div>
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNewChat()
                }}
                className="text-zinc-400 hover:text-zinc-300 p-1 rounded-md"
                title="New Chat"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          {(!isExpanded || isChatListExpanded) && (
            <div className={cn("overflow-hidden", !isExpanded && "flex flex-col items-center")}>
              {/* New Chat Button for collapsed view */}
              {!isExpanded && (
                <button
                  onClick={handleNewChat}
                  className="my-2 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  title="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
              
              <div className={cn("py-1", !isExpanded && "w-full flex flex-col items-center")}>
                {chatSessions
                  .slice(0, showAllChats ? undefined : 5)
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        "group relative",
                        !isExpanded && "w-full flex justify-center"
                      )}
                    >
                      <button
                        onClick={() => handleChatSelect(chat.id)}
                        className={cn(
                          "w-full flex items-center py-1.5 px-3 rounded-md overflow-hidden whitespace-nowrap",
                          chat.id === activeChatId
                            ? "bg-zinc-800 text-zinc-100"
                            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300",
                          !isExpanded && "justify-center px-1.5"
                        )}
                        title={chat.name || "Untitled Chat"}
                      >
                        <MessageSquare className={cn("h-4 w-4 flex-shrink-0", isExpanded && "mr-2")} />
                        {isExpanded && (
                          isEditingTitle === chat.id ? (
                            <input
                              ref={titleInputRef}
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              onBlur={() => handleRenameChatConfirm(chat.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleRenameChatConfirm(chat.id)
                                }
                              }}
                              className="w-full bg-zinc-700 text-zinc-100 rounded border-none py-0.5 px-1 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="text-sm truncate">
                              {chat.name || "Untitled Chat"}
                            </span>
                          )
                        )}
                      </button>

                      {/* Chat actions - Only show in expanded mode */}
                      {isExpanded && chat.id === activeChatId && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditTitle(chat)
                            }}
                            className="p-1 text-zinc-400 hover:text-zinc-300 rounded-md"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setConfirmingDeleteId(chat.id)
                            }}
                            className="p-1 text-zinc-400 hover:text-red-400 rounded-md"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {/* Delete confirmation - Only in expanded mode */}
                      {isExpanded && confirmingDeleteId === chat.id && (
                        <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md p-2 shadow-lg z-10 text-xs">
                          <p className="text-zinc-300 mb-2">Delete this chat?</p>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setConfirmingDeleteId(null)
                              }}
                              className="p-1 bg-zinc-700 hover:bg-zinc-600 rounded-md"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteChat(chat.id)
                                setConfirmingDeleteId(null)
                              }}
                              className="p-1 bg-red-600 hover:bg-red-700 rounded-md"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              
              {isExpanded && chatSessions.length > 5 && (
                <button
                  onClick={() => setShowAllChats(!showAllChats)}
                  className="w-full text-xs text-blue-400 hover:text-blue-300 py-1 px-3 text-left"
                >
                  {showAllChats ? "Show less" : `Show all (${chatSessions.length})`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {/* Core Tools at the top */}
          <div className={cn("mb-3", !isExpanded && "flex flex-col items-center")}>
            {groupedNavItems['core']?.map((item) => (
              <div 
                key={item.path}
                className={cn(!isExpanded && "flex justify-center w-full")}
              >
                <button
                  onClick={() => router.push(item.path)}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md w-full",
                    isActive(item.path)
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300",
                    !isExpanded && "justify-center px-1.5"
                  )}
                  title={item.name}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isExpanded && "mr-3")} />
                  {isExpanded && <span className="text-sm">{item.name}</span>}
                </button>
              </div>
            ))}
          </div>

          {/* Divider between sections */}
          <div className="mx-3 my-3 border-t border-zinc-800"></div>

          {/* Projects section */}
          {groupedNavItems['projects'] && (
            <div className={cn("mb-3", !isExpanded && "flex flex-col items-center")}>
              {isExpanded && (
                <div className="px-3 pb-1">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Projects
                  </span>
                </div>
              )}
              
              {groupedNavItems['projects'].map((item) => (
                <div 
                  key={item.path}
                  className={cn(!isExpanded && "flex justify-center w-full")}
                >
                  <button
                    onClick={() => router.push(item.path)}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-md w-full",
                      isActive(item.path)
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300",
                      !isExpanded && "justify-center px-1.5"
                    )}
                    title={item.name}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isExpanded && "mr-3")} />
                    {isExpanded && <span className="text-sm">{item.name}</span>}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Creation Tools section with submenu */}
          {groupedNavItems['creation'] && (
            <div className={cn("mb-3", !isExpanded && "flex flex-col items-center")}>
              {isExpanded && (
                <div className="px-3 pb-1">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Creation
                  </span>
                </div>
              )}
              
              {groupedNavItems['creation'].map((item) => (
                <div key={item.path} className={cn(!isExpanded && "w-full flex justify-center")}>
                  {item.submenu ? (
                    <div className="w-full">
                      <button
                        onClick={() => {
                          // Toggle submenu
                          const submenuId = `submenu-${item.name}`;
                          const currentState = localStorage.getItem(submenuId) === 'true';
                          localStorage.setItem(submenuId, (!currentState).toString());
                          // Trigger rerender
                          setMounted(prev => !prev);
                        }}
                        className={cn(
                          "flex items-center justify-between py-2 px-3 w-full rounded-md",
                          "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300",
                          !isExpanded && "justify-center px-1.5"
                        )}
                        title={item.name}
                      >
                        <div className="flex items-center">
                          <item.icon className={cn("h-5 w-5 flex-shrink-0", isExpanded && "mr-3")} />
                          {isExpanded && <span className="text-sm">{item.name}</span>}
                        </div>
                        {isExpanded && (
                          localStorage.getItem(`submenu-${item.name}`) === 'true' ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )
                        )}
                      </button>
                      
                      {isExpanded && localStorage.getItem(`submenu-${item.name}`) === 'true' && (
                        <div className="pl-9 pr-3 py-1 space-y-1">
                          {item.submenu.map((subitem) => (
                            <button
                              key={subitem.path}
                              onClick={() => router.push(subitem.path)}
                              className={cn(
                                "flex items-center py-1.5 px-2 rounded-md w-full text-sm",
                                isActive(subitem.path)
                                  ? "bg-zinc-800 text-zinc-100"
                                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                              )}
                            >
                              {subitem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => router.push(item.path)}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md w-full",
                        isActive(item.path)
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300",
                        !isExpanded && "justify-center px-1.5"
                      )}
                      title={item.name}
                    >
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", isExpanded && "mr-3")} />
                      {isExpanded && <span className="text-sm">{item.name}</span>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* User and Settings Section */}
        <div className="flex-shrink-0 border-t border-zinc-800">
          {/* Toggle Dark Mode Button */}
          <button
            onClick={toggleDarkMode}
            className={cn(
              "w-full flex items-center py-2 px-3 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300",
              !isExpanded && "justify-center"
            )}
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <>
                <Sun className={cn("h-5 w-5", isExpanded && "mr-3")} />
                {isExpanded && <span className="text-sm">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className={cn("h-5 w-5", isExpanded && "mr-3")} />
                {isExpanded && <span className="text-sm">Dark Mode</span>}
              </>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => router.push('/settings')}
            className={cn(
              "w-full flex items-center py-2 px-3 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300",
              !isExpanded && "justify-center"
            )}
            title="Settings"
          >
            <FiSettings className={cn("h-5 w-5", isExpanded && "mr-3")} />
            {isExpanded && <span className="text-sm">Settings</span>}
          </button>

          {/* User Profile/Logout */}
          <div 
            className={cn(
              "flex items-center px-3 py-3 mt-2 border-t border-zinc-800 text-zinc-300",
              !isExpanded && "justify-center"
            )}
          >
            <div 
              className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-100 font-medium text-sm"
            >
              {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            
            {isExpanded && (
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.email || 'User'}</div>
                <button
                  onClick={signOut}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center mt-1"
                >
                  <FiLogOut className="h-3 w-3 mr-1" />
                  Sign Out
                </button>
              </div>
            )}
            
            {!isExpanded && (
              <button
                onClick={signOut}
                className="text-red-400 hover:text-red-300 p-1 ml-1"
                title="Sign Out"
              >
                <FiLogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
} 