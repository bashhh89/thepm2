import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Newspaper, 
  Briefcase,
  Lightbulb,
  UserCircle
} from 'lucide-react';
import { useAuthStore } from '../utils/auth-store';
import { supabase } from '../AppWrapper';

interface DashboardNavProps {
  collapsed?: boolean;
}

export function DashboardNav({ collapsed = false }: DashboardNavProps) {
  const [user, setUser] = useState<any>(null);
  const { isAdmin } = useAuthStore();

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const baseClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground";
  const activeClasses = "bg-accent text-accent-foreground";
  
  return (
    <div
      data-collapsed={collapsed}
      className="group flex flex-col gap-4 py-2"
    >
      <nav className="grid gap-1 px-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            cn(baseClasses, isActive && activeClasses)
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/dashboard/documents"
          className={({ isActive }) =>
            cn(baseClasses, isActive && activeClasses)
          }
        >
          <FileText className="h-4 w-4" />
          <span>Documents</span>
        </NavLink>

        <NavLink
          to="/dashboard/blog-posts"
          className={({ isActive }) =>
            cn(baseClasses, isActive && activeClasses)
          }
        >
          <Newspaper className="h-4 w-4" />
          <span>Blog Posts</span>
        </NavLink>

        <NavLink
          to="/dashboard/chat"
          className={({ isActive }) =>
            cn(baseClasses, isActive && activeClasses)
          }
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </NavLink>

        <NavLink
          to="/dashboard/chat-history"
          className={({ isActive }) =>
            cn(baseClasses, isActive && activeClasses)
          }
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat History</span>
        </NavLink>

        <NavLink
          to="/dashboard/jobs"
          className={({ isActive }) =>
            cn(baseClasses, isActive && activeClasses)
          }
        >
          <Briefcase className="h-4 w-4" />
          <span>Jobs</span>
        </NavLink>

        <NavLink
          to="/dashboard/leads"
          className={({ isActive }) =>
            cn(baseClasses, isActive && activeClasses)
          }
        >
          <Lightbulb className="h-4 w-4" />
          <span>Leads</span>
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            cn(baseClasses, isActive && activeClasses)
          }
        >
          <UserCircle className="h-4 w-4" />
          <span>Profile</span>
        </NavLink>

        {isAdmin && (
          <>
            <NavLink
              to="/dashboard/analytics"
              className={({ isActive }) =>
                cn(baseClasses, isActive && activeClasses)
              }
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </NavLink>

            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                cn(baseClasses, isActive && activeClasses)
              }
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </NavLink>

            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                cn(baseClasses, isActive && activeClasses)
              }
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
}
