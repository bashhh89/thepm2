import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  LayoutDashboard, 
  Settings, 
  Newspaper, 
  Lightbulb,
  UserCircle,
  ChevronRight,
  ChevronDown,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '../utils/auth-store';

interface DashboardNavProps {
  collapsed?: boolean;
}

interface NavSection {
  title: string;
  items: {
    icon: React.ReactNode;
    title: string;
    to: string;
    end?: boolean;
  }[];
}

export function DashboardNav({ collapsed = false }: DashboardNavProps) {
  const { isAdmin } = useAuthStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'content', 'management']));

  const baseClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground";
  const activeClasses = "bg-accent text-accent-foreground";

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionTitle)) {
        next.delete(sectionTitle);
      } else {
        next.add(sectionTitle);
      }
      return next;
    });
  };

  const navSections: NavSection[] = [
    {
      title: "Main",
      items: [
        {
          icon: <LayoutDashboard className="h-4 w-4" />,
          title: "Overview & Analytics",
          to: "/dashboard",
          end: true
        }
      ]
    },
    {
      title: "Content",
      items: [
        {
          icon: <FileText className="h-4 w-4" />,
          title: "Documents",
          to: "/dashboard/documents"
        },
        {
          icon: <Newspaper className="h-4 w-4" />,
          title: "Blog Posts",
          to: "/dashboard/blog-posts"
        }
      ]
    },
    {
      title: "Communication",
      items: [
        {
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Chat",
          to: "/dashboard/chat"
        },
        {
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Chat History",
          to: "/dashboard/chat-history"
        }
      ]
    },
    {
      title: "Management",
      items: [
        {
          icon: <Lightbulb className="h-4 w-4" />,
          title: "Leads",
          to: "/dashboard/leads"
        },
        {
          icon: <Briefcase className="h-4 w-4" />,
          title: "Jobs",
          to: "/dashboard/jobs" // Added link to Jobs page
        }
      ]
    },
    {
      title: "Jobs Management",
      items: [
        {
          icon: <Briefcase className="h-4 w-4" />,
          title: "Job Listings",
          to: "/dashboard/jobs"
        },
        {
          icon: <Users className="h-4 w-4" />,
          title: "Applications",
          to: "/dashboard/applicants"
        }
      ]
    },
    {
      title: "Settings",
      items: [
        {
          icon: <UserCircle className="h-4 w-4" />,
          title: "Profile",
          to: "/dashboard/profile"
        }
      ]
    }
  ];

  // Add admin-only sections
  if (isAdmin) {
    navSections.push({
      title: "Admin",
      items: [
        {
          icon: <Users className="h-4 w-4" />,
          title: "Users",
          to: "/admin/users"
        },
        {
          icon: <Briefcase className="h-4 w-4" />,
          title: "Job Applications",
          to: "/admin/applications"
        },
        {
          icon: <Settings className="h-4 w-4" />,
          title: "Settings",
          to: "/admin/settings"
        }
      ]
    });
  }
  
  return (
    <div
      data-collapsed={collapsed}
      className="group flex flex-col gap-4 py-2"
    >
      <nav className="grid gap-2 px-2">
        {navSections.map((section, index) => (
          <div key={section.title} className="space-y-1">
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
                !collapsed && "cursor-pointer hover:text-foreground"
              )}
              onClick={() => !collapsed && toggleSection(section.title)}
            >
              <span>{section.title}</span>
              {!collapsed && (
                <button className="h-4 w-4 rounded-md hover:bg-accent">
                  {expandedSections.has(section.title) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>

            {(collapsed || expandedSections.has(section.title)) && (
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(baseClasses, isActive && activeClasses)
                    }
                  >
                    {item.icon}
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                ))}
              </div>
            )}

            {index < navSections.length - 1 && (
              <div className="my-3 h-px bg-border" />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
