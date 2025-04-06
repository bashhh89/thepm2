'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { IntelliSearchModal } from './IntelliSearchModal';

export function IntelliSearchFloatingButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <Button 
        id="intelliSearchFloating"
        variant="default"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full p-3 h-12 w-12 flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <Sparkles className="h-5 w-5" />
      </Button>
      
      <IntelliSearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 