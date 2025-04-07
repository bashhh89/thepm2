'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/authUtils';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Briefcase, Import, Plus, Calendar, CheckCircle, BarChart, Layers } from 'lucide-react';
import { CardUnified, CardUnifiedHeader, CardUnifiedTitle, CardUnifiedContent, CardUnifiedFooter, CardUnifiedDecoration } from '@/components/ui/card-unified';
import { ButtonUnified } from '@/components/ui/button-unified';
import HeaderUnified from '@/components/ui/header-unified';
import { layouts } from '@/lib/design-system';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  workspace_id: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskCounts, setTaskCounts] = useState<Record<string, { total: number, completed: number }>>({});
  
  const { activeWorkspaceId, workspaces } = useWorkspaceStore();

  const activeWorkspaceName = workspaces.find(w => w.id === activeWorkspaceId)?.name || '';
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        const currentUser = await requireAuth();
        if (!currentUser) return;
        
        if (!activeWorkspaceId) {
          setError('Please select a workspace first');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/projects?workspaceId=${activeWorkspaceId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data.projects || []);
        
        const projectIds = data.projects ? data.projects.map((p: Project) => p.id) : [];
        const counts: Record<string, { total: number, completed: number }> = {};
        
        if (projectIds.length > 0) {
          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('project_id, status')
            .in('project_id', projectIds);
          
          if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
          } else if (tasks) {
            projectIds.forEach((id: string) => {
              counts[id] = { total: 0, completed: 0 };
            });
            
            tasks.forEach(task => {
              counts[task.project_id].total++;
              if (task.status === 'completed') {
                counts[task.project_id].completed++;
              }
            });
            
            setTaskCounts(counts);
          }
        }
      } catch (err: any) {
        console.error('Error loading projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [router, activeWorkspaceId]);
  
  const handleCreateProject = () => {
    if (!activeWorkspaceId) {
      setError('Please select a workspace first');
      return;
    }
    
    router.push(`/projects/new?workspaceId=${activeWorkspaceId}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!activeWorkspaceId) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen">
        <div className={layouts.container}>
          <CardUnified className="mt-8">
            <CardUnifiedHeader>
              <CardUnifiedTitle>No Workspace Selected</CardUnifiedTitle>
            </CardUnifiedHeader>
            <CardUnifiedContent>
              <p className="mb-4 text-zinc-400">Please select a workspace from the dropdown in the header to view your projects.</p>
              <p className="mb-4 text-zinc-400">If you don't have any workspaces yet, create one by clicking on the workspace selector dropdown.</p>
            </CardUnifiedContent>
          </CardUnified>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen">
        <div className={layouts.container}>
          <CardUnified className="mt-8 border-red-500/50">
            <CardUnifiedHeader>
              <CardUnifiedTitle className="text-red-400">Error Loading Projects</CardUnifiedTitle>
            </CardUnifiedHeader>
            <CardUnifiedContent>
              <p className="mb-4">Failed to load your projects.</p>
              <p className="text-zinc-400">{error}</p>
            </CardUnifiedContent>
            <CardUnifiedFooter>
              <ButtonUnified variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </ButtonUnified>
            </CardUnifiedFooter>
          </CardUnified>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen">
      <HeaderUnified 
        title="Projects" 
        description={activeWorkspaceName ? `Workspace: ${activeWorkspaceName}` : "Manage your projects"}
        icon={<Briefcase className="h-5 w-5" />}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects" }
        ]}
        actions={
          <div className="flex space-x-3">
            <ButtonUnified 
              variant="outline" 
              onClick={() => router.push(`/projects/json-import?workspaceId=${activeWorkspaceId}`)}
            >
              <Import className="h-4 w-4 mr-2" />
              Import JSON
            </ButtonUnified>
            <ButtonUnified onClick={handleCreateProject}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </ButtonUnified>
          </div>
        }
      />

      <div className={layouts.container}>
        {error && (
          <CardUnified className="mb-6 border-red-500/50 bg-red-900/10">
            <CardUnifiedContent className="pt-5">
              <p className="text-red-400">{error}</p>
            </CardUnifiedContent>
          </CardUnified>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
            <p className="mt-4 text-zinc-400">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <CardUnified className="text-center py-12">
            <CardUnifiedContent className="pt-12 flex flex-col items-center">
              <Layers className="h-12 w-12 text-zinc-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Projects Yet</h3>
              <p className="text-zinc-400 mb-6">Create your first project to get started</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <ButtonUnified onClick={handleCreateProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </ButtonUnified>
                <ButtonUnified 
                  variant="outline" 
                  onClick={() => router.push(`/projects/json-import?workspaceId=${activeWorkspaceId}`)}
                >
                  <Import className="h-4 w-4 mr-2" />
                  Import from JSON
                </ButtonUnified>
              </div>
            </CardUnifiedContent>
          </CardUnified>
        ) : (
          <div className={layouts.grid}>
            {projects.map((project) => {
              const taskCount = taskCounts[project.id] || { total: 0, completed: 0 };
              const progress = taskCount.total > 0 
                ? Math.round((taskCount.completed / taskCount.total) * 100) 
                : 0;
              
              let statusColor = "#3b82f6"; // Default blue
              if (project.status === "completed") statusColor = "#10b981"; // Green
              if (project.status === "on-hold") statusColor = "#f59e0b"; // Amber
              if (project.status === "cancelled") statusColor = "#ef4444"; // Red
              
              return (
                <CardUnified
                  key={project.id}
                  variant="interactive"
                  className="relative overflow-hidden"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <CardUnifiedDecoration color={statusColor} />
                  <CardUnifiedHeader>
                    <div className="flex justify-between items-start">
                      <CardUnifiedTitle className="relative z-10">{project.title}</CardUnifiedTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        getStatusClasses(project.status)
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </CardUnifiedHeader>
                  <CardUnifiedContent>
                    <p className="text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-zinc-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-24 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="ml-2 flex items-center text-xs text-zinc-400">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          {progress}%
                        </div>
                      </div>
                    </div>
                  </CardUnifiedContent>
                </CardUnified>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get status classes
function getStatusClasses(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'completed':
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'on-hold':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'cancelled':
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    default:
      return 'bg-zinc-700/30 text-zinc-400 border border-zinc-600';
  }
} 