'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { componentStyles } from "@/lib/design-system";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderUnifiedProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBackground?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function HeaderUnified({
  title,
  description,
  icon,
  iconColor = "text-blue-400",
  iconBackground = "bg-blue-600/20",
  actions,
  breadcrumbs,
  className,
  ...props
}: HeaderUnifiedProps) {
  return (
    <div 
      className={cn(
        componentStyles.header.base,
        "py-4 px-6",
        className
      )}
      {...props}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="text-sm text-zinc-500 mb-2 flex items-center">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="hover:text-zinc-300 cursor-pointer transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={index === breadcrumbs.length - 1 ? "text-zinc-300" : ""}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon && (
            <div className={cn("rounded-full p-2 mr-3", iconBackground)}>
              <div className={iconColor}>{icon}</div>
            </div>
          )}
          <div>
            <h3 className="font-medium text-xl">{title}</h3>
            {description && (
              <p className="text-sm text-zinc-400">{description}</p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

export default HeaderUnified; 