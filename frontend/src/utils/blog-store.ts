import { create } from 'zustand';
import { useAuthStore } from './auth-store';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogStore {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  loadPosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Post>;
  updatePost: (id: string, post: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
}

const initializeStore = async (set: any) => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    set({ posts: posts || [], isLoading: false });
  } catch (error: any) {
    set({ error: error.message, isLoading: false });
  }
};

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  isLoading: true,
  error: null,

  loadPosts: async () => {
    set({ isLoading: true, error: null });
    await initializeStore(set);
  },

  createPost: async (post) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...post,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        posts: [data, ...state.posts]
      }));

      return data;
    } catch (error: any) {
      console.error('Error creating post:', error);
      throw new Error(error.message);
    }
  },

  updatePost: async (id, post) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          ...post,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? data : p))
      }));

      return data;
    } catch (error: any) {
      console.error('Error updating post:', error);
      throw new Error(error.message);
    }
  },

  deletePost: async (id) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id)
      }));
    } catch (error: any) {
      console.error('Error deleting post:', error);
      throw new Error(error.message);
    }
  }
}));
