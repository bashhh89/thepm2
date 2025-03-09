import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Users,
  BarChart3,
  MessageCircle,
  Rocket,
  Lock,
  Brain,
  Video,
  User,
  Settings,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

interface NavigationHeaderProps {
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
}

const menuItems = [
  {
    label: 'Solutions',
    items: [
      { icon: Brain, label: 'AI Matching', description: 'Smart candidate screening' },
      { icon: Video, label: 'Video Interviews', description: 'Remote interview platform' },
      { icon: BarChart3, label: 'Analytics', description: 'Recruitment insights' },
      { icon: Rocket, label: 'Automation', description: 'Workflow automation' },
    ]
  },
  {
    label: 'Resources',
    items: [
      { icon: Users, label: 'Success Stories', description: 'See how agencies grow' },
      { icon: MessageCircle, label: 'Blog', description: 'Industry insights' },
      { icon: Lock, label: 'Security', description: 'Enterprise-grade protection' }
    ]
  }
];

const profileMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function NavigationHeader({ isAuthenticated, onSignIn, onSignUp, onLogout }: NavigationHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-sm' : 'bg-background'
      }`}
    >
      {/* AI Tools Banner - Only show when not scrolled */}
      {!isScrolled && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-1 px-4 text-center text-sm border-b">
          <span className="inline-flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            Now offering AI-powered recruitment tools
          </span>
        </div>
      )}
      
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">Q</span>
          </div>
          <span className="text-xl font-bold">QanDu</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((menu) => (
            <div 
              key={menu.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(menu.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                <span>{menu.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {openDropdown === menu.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                  >
                    <div className="w-64 bg-background rounded-xl border shadow-lg p-4 grid gap-2">
                      {menu.items.map((item) => (
                        <Link
                          key={item.label}
                          to="#"
                          className="flex items-start p-2 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <item.icon className="w-5 h-5 text-primary mr-3 mt-0.5 transition-transform group-hover:scale-110" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <Button 
                variant="ghost" 
                className="relative"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </Button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-background rounded-xl border shadow-lg py-2"
                  >
                    <div className="px-4 py-2 border-b">
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">john@example.com</div>
                    </div>
                    {profileMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button variant="ghost" onClick={onSignIn}>Sign In</Button>
              <Button onClick={onSignUp} className="group">
                Get Started
                <Sparkles className="ml-2 w-4 h-4 transition-transform group-hover:rotate-12" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 90 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -90 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-6">
              {menuItems.map((menu) => (
                <div key={menu.label} className="space-y-2">
                  <div className="font-medium text-lg">{menu.label}</div>
                  <div className="grid gap-2 pl-4">
                    {menu.items.map((item) => (
                      <Link
                        key={item.label}
                        to="#"
                        className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <item.icon className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="grid gap-4 pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    {profileMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="flex items-center p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Link>
                    ))}
                    <Button 
                      variant="ghost" 
                      onClick={onLogout}
                      className="justify-start text-red-500 hover:text-red-600"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={onSignIn}>Sign In</Button>
                    <Button onClick={onSignUp} className="group">
                      Get Started
                      <Sparkles className="ml-2 w-4 h-4 transition-transform group-hover:rotate-12" />
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

export default NavigationHeader;