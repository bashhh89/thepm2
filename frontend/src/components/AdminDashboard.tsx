import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';
import { ChevronDown, ChevronRight, Users, Settings, BarChart3, Bell, Shield, Database, Server, Code } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../utils/auth-store';

interface MenuSection {
  title: string;
  items: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
  }[];
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, isLoading } = useAuthStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['system', 'users']));

  useEffect(() => {
    // Redirect non-admin users to dashboard
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdmin, isAuthenticated, isLoading, navigate]);

  const menuSections: MenuSection[] = [
    {
      title: "System",
      items: [
        {
          id: "settings",
          title: "System Settings",
          description: "Configure system-wide settings and preferences",
          icon: <Settings className="h-5 w-5" />,
          href: "/admin/settings"
        },
        {
          id: "analytics",
          title: "Analytics",
          description: "View system analytics and usage statistics",
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/admin/analytics"
        },
        {
          id: "monitoring",
          title: "System Monitoring",
          description: "Monitor system health and performance",
          icon: <Server className="h-5 w-5" />,
          href: "/admin/monitoring"
        }
      ]
    },
    {
      title: "Users & Security",
      items: [
        {
          id: "users",
          title: "User Management",
          description: "Manage user accounts and permissions",
          icon: <Users className="h-5 w-5" />,
          href: "/admin/users"
        },
        {
          id: "security",
          title: "Security Settings",
          description: "Configure security policies and access controls",
          icon: <Shield className="h-5 w-5" />,
          href: "/admin/security"
        }
      ]
    },
    {
      title: "Content & Data",
      items: [
        {
          id: "database",
          title: "Database Management",
          description: "Manage database operations and backups",
          icon: <Database className="h-5 w-5" />,
          href: "/admin/database"
        },
        {
          id: "api",
          title: "API Management",
          description: "Configure API settings and access",
          icon: <Code className="h-5 w-5" />,
          href: "/admin/api"
        }
      ]
    }
  ];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Let the useEffect handle redirection
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <p className="text-muted-foreground">System management and monitoring</p>
          </div>
          <Button onClick={() => setExpandedSections(new Set(menuSections.map(s => s.title)))}>
            Expand All
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <div className="text-2xl font-bold">25</div>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Active Sessions</span>
            </div>
            <div className="text-2xl font-bold">142</div>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Server className="h-4 w-4" />
              <span className="text-sm font-medium">System Uptime</span>
            </div>
            <div className="text-2xl font-bold">99.9%</div>
          </Card>
          <Card className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-purple-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Security Status</span>
            </div>
            <div className="text-2xl font-bold">Good</div>
          </Card>
        </div>

        {/* Menu Sections */}
        <div className="space-y-6">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <div
                className={cn(
                  "flex items-center justify-between cursor-pointer",
                  "hover:text-foreground transition-colors"
                )}
                onClick={() => toggleSection(section.title)}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {expandedSections.has(section.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {section.title}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {section.items.length} items
                </div>
              </div>

              {expandedSections.has(section.title) && (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <DashboardCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                      buttonText="Access"
                      onClick={() => navigate(item.href)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;