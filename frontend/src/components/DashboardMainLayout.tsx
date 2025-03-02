import React, { useState } from 'react';
import { DashboardNav } from './DashboardNav';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useAuthStore } from '../utils/auth-store';

interface DashboardMainLayoutProps {
  children: React.ReactNode;
}

export function DashboardMainLayout({ children }: DashboardMainLayoutProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const adminLogout = useAuthStore(state => state.adminLogout);

  const handleLogout = async () => {
    adminLogout();
    if (signOut) {
      await signOut();
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
          "fixed inset-y-0 left-0 z-50 bg-background border-r transition-all duration-300 ease-in-out lg:translate-x-0 lg:static",
          sidebarOpen ? "w-64" : "w-20",
          !sidebarOpen && "lg:w-20",
          !sidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold">QanDu</h1>
            ) : (
              <h1 className="text-xl font-bold mx-auto">Q</h1>
            )}
            <button 
              className="hover:bg-accent/50 p-2 rounded-md lg:hidden" 
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <DashboardNav collapsed={!sidebarOpen} />
          </div>
          <div className="border-t p-4">
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="truncate">
                    <div className="font-medium truncate">{user?.fullName || user?.emailAddresses?.[0]?.emailAddress}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" className="w-full h-10" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header with toggle menu button */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-background px-4 py-4 border-b">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 hover:bg-accent/50 p-2 rounded-md"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarOpen ? (
                <>
                  <path d="M15 18l-6-6 6-6"/>
                </>
              ) : (
                <>
                  <path d="M9 18l6-6-6-6"/>
                </>
              )}
            </svg>
          </button>
          <div className="flex-1 text-sm font-semibold">Dashboard</div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
