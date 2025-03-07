import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import { Button } from '../components/Button';
import { ChatMessages } from '../components/ChatMessages';
import { ChatInput } from '../components/ChatInput';
import { Card } from '../components/Card';
import { AVAILABLE_MODELS } from '../utils/puter-ai';
import { Folder, Settings, Plus, Edit2, Trash2, Save, Menu, X, ChevronRight, ChevronDown, ChevronLeft, Bot, Pencil, Upload, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/Dialog';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { toast } from 'sonner';
import type { StreamResponseChunk } from '../types/puter';

interface ChatFolder {
  id: string;
  name: string;
  chats: Chat[];
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  systemPrompt?: string;
  model?: string;
  createdAt: Date;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachment?: {
    url: string;
    type: string;
    name: string;
  };
}

interface Agent {
  id: string;
  name: string;
  prompt: string;
  description: string;
  createdAt: Date;
}

interface SuggestedResponse {
  text: string;
  action: () => void;
}

interface StreamResponseChunk {
  text?: string;
  done?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Move suggested responses outside component to prevent re-renders
const DEFAULT_SUGGESTED_RESPONSES: SuggestedResponse[] = [
  {
    text: "Tell me more about that",
    action: () => {} // Will be updated in component
  },
  {
    text: "Can you explain differently?",
    action: () => {} // Will be updated in component
  },
  {
    text: "What are the next steps?",
    action: () => {} // Will be updated in component
  }
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [folders, setFolders] = useState<ChatFolder[]>(() => {
    const saved = localStorage.getItem('chat-folders');
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'General', chats: [] }];
  });
  const [currentFolder, setCurrentFolder] = useState<string>('default');
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS.DEFAULT);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isEditingFolder, setIsEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isChatTitleEditing, setIsChatTitleEditing] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tempSystemPrompt, setTempSystemPrompt] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['default']));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('chat-agents');
    return saved ? JSON.parse(saved) : [
      {
        id: 'default',
        name: 'Default Assistant',
        prompt: 'You are a helpful AI assistant.',
        description: 'General-purpose AI assistant',
        createdAt: new Date()
      }
    ];
  });
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    prompt: '',
    description: ''
  });
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [fileUploadState, setFileUploadState] = useState<{
    isUploading: boolean;
    fileName: string | null;
    progress: number;
  }>({
    isUploading: false,
    fileName: null,
    progress: 0
  });

  const navigate = useNavigate();

  // Load messages from current chat if it exists
  useEffect(() => {
    if (currentChat) {
      const folder = folders.find(f => f.chats.some(c => c.id === currentChat));
      const chat = folder?.chats.find(c => c.id === currentChat);
      if (chat) {
        setMessages(chat.messages);
      }
    }
  }, [currentChat, folders]);

  // Save messages to current chat
  useEffect(() => {
    if (currentChat && messages.length > 0) {
      setFolders(folders.map(f => ({
        ...f,
        chats: f.chats.map(c => 
          c.id === currentChat 
            ? { ...c, messages }
            : c
        )
      })));
    }
  }, [messages]);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chat-folders', JSON.stringify(folders));
  }, [folders]);

  // Save agents to localStorage
  useEffect(() => {
    localStorage.setItem('chat-agents', JSON.stringify(agents));
  }, [agents]);

  // Handle folder operations
  const createFolder = () => {
    const newFolder: ChatFolder = {
      id: crypto.randomUUID(),
      name: 'New Folder',
      chats: []
    };
    setFolders([...folders, newFolder]);
    setIsEditingFolder(newFolder.id);
  };

  const updateFolderName = (folderId: string, newName: string) => {
    setFolders(folders.map(f => 
      f.id === folderId ? { ...f, name: newName } : f
    ));
    setIsEditingFolder(null);
  };

  const deleteFolder = (folderId: string) => {
    if (folderId === 'default') return; // Prevent deleting default folder
    setFolders(folders.filter(f => f.id !== folderId));
    if (currentFolder === folderId) {
      setCurrentFolder('default');
      setCurrentChat(null);
    }
  };

  // Handle chat operations
  const createNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      systemPrompt: '',
      model: selectedModel,
      createdAt: new Date()
    };
    
    setFolders(folders.map(f => 
      f.id === currentFolder 
        ? { ...f, chats: [newChat, ...f.chats] }
        : f
    ));
    setCurrentChat(newChat.id);
    setMessages([]);
    setIsChatTitleEditing(true);
    setNewChatTitle('New Chat');
  };

  const updateChatTitle = () => {
    setFolders(folders.map(f => ({
      ...f,
      chats: f.chats.map(c => 
        c.id === currentChat 
          ? { ...c, title: newChatTitle }
          : c
      )
    })));
    setIsChatTitleEditing(false);
  };

  const deleteChat = (chatId: string) => {
    setFolders(folders.map(f => ({
      ...f,
      chats: f.chats.filter(c => c.id !== chatId)
    })));
    if (currentChat === chatId) {
      setCurrentChat(null);
      setMessages([]);
    }
  };

  const handleSendMessage = async (content: string, attachment?: { url: string; type: string; name: string }) => {
    if ((!content.trim() && !attachment) || isStreaming) return;

    // Create new chat if none selected
    if (!currentChat) {
      createNewChat();
    }

    const newMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
      attachment
    };

    setMessages(prev => [...prev, newMessage]);
    setIsStreaming(true);

    try {
      let systemContext = systemPrompt;
      
      // If there's an attachment, add context about it
      if (attachment) {
        systemContext += `\n\nThe user has uploaded a file named "${attachment.name}" of type "${attachment.type}". The file is available at ${attachment.url}. Please analyze its contents when generating your response.`;
      }

      const messagesToSend: ChatMessage[] = [
        ...(systemContext ? [{ role: 'system', content: systemContext }] : []),
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content }
      ];

      const response = await window.puter.ai.chat(messagesToSend);
      
      if (typeof response === 'string') {
        // Handle non-streaming response
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

      // Save chat history
      setFolders(folders.map(f => ({
        ...f,
        chats: f.chats.map(c => 
          c.id === currentChat 
            ? { 
                ...c, 
                messages: [
                  ...messages, 
                  newMessage, 
                  { role: 'assistant', content: response as string, timestamp: new Date() }
                ] 
              }
            : c
        )
      })));

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };
  

  const handleSystemPromptSave = () => {
    setSystemPrompt(tempSystemPrompt);
    setIsSystemPromptOpen(false);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const createAgent = () => {
    const agent: Agent = {
      id: crypto.randomUUID(),
      name: newAgent.name,
      prompt: newAgent.prompt,
      description: newAgent.description,
      createdAt: new Date()
    };
    setAgents([...agents, agent]);
    setIsAgentDialogOpen(false);
    setNewAgent({ name: '', prompt: '', description: '' });
  };

  const updateAgent = (agentId: string, updates: Partial<Agent>) => {
    setAgents(agents.map(a => 
      a.id === agentId ? { ...a, ...updates } : a
    ));
  };

  const deleteAgent = (agentId: string) => {
    if (agentId === 'default') return;
    setAgents(agents.filter(a => a.id !== agentId));
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null);
      setSystemPrompt('');
    }
  };

  const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>(() => 
    DEFAULT_SUGGESTED_RESPONSES.map(suggestion => ({
      ...suggestion,
      action: () => handleSendMessage(suggestion.text)
    }))
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b py-4 sticky top-0 z-50">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-2xl font-bold">QanDu Chat</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="chat-file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // Validate file size (5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error('File size must be less than 5MB');
                      return;
                    }

                    // Prepare upload
                    setFileUploadState({
                      isUploading: true,
                      fileName: file.name,
                      progress: 0
                    });

                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                      const xhr = new XMLHttpRequest();
                      xhr.open('POST', '/api/upload', true);

                      // Track upload progress
                      xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                          const progress = Math.round((event.loaded / event.total) * 100);
                          setFileUploadState(prev => ({
                            ...prev,
                            progress
                          }));
                        }
                      };

                      // Handle response
                      xhr.onload = () => {
                        if (xhr.status === 200) {
                          const response = JSON.parse(xhr.responseText);
                          toast.success('File uploaded successfully!');
                          
                          // Send message with attachment if we're in a chat
                          if (currentChat) {
                            handleSendMessage(`Attached file: ${file.name}`, {
                              url: response.fileUrl,
                              type: file.type,
                              name: file.name
                            });
                          }
                        } else {
                          throw new Error('Upload failed');
                        }
                      };

                      xhr.onerror = () => {
                        throw new Error('Upload failed');
                      };

                      xhr.onloadend = () => {
                        setFileUploadState({
                          isUploading: false,
                          fileName: null,
                          progress: 0
                        });
                        e.target.value = '';
                      };

                      xhr.send(formData);

                    } catch (error) {
                      console.error('Upload error:', error);
                      toast.error('Failed to upload file. Please try again.');
                      setFileUploadState({
                        isUploading: false,
                        fileName: null,
                        progress: 0
                      });
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('chat-file-upload')?.click()}
                  disabled={fileUploadState.isUploading}
                  className="relative"
                >
                  {fileUploadState.isUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="whitespace-nowrap">
                        Uploading... {fileUploadState.progress}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload File</span>
                    </div>
                  )}
                </Button>

                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div
              className={cn(
                "lg:static fixed inset-y-0 left-0 z-40",
                "transform transition-all duration-300 ease-in-out",
                "bg-card border-r lg:border-none lg:bg-transparent",
                "lg:block",
                isSidebarCollapsed ? "lg:col-span-1 w-16" : "lg:col-span-3 w-72",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  {!isSidebarCollapsed && <span className="font-semibold">Chat</span>}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex w-8 h-8 p-0"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  >
                    {isSidebarCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {/* New Chat Button */}
                    <Button className="w-full" onClick={createNewChat}>
                      <Plus className="w-4 h-4 mr-2" />
                      {!isSidebarCollapsed && "New Chat"}
                    </Button>

                    {/* Chat Folders */}
                    <div className="space-y-2">
                      {!isSidebarCollapsed && (
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                          Chat Folders
                        </div>
                      )}
                      <div className="space-y-1">
                        {folders.map(folder => (
                          <div key={folder.id} className="space-y-1">
                            <div 
                              className={cn(
                                "group flex items-center justify-between p-2 rounded-md cursor-pointer",
                                "hover:bg-muted/50 transition-colors duration-200",
                                expandedFolders.has(folder.id) && "bg-muted/30"
                              )}
                              onClick={() => toggleFolder(folder.id)}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex items-center text-muted-foreground">
                                  {expandedFolders.has(folder.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  <Folder className="h-4 w-4 ml-1" />
                                </div>
                                {isEditingFolder === folder.id ? (
                                  <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    onBlur={() => updateFolderName(folder.id, newFolderName)}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  <span className="text-sm font-medium">{folder.name}</span>
                                )}
                              </div>
                              {folder.id !== 'default' && (
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsEditingFolder(folder.id);
                                      setNewFolderName(folder.name);
                                    }}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteFolder(folder.id);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            {expandedFolders.has(folder.id) && folder.chats.length > 0 && (
                              <div className="ml-9 space-y-1 pt-1">
                                {folder.chats.map(chat => (
                                  <div
                                    key={chat.id}
                                    className={cn(
                                      "group flex items-center justify-between py-1.5 px-2 rounded-md text-sm",
                                      "hover:bg-muted/50 cursor-pointer transition-colors duration-200",
                                      currentChat === chat.id && "bg-muted text-primary"
                                    )}
                                    onClick={() => {
                                      setCurrentChat(chat.id);
                                      setMessages(chat.messages);
                                      setSystemPrompt(chat.systemPrompt || '');
                                      setSelectedModel(chat.model || AVAILABLE_MODELS.DEFAULT);
                                      if (window.innerWidth < 1024) {
                                        setIsSidebarOpen(false);
                                      }
                                    }}
                                  >
                                    <span className="truncate flex-1">{chat.title}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={createFolder}>
                          <Plus className="w-3 h-3 mr-2" />
                          New Folder
                        </Button>
                      </div>
                    </div>

                    <div className="h-px bg-border my-4" />

                    {/* Agents Section */}
                    <div className="space-y-2">
                      {!isSidebarCollapsed && (
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 flex items-center justify-between">
                          <span>Agents</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setSelectedAgent(null);
                              setNewAgent({ name: '', prompt: '', description: '' });
                              setIsAgentDialogOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="space-y-1">
                        {agents.map((agent) => (
                          <div
                            key={agent.id}
                            className={cn(
                              "group flex items-center justify-between",
                              "px-2 py-1.5 rounded-md text-sm",
                              "hover:bg-muted/50 cursor-pointer transition-colors",
                              selectedAgent?.id === agent.id && "bg-muted"
                            )}
                            onClick={() => {
                              setSelectedAgent(agent);
                              setSystemPrompt(agent.prompt);
                            }}
                          >
                            {isSidebarCollapsed ? (
                              <Bot className="h-4 w-4" />
                            ) : (
                              <>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <Bot className="h-4 w-4 shrink-0" />
                                  <span className="truncate">{agent.name}</span>
                                </div>
                                {agent.id !== 'default' && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAgent(agent);
                                        setNewAgent({
                                          name: agent.name,
                                          prompt: agent.prompt,
                                          description: agent.description
                                        });
                                        setIsAgentDialogOpen(true);
                                      }}
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:text-destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteAgent(agent.id);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Settings Section (if needed) */}
                    {!isSidebarCollapsed && (
                      <>
                        <div className="h-px bg-border my-4" />
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                            Settings
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setTempSystemPrompt(systemPrompt);
                              setIsSystemPromptOpen(true);
                            }}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            System Prompt
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div
              className={cn(
                "col-span-12",
                isSidebarCollapsed ? "lg:col-span-11" : "lg:col-span-9",
                "transition-all duration-300"
              )}
            >
              <Card className="h-[75vh] flex flex-col bg-card">
                <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {isChatTitleEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newChatTitle}
                          onChange={(e) => setNewChatTitle(e.target.value)}
                          className="px-2 py-1 border rounded bg-background"
                          autoFocus
                        />
                        <Button size="sm" onClick={updateChatTitle}>
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">
                          {currentChat 
                            ? folders.find(f => f.chats.some(c => c.id === currentChat))
                                ?.chats.find(c => c.id === currentChat)?.title 
                            : 'New Chat'
                          }
                        </h2>
                        {currentChat && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const chat = folders.find(f => f.chats.some(c => c.id === currentChat))
                                ?.chats.find(c => c.id === currentChat);
                              if (chat) {
                                setNewChatTitle(chat.title);
                                setIsChatTitleEditing(true);
                              }
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className={cn(
                        "px-2 py-1 rounded text-sm",
                        "border bg-background text-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-ring"
                      )}
                    >
                      {Object.entries(AVAILABLE_MODELS).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTempSystemPrompt(systemPrompt);
                        setIsSystemPromptOpen(true);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      System Prompt
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <ChatMessages messages={messages} isTyping={isStreaming} />
                </div>

                <div className="p-4 border-t">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {suggestedResponses.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => suggestion.action()}
                        className="text-sm"
                      >
                        {suggestion.text}
                      </Button>
                    ))}
                  </div>
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isDisabled={isStreaming}
                    placeholder="Type your message..."
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Agent Dialog */}
        <Dialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedAgent ? 'Edit Agent' : 'Create New Agent'}
              </DialogTitle>
              <DialogDescription>
                Configure an AI agent with a specific role and behavior.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="agentName">Name</Label>
                <input
                  id="agentName"
                  className="w-full p-2 rounded-md border"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="e.g., Marketing Assistant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentDescription">Description</Label>
                <input
                  id="agentDescription"
                  className="w-full p-2 rounded-md border"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  placeholder="Brief description of the agent's purpose"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentPrompt">System Prompt</Label>
                <Textarea
                  id="agentPrompt"
                  value={newAgent.prompt}
                  onChange={(e) => setNewAgent({ ...newAgent, prompt: e.target.value })}
                  placeholder="Define the agent's behavior and expertise..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAgentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (selectedAgent) {
                  updateAgent(selectedAgent.id, newAgent);
                } else {
                  createAgent();
                }
                setIsAgentDialogOpen(false);
              }}>
                {selectedAgent ? 'Save Changes' : 'Create Agent'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* System Prompt Dialog */}
        <Dialog open={isSystemPromptOpen} onOpenChange={setIsSystemPromptOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>System Prompt</DialogTitle>
              <DialogDescription>
                Define the AI assistant's behavior and context. This prompt will be included at the start of every conversation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="systemPrompt">Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="You are a helpful AI assistant..."
                  value={tempSystemPrompt}
                  onChange={(e) => setTempSystemPrompt(e.target.value)}
                  className="min-h-[200px] bg-background resize-none"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Tips:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Be specific about the assistant's role and expertise</li>
                  <li>Define any constraints or preferences</li>
                  <li>Include relevant context or background information</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSystemPromptOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSystemPromptSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
