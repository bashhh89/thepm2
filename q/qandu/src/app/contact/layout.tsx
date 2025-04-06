'use client';

import React from 'react';
import MarketingLayout from '../marketing-layout';

export default function ContactLayout({
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