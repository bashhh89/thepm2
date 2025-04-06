'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

interface AdvancedSearchResponse {
  success: boolean;
  synthesizedAnswer?: string;
  error?: string;
  metadata?: {
    searchQueries: string[];
    executionTimeMs: number;
  };
}

export default function AdvancedSearchForm() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdvancedSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/advanced-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while performing the search');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Advanced search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Advanced Search</CardTitle>
          <CardDescription>
            Search with AI-powered web research and comprehensive answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground text-sm">
            Searching the web and synthesizing results... This may take a moment.
          </p>
        </div>
      )}

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && result.success && result.synthesizedAnswer && (
        <Card>
          <CardHeader>
            <CardTitle>Research Results</CardTitle>
            {result.metadata && (
              <CardDescription>
                Based on {result.metadata.searchQueries.length} search queries.
                Completed in {Math.round(result.metadata.executionTimeMs / 1000)} seconds.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown>{result.synthesizedAnswer}</Markdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 