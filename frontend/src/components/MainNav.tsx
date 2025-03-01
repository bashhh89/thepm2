import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "../utils/cn";

interface NavItem {
  title: string;
  href: string;
  description?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    description: "Return to homepage",
  },
];

export function MainNav() {
  const location = useLocation();

  return (
    <nav className="flex items-center space-x-6 overflow-x-auto">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
            location.pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}