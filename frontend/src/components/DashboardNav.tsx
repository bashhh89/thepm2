import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  LayoutDashboard, 
  Settings,
  Briefcase,
  Building2,
  Calendar,
  PieChart,
  ChevronRight,
  ChevronDown,
  Trophy,
  GraduationCap,
  Mail,
  Layout
} from 'lucide-react';

interface DashboardNavProps {
  collapsed?: boolean;
  features?: {
    jobPosting?: boolean;
    candidateTracking?: boolean;
    interviews?: boolean;
    analytics?: boolean;
  };
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

export function DashboardNav({ 
  collapsed = false,
  features = {
    jobPosting: true,
    candidateTracking: true,
    interviews: true,
    analytics: true
  }
}: DashboardNavProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Overview']));

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
      title: "Overview",
      items: [
        {
          icon: <LayoutDashboard className="h-4 w-4" />,
          title: "Dashboard",
          to: "/dashboard",
          end: true
        }
      ]
    },
    ...(features.jobPosting ? [{
      title: "Recruitment",
      items: [
        {
          icon: <Briefcase className="h-4 w-4" />,
          title: "Job Postings",
          to: "/dashboard/jobs"
        },
        {
          icon: <Users className="h-4 w-4" />,
          title: "Candidates",
          to: "/dashboard/candidates"
        },
        {
          icon: <Trophy className="h-4 w-4" />,
          title: "Talent Pool",
          to: "/dashboard/talent-pool"
        },
        {
          icon: <Building2 className="h-4 w-4" />,
          title: "Client Companies",
          to: "/dashboard/companies"
        }
      ]
    }] : []),
    ...(features.interviews ? [{
      title: "Pipeline",
      items: [
        {
          icon: <Calendar className="h-4 w-4" />,
          title: "Interviews",
          to: "/dashboard/interviews"
        },
        {
          icon: <GraduationCap className="h-4 w-4" />,
          title: "Assessments",
          to: "/dashboard/assessments"
        },
        {
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Conversations",
          to: "/dashboard/messages"
        }
      ]
    }] : []),
    ...(features.analytics ? [{
      title: "Business",
      items: [
        {
          icon: <PieChart className="h-4 w-4" />,
          title: "Analytics",
          to: "/dashboard/analytics"
        },
        {
          icon: <FileText className="h-4 w-4" />,
          title: "Reports",
          to: "/dashboard/reports"
        },
        {
          icon: <Mail className="h-4 w-4" />,
          title: "Email Templates",
          to: "/dashboard/email-templates"
        }
      ]
    }] : []),
    {
      title: "Configuration",
      items: [
        {
          icon: <Building2 className="h-4 w-4" />,
          title: "Agency Profile",
          to: "/dashboard/agency"
        },
        {
          icon: <Layout className="h-4 w-4" />,
          title: "Career Site",
          to: "/dashboard/career-site"
        },
        {
          icon: <Settings className="h-4 w-4" />,
          title: "Settings",
          to: "/dashboard/settings"
        }
      ]
    }
  ];
  
  return (
    <div
      data-collapsed={collapsed}
      className="group flex flex-col gap-4 py-2"
    >
      <nav className="grid gap-1 px-2">
        {navSections.map((section, index) => (
          <div key={section.title} className={cn("space-y-1", index > 0 && "mt-4")}>
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
                !collapsed && "cursor-pointer hover:text-foreground"
              )}
              onClick={() => !collapsed && toggleSection(section.title)}
            >
              <span>{!collapsed ? section.title : "•"}</span>
              {!collapsed && (
                expandedSections.has(section.title) ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
              )}
            </div>

            {(!collapsed || expandedSections.has(section.title)) && (
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
