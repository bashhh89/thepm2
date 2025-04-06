'use client';

import React, { useEffect, useState } from 'react';
import { IntelliSearchModal } from '../../components/search/IntelliSearchModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Search, Sparkles, Info, BookOpen, Globe, Library, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function SearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-open the search modal when the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 300); // Short delay to ensure smooth transition
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">IntelliSearch</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
              Advanced Web Search
            </CardTitle>
            <CardDescription>
              Get real-time search results from across the web
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              IntelliSearch combines the power of real-time web search with advanced processing capabilities to provide you with the most relevant information from across the internet.
            </p>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              Open IntelliSearch
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 text-blue-500 mr-2" />
              How to Use IntelliSearch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Step 1: Enter Your Query
                </h3>
                <p className="text-sm">Type any search query in the search box. For example:</p>
                <ul className="list-disc list-inside mt-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>"Latest AI developments in healthcare"</li>
                  <li>"Sustainable energy solutions for homes"</li>
                  <li>"Best practices for remote team management"</li>
                </ul>
              </div>
              
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Step 2: Add Context (Optional)
                </h3>
                <p className="text-sm">Add additional context to refine your search results:</p>
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 p-2 rounded">
                  "I'm looking for information that is recent and focused on practical applications"
                </div>
              </div>
              
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Step 3: Review Results
                </h3>
                <p className="text-sm">Browse through the web search results, which include:</p>
                <ul className="list-disc list-inside mt-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>Direct links to web pages</li>
                  <li>Brief summaries of the content</li>
                  <li>Source websites and relevance scores</li>
                  <li>Knowledge graph information when available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Real-Time Web Results
                </h3>
                <p className="text-sm">Get the latest information from across the internet</p>
              </div>
              
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Library className="h-4 w-4 mr-2" />
                  Semantic Understanding
                </h3>
                <p className="text-sm">Goes beyond keywords to understand your search intent</p>
              </div>
              
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2">Knowledge Graph Integration</h3>
                <p className="text-sm">Get additional context with knowledge graph data when available</p>
              </div>
              
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2">Customized Relevance</h3>
                <p className="text-sm">Results ranked by relevance to your specific query</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <IntelliSearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
} 