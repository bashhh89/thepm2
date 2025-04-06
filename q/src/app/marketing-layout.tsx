'use client';

import React from 'react';
import Header from '@/components/Header';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isMarketingLayout={true} />
      <main className="flex-1">
        {children}
      </main>
      {/* Footer is moved to individual page components */}
    </div>
  );
} 