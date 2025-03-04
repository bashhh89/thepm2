import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Card } from './Card';
import { ArrowLeft } from 'lucide-react';

interface ContentPageProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function ContentPage({ title, subtitle, children }: ContentPageProps) {
  const { category, page } = useParams();
  
  // Format the title if not provided
  const pageTitle = title || (page && category 
    ? `${page.charAt(0).toUpperCase() + page.slice(1)} - ${category.charAt(0).toUpperCase() + category.slice(1)}`
    : 'Information');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
            {subtitle && (
              <p className="text-xl text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <Card className="p-6">
            {children || (
              <div className="prose dark:prose-invert max-w-none">
                <p>This page is currently under construction. Please check back later for more information about {page}.</p>
                
                <div className="mt-8 flex flex-col gap-4">
                  <h2>Related Links</h2>
                  <ul className="list-none p-0 space-y-2">
                    <li>
                      <Link to="/" className="text-primary hover:underline">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="text-primary hover:underline">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link to="/support" className="text-primary hover:underline">
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}