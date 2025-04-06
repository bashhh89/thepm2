import React from 'react';
import AdvancedSearchForm from '../../components/search/AdvancedSearchForm';

export const metadata = {
  title: 'Advanced Search | QanDu AI',
  description: 'AI-powered search with comprehensive answers from the web',
};

export default function AdvancedSearchPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Advanced Search</h1>
        <p className="text-muted-foreground">
          Powered by Pollinations SearchGPT, this tool searches the web and synthesizes 
          comprehensive answers to your questions.
        </p>
      </div>
      
      <AdvancedSearchForm />
    </div>
  );
} 