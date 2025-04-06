'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface IntelliSearchButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
}

export function IntelliSearchButton({ className, variant = 'default' }: IntelliSearchButtonProps) {
  return (
    <Button 
      variant={variant}
      size="sm"
      className={className}
      onClick={() => alert('IntelliSearch coming soon!')}
    >
      <Sparkles className="h-4 w-4 mr-2" />
      IntelliSearch
    </Button>
  );
} 