import { create } from 'zustand';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  categories: string[];
  status: 'draft' | 'published';
}

interface BlogStore {
  posts: BlogPost[];
  isSaving: boolean;
  isInitialized: boolean;
  setPosts: (posts: BlogPost[]) => void;
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => BlogPost | undefined;
  createPost: (post: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt'>) => Promise<string>;
  loadPosts: () => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  isSaving: false,
  isInitialized: true,
  setPosts: (posts) => set({ posts }),
  getPost: (id) => get().posts.find(post => post.id === id),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  updatePost: (id, updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, ...updatedPost } : post
      )
    })),
  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id)
    })),
  createPost: async (postData) => {
    set({ isSaving: true });
    try {
      // Ensure all required fields are present
      if (!postData.title || !postData.content || !postData.excerpt) {
        throw new Error('Missing required fields: title, content, and excerpt are required');
      }

      // Format the post data to match the backend schema
      const formattedPostData = {
        ...postData,
        // Ensure author is properly formatted
        author: {
          name: typeof postData.author === 'string' ? postData.author : postData.author?.name || 'Anonymous',
          avatar: typeof postData.author === 'object' ? postData.author.avatar : undefined
        },
        // Ensure arrays are initialized
        tags: postData.tags || [],
        categories: postData.categories || [],
        // Set default status if not provided
        status: postData.status || 'draft'
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedPostData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || 
          `Failed to create post: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const newPost = await response.json();
      
      // Validate the response data
      if (!newPost || !newPost.id) {
        throw new Error('Invalid response from server: missing post ID');
      }

      // Update the local state with the new post
      set((state) => ({
        posts: [...state.posts, newPost]
      }));
      
      return newPost.id;
    } catch (error) {
      console.error('Create post error:', error);
      throw error; // Re-throw to let the UI handle the error
    } finally {
      set({ isSaving: false });
    }
  },
  loadPosts: async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const posts = await response.json();
      set({ posts, isInitialized: true });
    } catch (error) {
      console.error('Failed to load posts:', error);
      set({ isInitialized: false });
    }
  }
}));