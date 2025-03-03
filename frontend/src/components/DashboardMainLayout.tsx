import React, { useState, useEffect } from 'react';
import { DashboardNav } from './DashboardNav';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { useAuthStore } from '../utils/auth-store';
import { supabase } from '../AppWrapper';

interface DashboardMainLayoutProps {
  children: React.ReactNode;
}

export function DashboardMainLayout({ children }: DashboardMainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const adminLogout = useAuthStore(state => state.adminLogout);
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

  const handleLogout = async () => {
    if (isAdmin) {
      adminLogout();
    } else {
      await supabase.auth.signOut();
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform lg:static lg:transition-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-bold">QanDu Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <DashboardNav collapsed={false} />
        </div>
        
        <div className="border-t p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.email || (isAdmin ? 'Admin' : 'Guest')}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="-ml-2 h-9 w-9"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <span className="font-bold lg:hidden">QanDu Admin</span>
        </div>
        
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
