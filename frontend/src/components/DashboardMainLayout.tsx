import React, { useState, useEffect } from 'react';
import { DashboardNav } from './DashboardNav';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { useAuthStore } from '../utils/auth-store';
import { supabase } from '../AppWrapper';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface DashboardMainLayoutProps {
  children: React.ReactNode;
}

export function DashboardMainLayout({ children }: DashboardMainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const adminLogout = useAuthStore(state => state.adminLogout);
  const { isAdmin } = useAuthStore();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
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
  const toggleCollapsed = () => setSidebarCollapsed(!sidebarCollapsed);

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
          "fixed inset-y-0 left-0 z-50 flex lg:static",
          "transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[64px]" : "w-64",
          !sidebarOpen && "lg:w-[64px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn(
          "flex flex-col flex-1 border-r bg-card",
          "transition-all duration-300 ease-in-out"
        )}>
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

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
        sidebarCollapsed && "lg:pl-[64px]",
        !sidebarOpen && "lg:pl-[64px]"
      )}>
        <div className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="-ml-2 h-9 w-9"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <span className="font-bold">{isAdmin ? 'QanDu Admin' : 'QanDu'}</span>
        </div>
        
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
