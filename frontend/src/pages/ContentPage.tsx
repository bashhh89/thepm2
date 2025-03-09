import React from 'react';

interface ContentPageProps {
  category: string;
  page: string;
}

export function ContentPage({ category, page }: ContentPageProps) {
  const title = page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          This {category} page about {title} is under construction.
          Check back soon for detailed information about our {title} solution.
        </p>
      </div>
    </div>
  );
}

export default ContentPage; 