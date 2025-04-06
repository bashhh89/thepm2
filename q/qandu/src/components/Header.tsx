"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { IntelliSearchButton } from './search/IntelliSearchButton';

interface HeaderProps {
  isMarketingLayout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMarketingLayout = false }) => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Set mounted to true after the component mounts
    setMounted(true);
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="qandu-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M12 8v8" />
              <path d="m8.5 14 7-4" />
              <path d="m8.5 10 7 4" />
            </svg>
            <span className="font-bold text-xl text-foreground">QanDu<span className="text-primary">AI</span></span>
          </Link>

          {/* Desktop Navigation - Only for authenticated users on non-marketing layouts */}
          {isAuthenticated && !isMarketingLayout && (
            <nav className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-foreground hover:text-primary qandu-transition-all">
                  <span>Chat</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg bg-card border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1 rounded-md">
                    <Link href="/chat/llm" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">LLM Chat</Link>
                    <Link href="/chat/agent" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Agent Chat</Link>
                    <Link href="/chat/history" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">History</Link>
                    <Link href="/chat/favorites" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Favorites</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-foreground hover:text-primary qandu-transition-all">
                  <span>Projects</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg bg-card border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1 rounded-md">
                    <Link href="/projects" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">All Projects</Link>
                    <Link href="/projects/create" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Create Project</Link>
                    <Link href="/projects/templates" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Templates</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-foreground hover:text-primary qandu-transition-all">
                  <span>Agents</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg bg-card border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1 rounded-md">
                    <Link href="/agents" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Manage Agents</Link>
                    <Link href="/agents/create" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Create Agent</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-foreground hover:text-primary qandu-transition-all">
                  <span>Tools</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg bg-card border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1 rounded-md">
                    <Link href="/image-generator" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Image Generator</Link>
                    <Link href="/audio-tts" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Text to Speech</Link>
                    <Link href="/test-tools" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">Test Tools</Link>
                  </div>
                </div>
              </div>

              <Link href="/dashboard" className="text-foreground hover:text-primary qandu-transition-all">Dashboard</Link>
              <Link href="/admin" className="text-foreground hover:text-primary qandu-transition-all">Admin</Link>
            </nav>
          )}
          
          {/* Marketing Navigation - Either not authenticated, or marketing layout */}
          {(!isAuthenticated || isMarketingLayout) && (
            <nav className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 text-foreground hover:text-primary qandu-transition-all"
                  onMouseEnter={() => setFeaturesDropdownOpen(true)}
                  onMouseLeave={() => setFeaturesDropdownOpen(false)}
                >
                  <span>Features</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                
                {featuresDropdownOpen && (
                  <div 
                    className="absolute left-0 top-full mt-2 w-56 rounded-md shadow-lg bg-card border border-border py-1 z-50"
                    onMouseEnter={() => setFeaturesDropdownOpen(true)}
                    onMouseLeave={() => setFeaturesDropdownOpen(false)}
                  >
                    <Link href="/features" className="block px-4 py-2 text-sm text-foreground hover:bg-muted qandu-transition-all">
                      Features Overview
                    </Link>
                    <Link href="/features/chat" className="block px-4 py-2 text-sm text-foreground hover:bg-muted qandu-transition-all">
                      AI Assistant
                    </Link>
                    <Link href="/features/projects" className="block px-4 py-2 text-sm text-foreground hover:bg-muted qandu-transition-all">
                      Project Management
                    </Link>
                    <Link href="/features/image-generator" className="block px-4 py-2 text-sm text-foreground hover:bg-muted qandu-transition-all">
                      Image Generation
                    </Link>
                    <Link href="/features/content" className="block px-4 py-2 text-sm text-foreground hover:bg-muted qandu-transition-all">
                      Content Creation
                    </Link>
                    <Link href="/features/presentations" className="block px-4 py-2 text-sm text-foreground hover:bg-muted qandu-transition-all">
                      Presentation Builder
                    </Link>
                    <Link href="/features/leads" className="block px-4 py-2 text-sm text-foreground hover:bg-muted qandu-transition-all">
                      Lead Management
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/about" className="text-foreground hover:text-primary qandu-transition-all">About</Link>
              <Link href="/pricing" className="text-foreground hover:text-primary qandu-transition-all">Pricing</Link>
              <Link href="/contact" className="text-foreground hover:text-primary qandu-transition-all">Contact</Link>
              {/* Only show home on marketing layout if logged in, otherwise it's redundant with logo */}
              {isAuthenticated && isMarketingLayout && (
                <Link href="/dashboard" className="text-foreground hover:text-primary qandu-transition-all">Dashboard</Link>
              )}
            </nav>
          )}

          {/* Right Section with Theme Toggle and IntelliSearch */}
          <div className="flex items-center space-x-3">
            {/* IntelliSearchButton - Only visible when authenticated and not on marketing layout */}
            {isAuthenticated && !isMarketingLayout && (
              <IntelliSearchButton variant="ghost" className="flex" />
            )}
            
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-foreground hover:bg-muted qandu-transition-all"
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                    <path d="m4.93 4.93 1.41 1.41"/>
                    <path d="m17.66 17.66 1.41 1.41"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="m6.34 17.66-1.41 1.41"/>
                    <path d="m19.07 4.93-1.41 1.41"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                  </svg>
                )
              )}
            </button>
            
            {/* User Profile Button - Conditionally show content or login/register */}
            {isAuthenticated ? (
              <button 
                onClick={handleAccountClick}
                className="flex items-center space-x-2 rounded-md border border-border p-2 text-foreground hover:bg-muted qandu-transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="hidden sm:inline">Account</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-muted qandu-transition-all"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 qandu-transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden rounded-md p-2 text-foreground hover:bg-muted qandu-transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Conditionally show items based on authentication and marketing layout */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t border-border bg-background qandu-fade-in">
          <nav className="flex flex-col space-y-4">
            {/* Add IntelliSearch Button to Mobile Menu */}
            {isAuthenticated && !isMarketingLayout && (
              <div className="mb-2">
                <IntelliSearchButton variant="outline" className="w-full" />
              </div>
            )}

            {/* Authenticated Nav Items - Only on non-marketing layouts */}
            {isAuthenticated && !isMarketingLayout ? (
              <>
                <Link href="/dashboard" className="text-foreground hover:text-primary qandu-transition-all">Dashboard</Link>
                <Link href="/chat" className="text-foreground hover:text-primary qandu-transition-all">Chat</Link>
                <Link href="/projects" className="text-foreground hover:text-primary qandu-transition-all">Projects</Link>
                <Link href="/agents" className="text-foreground hover:text-primary qandu-transition-all">Agents</Link>
                <Link href="/image-generator" className="text-foreground hover:text-primary qandu-transition-all">Image Generator</Link>
                <Link href="/audio-tts" className="text-foreground hover:text-primary qandu-transition-all">Text to Speech</Link>
                <Link href="/admin" className="text-foreground hover:text-primary qandu-transition-all">Admin</Link>
              </>
            ) : (
              // Marketing Nav Items
              <>
                <Link href="/features" className="text-foreground hover:text-primary qandu-transition-all">Features</Link>
                <Link href="/about" className="text-foreground hover:text-primary qandu-transition-all">About</Link>
                <Link href="/pricing" className="text-foreground hover:text-primary qandu-transition-all">Pricing</Link>
                <Link href="/contact" className="text-foreground hover:text-primary qandu-transition-all">Contact</Link>
                {/* Only show dashboard link in mobile menu if authenticated and on marketing layout */}
                {isAuthenticated && isMarketingLayout && (
                  <Link href="/dashboard" className="text-foreground hover:text-primary qandu-transition-all">Dashboard</Link>
                )}
              </>
            )}
            
            {/* Sign Out button for mobile */}
            {isAuthenticated && (
              <button 
                onClick={signOut}
                className="flex items-center space-x-2 text-foreground hover:text-primary qandu-transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 