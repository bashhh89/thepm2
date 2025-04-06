import React from 'react';
import AdvancedSearchUI from '../../components/search/AdvancedSearchUI';

export const metadata = {
  title: 'Advanced Research | QanDu AI',
  description: 'AI-powered guided research and analysis for business decisions',
};

export default function AdvancedSearchPage() {
  return (
    <div className="pt-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Advanced Research</h1>
      <p className="text-muted-foreground mb-6">
        Our AI-powered research assistant helps you discover insights and make better decisions.
      </p>
      <AdvancedSearchUI />
    </div>
  );
} 