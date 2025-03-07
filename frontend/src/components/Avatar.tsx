import React from 'react';
import { cn } from '../lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
}

export function Avatar({ src, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative w-10 h-10 rounded-full overflow-hidden bg-secondary",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}
    </div>
  );
} 