'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Keep for project fetching
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Home, MessageSquare, Folder, Image, Headphones, Plus, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, session } = useAuth(); // Get user and loading state from context
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true); // Separate loading state for projects
  const [error, setError] = useState<string | null>(null);
  const [projectStats, setProjectStats] = useState({
    recentChats: 12,
    activeProjects: 9,
    imagesCreated: 27,
    audioGenerated: 8
  });

  // Effect for handling authentication redirect
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("Dashboard: Auth loading complete, no user found. Redirecting to login.");
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Effect for loading projects only when authenticated
  useEffect(() => {
    async function loadProjects() {
      // Only load projects if the user is authenticated and auth is not loading
      if (!authLoading && user) {
        console.log("Dashboard: User authenticated, loading projects...");
        try {
          setLoadingProjects(true);
          setError(null); // Clear any previous errors

          // Get unique projects
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('updated_at', { ascending: false });

          if (projectsError) {
            console.error('Supabase error loading projects:', projectsError);
            throw new Error(projectsError.message || 'Failed to load projects from database');
          }

          if (!projectsData) {
            console.warn('No project data returned from database');
            setProjects([]);
            return;
          }

          // Remove duplicates by name
          const uniqueProjects = projectsData.reduce((acc: Project[], current) => {
            const exists = acc.find(p => p.name === current.name);
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, []) || [];

          setProjects(uniqueProjects);
        } catch (err: any) {
          console.error('Error loading projects:', err);
          // Provide more specific error message
          setError(err.message || 'Failed to load projects. Please try refreshing the page.');
        } finally {
          setLoadingProjects(false);
        }
      } else if (!authLoading && !user) {
        // If auth check is done and there's no user, ensure projects aren't loaded
        setLoadingProjects(false);
        setProjects([]); // Clear projects if user logs out
        console.log("Dashboard: User not authenticated, skipping project load.");
      } else {
         console.log("Dashboard: Waiting for auth state...");
         // Optionally set loadingProjects true while waiting for auth state
         // setLoadingProjects(true);
      }
    }

    loadProjects();
    // Depend on user and authLoading to re-run when auth state changes
  }, [user, authLoading]);

  // Show loading indicator while auth is loading OR projects are loading
  if (authLoading || loadingProjects) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 mb-2">
            Manage Your Projects with Ease
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Organize tasks, track progress, and collaborate with your team in one powerful platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700/50 hover:bg-zinc-800/50 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-zinc-400">Recent Chats</p>
                <h3 className="text-2xl font-bold mt-1">{projectStats.recentChats}</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700/50 hover:bg-zinc-800/50 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-zinc-400">Active Projects</p>
                <h3 className="text-2xl font-bold mt-1">{projectStats.activeProjects}</h3>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Folder className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700/50 hover:bg-zinc-800/50 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-zinc-400">Images Created</p>
                <h3 className="text-2xl font-bold mt-1">{projectStats.imagesCreated}</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Image className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700/50 hover:bg-zinc-800/50 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-zinc-400">Audio Generated</p>
                <h3 className="text-2xl font-bold mt-1">{projectStats.audioGenerated}</h3>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-full">
                <Headphones className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">Your Projects</h2>
            <Link 
              href="/projects/create" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New Project
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Project Cards */}
            <ProjectCard 
              title="Freelancer Coffee Shop Project in Amman" 
              description="This project aims to establish a coffee shop in Amman specifically designed for freelancers and remote workers."
              lastUpdated="3/30/2025"
              status="active"
            />
            
            <ProjectCard 
              title="Scooter Sharing App Project" 
              description="This project involves the development and launch of a scooter sharing app platform."
              lastUpdated="3/30/2025"
              status="active"
            />
            
            <ProjectCard 
              title="Coffeeshop for Entrepreneurs in Amman" 
              description="This project aims to establish a unique coffeeshop in Amman, designed specifically for entrepreneurs."
              lastUpdated="3/30/2025"
              status="active"
            />
          </div>
        </div>

        {/* AI Tools Section */}
        <div>
          <h2 className="text-xl font-bold mb-5">AI Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ToolCard icon={<Image className="h-5 w-5 text-blue-400" />} title="Image Generator" href="/image-generator" />
            <ToolCard icon={<Headphones className="h-5 w-5 text-purple-400" />} title="Text to Speech" href="/audio-tts" />
            <ToolCard icon={<MessageSquare className="h-5 w-5 text-green-400" />} title="Create Agent" href="/agents/create" />
            <ToolCard icon={<ArrowRight className="h-5 w-5 text-amber-400" />} title="Test Tools" href="/test-tools" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ title, description, lastUpdated, status }: { 
  title: string; 
  description: string; 
  lastUpdated: string;
  status: string;
}) {
  return (
    <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition-all">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-zinc-100 text-base">{title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === 'active' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-zinc-700/30 text-zinc-400 border border-zinc-600'
          }`}>
            {status}
          </span>
        </div>
        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{description}</p>
        <p className="text-xs text-zinc-500">Last updated: {lastUpdated}</p>
      </div>
    </div>
  );
}

function ToolCard({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <Link href={href} className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 transition-all">
      <div className="p-3 bg-zinc-700/30 rounded-full mb-3">
        {icon}
      </div>
      <h3 className="text-zinc-200 text-sm">{title}</h3>
    </Link>
  );
} 