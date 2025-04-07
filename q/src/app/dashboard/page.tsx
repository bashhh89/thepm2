'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Keep for project fetching
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Home, MessageSquare, Folder, Image, Headphones, Plus, ArrowRight, LayoutDashboard } from 'lucide-react';
import { CardUnified, CardUnifiedHeader, CardUnifiedTitle, CardUnifiedContent, CardUnifiedDecoration } from '@/components/ui/card-unified';
import { ButtonUnified } from '@/components/ui/button-unified';
import HeaderUnified from '@/components/ui/header-unified';
import { componentStyles, layouts } from '@/lib/design-system';

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
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen">
      <HeaderUnified 
        title="Dashboard" 
        description="Your project overview and quickstart tools"
        icon={<LayoutDashboard className="h-5 w-5" />}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboard" }
        ]}
      />

      <div className={layouts.container}>
        {/* Welcome Section */}
        <CardUnified className="mb-8 relative overflow-hidden">
          <CardUnifiedDecoration color="#3b82f6" />
          <CardUnifiedContent className="relative z-10 pt-6">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-zinc-400 max-w-2xl">
              Organize tasks, track progress, and collaborate with your team in one powerful platform
            </p>
          </CardUnifiedContent>
        </CardUnified>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Recent Chats" 
            value={projectStats.recentChats} 
            icon={<MessageSquare className="h-5 w-5" />} 
            color="blue" 
          />
          <StatCard 
            title="Active Projects" 
            value={projectStats.activeProjects} 
            icon={<Folder className="h-5 w-5" />} 
            color="pink" 
          />
          <StatCard 
            title="Images Created" 
            value={projectStats.imagesCreated} 
            icon={<Image className="h-5 w-5" />} 
            color="green" 
          />
          <StatCard 
            title="Audio Generated" 
            value={projectStats.audioGenerated} 
            icon={<Headphones className="h-5 w-5" />} 
            color="amber" 
          />
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">Your Projects</h2>
            <ButtonUnified asChild>
              <Link href="/projects/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Link>
            </ButtonUnified>
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
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-5">AI Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ToolCard icon={<Image className="h-5 w-5" />} title="Image Generator" href="/image-generator" color="blue" />
            <ToolCard icon={<Headphones className="h-5 w-5" />} title="Text to Speech" href="/audio-tts" color="pink" />
            <ToolCard icon={<MessageSquare className="h-5 w-5" />} title="Create Agent" href="/agents/create" color="green" />
            <ToolCard icon={<ArrowRight className="h-5 w-5" />} title="Test Tools" href="/test-tools" color="amber" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color: 'blue' | 'pink' | 'green' | 'amber';
}) {
  const colorMap = {
    blue: "text-blue-400 bg-blue-500/10",
    pink: "text-pink-400 bg-pink-500/10",
    green: "text-green-400 bg-green-500/10",
    amber: "text-amber-400 bg-amber-500/10"
  };
  
  return (
    <CardUnified variant="interactive">
      <CardUnifiedContent className="pt-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-2 rounded-full ${colorMap[color]}`}>
            {icon}
          </div>
        </div>
      </CardUnifiedContent>
    </CardUnified>
  );
}

function ProjectCard({ title, description, lastUpdated, status }: { 
  title: string; 
  description: string; 
  lastUpdated: string;
  status: string;
}) {
  return (
    <CardUnified variant="interactive" className="relative overflow-hidden">
      <CardUnifiedHeader>
        <div className="flex justify-between items-start">
          <CardUnifiedTitle className="text-base">{title}</CardUnifiedTitle>
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-700/30 text-zinc-400 border border-zinc-600'
          }`}>
            {status}
          </span>
        </div>
      </CardUnifiedHeader>
      <CardUnifiedContent>
        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{description}</p>
        <p className="text-xs text-zinc-500">Last updated: {lastUpdated}</p>
      </CardUnifiedContent>
    </CardUnified>
  );
}

function ToolCard({ icon, title, href, color }: { 
  icon: React.ReactNode; 
  title: string; 
  href: string;
  color: 'blue' | 'pink' | 'green' | 'amber';
}) {
  const colorMap = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  };
  
  return (
    <Link href={href}>
      <CardUnified variant="interactive" className="group">
        <CardUnifiedContent className="pt-5 flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${colorMap[color]}`}>
            {icon}
          </div>
          <span className="font-medium group-hover:text-white transition-colors">{title}</span>
          <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
        </CardUnifiedContent>
      </CardUnified>
    </Link>
  );
} 