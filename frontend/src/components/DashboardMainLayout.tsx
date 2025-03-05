import React, { useState, useEffect } from 'react';
import { DashboardNav } from './DashboardNav';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { useAuthStore } from '../utils/auth-store';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../AppWrapper';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface DashboardMainLayoutProps {
  children: React.ReactNode;
}

export function DashboardMainLayout({ children }: DashboardMainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { adminLogout, isAdmin } = useAuthStore();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/sign-in');
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    if (isAdmin) {
      adminLogout();
      navigate('/');
    } else {
      await supabase.auth.signOut();
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapsed = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="flex min-h-screen">
      <aside 
        className={cn(
          "fixed left-0 top-0 z-20 h-full w-64 border-r transition-all duration-300 bg-background lg:relative",
          sidebarCollapsed && "w-16",
          !sidebarOpen && "lg:w-0 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-1 flex-col">
          <div className="flex h-14 items-center border-b px-4 justify-between">
            <span className={cn(
              "font-bold transition-all duration-300",
              sidebarCollapsed && "opacity-0 lg:hidden"
            )}>
              {isAdmin ? 'QanDu Admin' : 'QanDu'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex w-8 h-8 p-0"
              onClick={toggleCollapsed}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <DashboardNav collapsed={sidebarCollapsed} />
          </div>
          
          <div className="border-t p-4">
            <div className={cn(
              "flex items-center gap-4 mb-4 transition-all duration-300",
              sidebarCollapsed && "justify-center"
            )}>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate transition-all duration-300",
                  sidebarCollapsed && "hidden"
                )}>
                  {user?.email || (isAdmin ? 'Admin' : 'Guest')}
                </p>
                <p className={cn(
                  "text-sm text-muted-foreground truncate transition-all duration-300",
                  sidebarCollapsed && "hidden"
                )}>
                  {isAdmin ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className={cn(
                "w-full transition-all duration-300",
                sidebarCollapsed && "px-2"
              )} 
              onClick={handleLogout}
            >
              {sidebarCollapsed ? '→' : 'Log out'}
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-full items-center gap-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden w-8 h-8 p-0"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
