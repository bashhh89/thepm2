import create from 'zustand';

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  categories: string[];
  status: 'draft' | 'published';
}

interface BlogStore {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  loadPosts: () => Promise<void>;
  getPostBySlug: (slug: string) => Post | undefined;
}

// Mock data
const mockPosts: Post[] = [
  {
    id: 1,
    slug: 'future-of-ai-in-recruitment',
    title: 'The Future of AI in Recruitment',
    excerpt: 'Discover how artificial intelligence is transforming the recruitment landscape and what it means for hiring managers.',
    content: `
      <p>Artificial Intelligence is revolutionizing the way organizations approach recruitment and talent acquisition. As we move further into the digital age, AI-powered solutions are becoming increasingly sophisticated and capable of handling complex hiring processes.</p>
      
      <h2>The Current State of AI in Recruitment</h2>
      <p>Today's AI recruitment tools can analyze resumes, conduct initial candidate screenings, and even predict candidate success rates. These capabilities are transforming how HR professionals approach their daily tasks and making the hiring process more efficient than ever before.</p>
      
      <h2>Key Benefits of AI-Powered Recruitment</h2>
      <ul>
        <li>Reduced time-to-hire through automated screening</li>
        <li>Improved candidate matching accuracy</li>
        <li>Elimination of unconscious bias</li>
        <li>Enhanced candidate experience</li>
        <li>Data-driven decision making</li>
      </ul>
      
      <h2>Looking Ahead</h2>
      <p>The future of AI in recruitment looks promising, with emerging technologies set to further transform the hiring landscape. From advanced natural language processing to predictive analytics, these innovations will continue to shape how organizations find and retain top talent.</p>
    `,
    coverImage: '/blog/ai-recruitment.jpg',
    date: '2024-03-15',
    author: {
      name: 'Sarah Johnson',
      role: 'HR Technology Specialist',
      avatar: '/avatars/sarah.jpg'
    },
    categories: ['AI', 'Recruitment', 'Technology'],
    status: 'published'
  },
  {
    id: 2,
    slug: 'best-practices-for-video-interviews',
    title: 'Best Practices for Video Interviews',
    excerpt: 'Learn the essential tips and tricks to conduct effective video interviews and assess candidates remotely.',
    content: `
      <p>Video interviews have become an essential part of the modern recruitment process. Learn how to make the most of this technology and ensure a smooth interview experience for both recruiters and candidates.</p>
      
      <h2>Setting Up for Success</h2>
      <p>Proper preparation is key to conducting effective video interviews. Ensure you have a reliable internet connection, good lighting, and a professional background.</p>
      
      <h2>Best Practices</h2>
      <ul>
        <li>Test your equipment before each interview</li>
        <li>Maintain eye contact through the camera</li>
        <li>Use clear and concise communication</li>
        <li>Have a backup plan for technical issues</li>
      </ul>
    `,
    coverImage: '/blog/video-interviews.jpg',
    date: '2024-03-10',
    author: {
      name: 'Michael Chen',
      role: 'Talent Acquisition Manager',
      avatar: '/avatars/michael.jpg'
    },
    categories: ['Interviews', 'Remote Work', 'Best Practices'],
    status: 'published'
  }
];

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  loadPosts: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ posts: mockPosts, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load posts', isLoading: false });
    }
  },
  getPostBySlug: (slug: string) => {
    return get().posts.find(post => post.slug === slug);
  }
}));
