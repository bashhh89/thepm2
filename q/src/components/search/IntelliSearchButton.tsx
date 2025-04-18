'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { IntelliSearchModal } from './IntelliSearchModal';

interface IntelliSearchButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
}

export function IntelliSearchButton({ className, variant = 'default' }: IntelliSearchButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <Button 
        id="intelliSearchTrigger"
        variant={variant}
        size="sm"
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        IntelliSearch
      </Button>
      
      <IntelliSearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 