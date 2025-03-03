import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "../lib/utils";

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
  {
    title: "Blog",
    href: "/blog",
    description: "Read our latest articles",
  },
  {
    title: "Features",
    href: "/#features",
    description: "Explore our features",
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "View our pricing plans",
  }
];

export function MainNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="flex items-center space-x-6 overflow-x-auto">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "relative text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
            "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-transform",
            currentPath === item.href
              ? "text-foreground after:scale-x-100"
              : "text-muted-foreground after:scale-x-0"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}