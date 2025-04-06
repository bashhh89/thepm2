'use client';

import React from 'react';
import MarketingLayout from '../marketing-layout';

export default function AboutLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <MarketingLayout>
      {children}
    </MarketingLayout>
  );
} 