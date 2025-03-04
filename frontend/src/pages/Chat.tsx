import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import { useAuthStore } from '../utils/auth-store';
import { Button } from '../components/Button';
import { ChatMessages } from '../components/ChatMessages';
import { ChatInput } from '../components/ChatInput';
import { Card } from '../components/Card';
import { AVAILABLE_MODELS } from '../utils/puter-ai';
import { Folder, Settings, Plus, Edit2, Trash2, Save } from 'lucide-react';

interface ChatFolder {
  id: string;
  name: string;
  chats: Chat[];
}

interface Chat {
  id: string;
  title: string;
  messages: Array<{ role: string; content: string; timestamp: Date }>;
  systemPrompt?: string;
  model?: string;
  createdAt: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Array<{role: string; content: string; timestamp: Date}>>([]);
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
  
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chat-folders', JSON.stringify(folders));
  }, [folders]);

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

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    // Create new chat if none selected
    if (!currentChat) {
      createNewChat();
    }

    const newMessage = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setIsStreaming(true);

    try {
      const messagesToSend = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...messages,
        newMessage
      ];

      const response = await window.puter.ai.chat(
        messagesToSend,
        false,
        { 
          model: selectedModel,
          stream: true
        }
      );

      let fullResponse = '';
      
      if (response && Symbol.asyncIterator in response) {
        const iterator = response[Symbol.asyncIterator]();
        while (true) {
          const { value, done } = await iterator.next();
          if (done) break;
          
          if (value?.text) {
            fullResponse += value.text;
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage?.role === 'assistant') {
                lastMessage.content = fullResponse;
                return [...newMessages];
              }
              return [...prev, { role: 'assistant', content: fullResponse, timestamp: new Date() }];
            });
          }
        }
      }

      // Save chat history
      setFolders(folders.map(f => ({
        ...f,
        chats: f.chats.map(c => 
          c.id === currentChat 
            ? { ...c, messages: [...messages, newMessage, { role: 'assistant', content: fullResponse, timestamp: new Date() }] }
            : c
        )
      })));

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">QanDu Chat</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3 space-y-4">
              <Button className="w-full" onClick={createNewChat}>
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>

              <div className="space-y-2">
                {folders.map(folder => (
                  <div key={folder.id} className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      {isEditingFolder === folder.id ? (
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onBlur={() => updateFolderName(folder.id, newFolderName)}
                          className="flex-1 bg-transparent border-none focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <>
                          <div className="flex items-center gap-2 flex-1">
                            <Folder className="w-4 h-4" />
                            <span className="font-medium">{folder.name}</span>
                          </div>
                          {folder.id !== 'default' && (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setIsEditingFolder(folder.id);
                                  setNewFolderName(folder.name);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive"
                                onClick={() => deleteFolder(folder.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="pl-4 space-y-1">
                      {folder.chats.map(chat => (
                        <div
                          key={chat.id}
                          className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${
                            currentChat === chat.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => {
                            setCurrentChat(chat.id);
                            setMessages(chat.messages);
                            setSystemPrompt(chat.systemPrompt || '');
                            setSelectedModel(chat.model || AVAILABLE_MODELS.DEFAULT);
                          }}
                        >
                          <span className="truncate">{chat.title}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" onClick={createFolder}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Folder
                </Button>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="col-span-9">
              <Card className="h-[75vh] flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {isChatTitleEditing && currentChat ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newChatTitle}
                          onChange={(e) => setNewChatTitle(e.target.value)}
                          className="border rounded px-2 py-1"
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
                            className="h-8 w-8 p-0"
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

                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="px-2 py-1 border rounded bg-background text-sm"
                    >
                      {Object.entries(AVAILABLE_MODELS).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const prompt = window.prompt('Enter system prompt:', systemPrompt);
                      if (prompt !== null) {
                        setSystemPrompt(prompt);
                      }
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    System Prompt
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <ChatMessages messages={messages} isTyping={isStreaming} />
                </div>

                <div className="p-4 border-t">
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
      </div>
    </AuthGuard>
  );
}
