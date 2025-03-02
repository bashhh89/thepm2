import { create } from 'zustand';
import { useAuthStore } from './auth-store';

interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  isSending: boolean;
  
  loadConversations: () => Promise<void>;
  createConversation: (title?: string) => Promise<string>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (content: string, model?: string) => Promise<void>;
  clearCurrentConversation: () => void;
}

// Function to dynamically load Puter.js script
const ensurePuterScriptLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.puter) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('puter-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject());
      return;
    }

    const script = document.createElement('script');
    script.id = 'puter-js';
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
};

// Helper functions for localStorage
const saveConversationsToStorage = (userId: string, conversations: Conversation[]) => {
  localStorage.setItem(`conversations_${userId}`, JSON.stringify(conversations));
};

const loadConversationsFromStorage = (userId: string): Conversation[] => {
  const stored = localStorage.getItem(`conversations_${userId}`);
  if (!stored) return [];
  
  const conversations = JSON.parse(stored);
  return conversations.map((conv: any) => ({
    ...conv,
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt),
    messages: conv.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  }));
};

export const useChatStore = create<ChatState>((set, get) => {
  // Subscribe to auth changes
  const unsubscribeAuth = useAuthStore.subscribe((state) => {
    if (state.user || state.isAdmin) {
      // User logged in, load their conversations
      get().loadConversations().catch(console.error);
    } else {
      // User logged out, clear current state
      set({ 
        conversations: [],
        currentConversation: null,
        isLoading: false,
        error: null
      });
    }
  });

  return {
    conversations: [],
    currentConversation: null,
    isLoading: false,
    error: null,
    isSending: false,

    loadConversations: async () => {
      const { user, isAdmin } = useAuthStore.getState();
      const userId = isAdmin ? 'admin' : user?.id;
      
      if (!userId) {
        set({ error: 'User not authenticated' });
        return;
      }

      set({ isLoading: true, error: null });
      try {
        const conversations = loadConversationsFromStorage(userId);
        set({ 
          conversations, 
          isLoading: false,
          currentConversation: conversations.length > 0 ? conversations[0] : null
        });
      } catch (error: any) {
        console.error('Error loading conversations:', error);
        set({ error: error.message, isLoading: false });
      }
    },

    createConversation: async (title = 'New Conversation') => {
      const { user, isAdmin } = useAuthStore.getState();
      const userId = isAdmin ? 'admin' : user?.id;
      
      if (!userId) {
        set({ error: 'User not authenticated' });
        throw new Error('User not authenticated');
      }

      try {
        const newConversation: Conversation = {
          id: crypto.randomUUID(),
          title,
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: []
        };

        set(state => {
          const newConversations = [newConversation, ...state.conversations];
          saveConversationsToStorage(userId, newConversations);
          return {
            conversations: newConversations,
            currentConversation: newConversation
          };
        });

        return newConversation.id;
      } catch (error: any) {
        console.error('Error creating conversation:', error);
        set({ error: error.message });
        throw error;
      }
    },

    selectConversation: (conversationId: string) => {
      const { conversations } = get();
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        set({ currentConversation: conversation });
      }
    },

    sendMessage: async (content: string, model = 'gpt-4o-mini') => {
      const { currentConversation } = get();
      const { user, isAdmin } = useAuthStore.getState();
      const userId = isAdmin ? 'admin' : user?.id;
      
      if (!userId) {
        set({ error: 'User not authenticated' });
        throw new Error('User not authenticated');
      }
      
      if (!currentConversation) {
        // Create a new conversation if none exists
        const conversationId = await get().createConversation();
        get().selectConversation(conversationId);
      }
      
      const conversation = get().currentConversation;
      if (!conversation) {
        set({ error: 'Failed to create conversation' });
        throw new Error('Failed to create conversation');
      }

      set({ isSending: true, error: null });
      
      try {
        // Add user message
        const userMessage: Message = {
          role: 'user',
          content,
          timestamp: new Date()
        };
        const messagesUpdated = [...conversation.messages, userMessage];
        
        // Update local state with user message
        set(state => {
          const updatedConversation = {
            ...conversation,
            messages: messagesUpdated,
            updatedAt: new Date()
          };
          
          const newConversations = state.conversations.map(c => 
            c.id === conversation.id ? updatedConversation : c
          );

          saveConversationsToStorage(userId, newConversations);
          
          return {
            currentConversation: updatedConversation,
            conversations: newConversations
          };
        });
        
        // Process with Puter AI
        const messages = messagesUpdated.map(m => ({
          role: m.role, 
          content: m.content
        }));
        
        const response = await window.puter.ai.chat(
          messages,
          false,
          {
            model: model,
            stream: false
          }
        );

        const responseContent = typeof response === 'string' ? 
          response : 
          response.message?.content || '';

        // Add AI response
        const assistantMessage: Message = {
          role: 'assistant',
          content: responseContent,
          timestamp: new Date()
        };
        const allMessages = [...messagesUpdated, assistantMessage];
        
        // Update local state with AI response
        set(state => {
          const updatedConversation = {
            ...conversation,
            messages: allMessages,
            updatedAt: new Date()
          };
          
          const newConversations = state.conversations.map(c => 
            c.id === conversation.id ? updatedConversation : c
          );

          saveConversationsToStorage(userId, newConversations);
          
          return {
            currentConversation: updatedConversation,
            conversations: newConversations,
            isSending: false
          };
        });
        
      } catch (error: any) {
        console.error('Error sending message:', error);
        set({ error: error.message, isSending: false });
      }
    },

    clearCurrentConversation: () => {
      set({ currentConversation: null });
    }
  };
});
