import { create } from 'zustand';
import { useAuthStore } from './auth-store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzqythwfrmjakhvmopyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXl0aHdmcm1qYWtodm1vcHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTkwMDQsImV4cCI6MjA1NjU5NTAwNH0.QZRgjjtxLlXsH-6U_bGDb62TfZvtkyIycM1LPapjZ28';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface definitions
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageType: 'url' | 'upload' | 'generate';
  author: string;
  publishDate: string;
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isInitialized: boolean;
  
  loadPosts: () => Promise<void>;
  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>, user: any) => Promise<string>;
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => BlogPost | undefined;
}

// Validation function
const validatePost = (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (!post.title.trim()) {
    throw new Error('Title is required');
  }
  if (!post.content.trim()) {
    throw new Error('Content is required');
  }
  if (!post.excerpt.trim()) {
    throw new Error('Excerpt is required');
  }
  return true;
};

// Initialize the store
export const useBlogStore = create<BlogState>((set, get) => {
  // Load posts on store creation
  const initializeStore = async () => {
    if (!get().isInitialized) {
      await get().loadPosts();
    }
  };
  
  // Call initialize immediately
  initializeStore();

  return {
    // Initial state
    posts: [],
    isLoading: true,
    error: null,
    isSaving: false,
    isInitialized: false,

    loadPosts: async () => {
      if (get().isInitialized) return;
      set({ isLoading: true, error: null });
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error('No data returned from Supabase');
        }

        const transformedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.cover_image,
          coverImageType: post.cover_image_type,
          author: post.author,
          publishDate: post.publish_date,
          status: post.status,
          categories: post.categories || [],
          tags: post.tags || [],
          createdAt: post.created_at,
          updatedAt: post.updated_at
        }));

        set({ 
          posts: transformedPosts,
          isLoading: false,
          isInitialized: true
        });
      } catch (error: any) {
        console.error('Error loading posts:', error);
        set({ 
          error: `Failed to load posts: ${error.message}`,
          isLoading: false,
          isInitialized: true,
          posts: [] // Ensure posts is always an array even on error
        });
      }
    },

    createPost: async (postData, user) => {
      set({ isSaving: true, error: null });
      
      try {
        validatePost(postData);
        
        if (!user?.id) {
          throw new Error('User must be logged in to create posts');
        }

        const now = new Date().toISOString();
        const post = {
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          cover_image: postData.coverImage,
          cover_image_type: postData.coverImageType,
          author: postData.author,
          publish_date: postData.publishDate,
          status: postData.status,
          categories: postData.categories,
          tags: postData.tags,
          created_at: now,
          updated_at: now,
          user_id: user.id
        };
        
        const { data, error } = await supabase
          .from('posts')
          .insert([post])
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error('No data returned after creating post');
        }

        const newPost = {
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.cover_image,
          coverImageType: data.cover_image_type,
          author: data.author,
          publishDate: data.publish_date,
          status: data.status,
          categories: data.categories || [],
          tags: data.tags || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        set(state => ({
          posts: [newPost, ...state.posts],
          isSaving: false
        }));
        
        return newPost.id;
      } catch (error: any) {
        console.error('Error creating post:', error);
        set({ error: error.message, isSaving: false });
        throw error;
      }
    },

    updatePost: async (id, updates) => {
      set({ isSaving: true, error: null });
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User must be logged in to update posts');
        }

        const currentPost = get().posts.find(p => p.id === id);
        if (!currentPost) {
          throw new Error('Post not found');
        }
        
        const updatedPost = {
          title: updates.title,
          excerpt: updates.excerpt,
          content: updates.content,
          cover_image: updates.coverImage,
          cover_image_type: updates.coverImageType,
          author: updates.author,
          publish_date: updates.publishDate,
          status: updates.status,
          categories: updates.categories,
          tags: updates.tags,
          updated_at: new Date().toISOString()
        };

        validatePost({ ...currentPost, ...updates });
        
        const { error } = await supabase
          .from('posts')
          .update(updatedPost)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        set(state => ({
          posts: state.posts.map(p => p.id === id ? {
            ...p,
            ...updates,
            updatedAt: updatedPost.updated_at
          } : p),
          isSaving: false
        }));
      } catch (error: any) {
        console.error('Error updating post:', error);
        set({ error: error.message, isSaving: false });
        throw error;
      }
    },

    deletePost: async (id) => {
      set({ isSaving: true, error: null });
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User must be logged in to delete posts');
        }

        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        
        set(state => ({
          posts: state.posts.filter(p => p.id !== id),
          isSaving: false
        }));
      } catch (error: any) {
        console.error('Error deleting post:', error);
        set({ error: error.message, isSaving: false });
        throw error;
      }
    },

    getPost: (id) => {
      return get().posts.find(p => p.id === id);
    }
  };
});