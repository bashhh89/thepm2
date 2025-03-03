import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { cn } from '../lib/utils';
import { FileText, MessageSquare, Users, LayoutDashboard, BarChart3, Settings, Newspaper } from 'lucide-react';

interface DashboardNavProps {
  collapsed?: boolean;
}

export function DashboardNav({ collapsed = false }: DashboardNavProps) {
  const { user } = useUser();

  const links = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-6 h-6" />
    },
    {
      title: 'Blog Posts',
      href: '/dashboard/blog-posts',
      icon: <Newspaper className="w-6 h-6" />
    },
    {
      title: 'Chat History',
      href: '/dashboard/chat-history',
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      title: 'Leads',
      href: '/dashboard/leads',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Documents',
      href: '/dashboard/documents',
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-6 h-6" />
    },
  ];

  return (
    <nav className="grid gap-2">
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          end={link.href === '/dashboard'}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent relative group',
              isActive ? 'bg-accent text-accent-foreground' : 'transparent text-muted-foreground',
              collapsed && 'justify-center px-2'
            )
          }
        >
          <div className={cn(
            "min-w-[24px]",
            collapsed && "mx-auto"
          )}>
            {link.icon}
          </div>
          {!collapsed && (
            <span className="text-sm font-medium">
              {link.title}
            </span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-accent text-accent-foreground rounded-md text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all whitespace-nowrap z-50">
              {link.title}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
