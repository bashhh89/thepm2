import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';

interface NavigationHeaderProps {
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  items?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  href: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Solutions',
    href: '#',
    items: [
      {
        label: 'AI Assistant',
        href: '/pages/product/ai-assistant',
        description: 'Intelligent automation for your business'
      },
      {
        label: 'Enterprise',
        href: '/pages/product/enterprise',
        description: 'Advanced solutions for large organizations'
      },
      {
        label: 'Analytics',
        href: '/pages/product/analytics',
        description: 'Data insights and visualization'
      }
    ]
  },
  {
    label: 'Resources',
    href: '#',
    items: [
      {
        label: 'Documentation',
        href: '/pages/resources/documentation',
        description: 'Guides and API references'
      },
      {
        label: 'Blog',
        href: '/blog',
        description: 'Latest updates and articles'
      },
      {
        label: 'Community',
        href: '/pages/resources/community',
        description: 'Join our developer community'
      }
    ]
  },
  {
    label: 'Company',
    href: '#',
    items: [
      {
        label: 'About',
        href: '/pages/company/about',
        description: 'Our story and mission'
      },
      {
        label: 'Contact',
        href: '/pages/company/contact',
        description: 'Get in touch with us'
      }
    ]
  },
  {
    label: 'Pricing',
    href: '/pages/pricing/plans'
  },
  {
    label: 'Careers',
    href: '/careers',
    items: [
      {
        label: 'Open Positions',
        href: '/careers',
        description: 'Browse available job opportunities'
      },
      {
        label: 'Life at QanDu',
        href: '/careers/culture',
        description: 'Learn about our culture and values'
      },
      {
        label: 'Benefits & Perks',
        href: '/careers/benefits',
        description: 'Discover what we offer'
      }
    ]
  }
];

export function NavigationHeader({ isAuthenticated, onSignIn, onSignUp, onLogout }: NavigationHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-200",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-sm" 
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-bold text-xl">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                QanDu
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-1 px-2 py-2 text-sm font-medium text-muted-foreground",
                      "hover:text-foreground transition-colors",
                      activeDropdown === item.label && "text-foreground"
                    )}
                  >
                    {item.label}
                    {item.items && (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Link>

                  {item.items && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-64 pt-2"
                        >
                          <div className="bg-popover rounded-lg shadow-lg border p-4">
                            <div className="grid gap-2">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  to={subItem.href}
                                  className="block p-2 rounded-md hover:bg-accent"
                                >
                                  <div className="font-medium">{subItem.label}</div>
                                  {subItem.description && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {subItem.description}
                                    </div>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={onLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onSignIn}>
                  Sign in
                </Button>
                <Button onClick={onSignUp}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container px-4 py-4">
              <div className="grid gap-4">
                {menuItems.map((item) => (
                  <div key={item.label}>
                    {item.items ? (
                      <div className="space-y-2">
                        <div className="font-medium">{item.label}</div>
                        <div className="grid gap-2 pl-4">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.label}
                              to={subItem.href}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                            >
                              <div>
                                <div className="font-medium">{subItem.label}</div>
                                {subItem.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {subItem.description}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                      >
                        <span className="font-medium">{item.label}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid gap-4 mt-6">
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard'}>
                      Dashboard
                    </Button>
                    <Button variant="default" className="w-full" onClick={onLogout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={onSignIn}>
                      Sign in
                    </Button>
                    <Button variant="default" className="w-full" onClick={onSignUp}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}