'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Define type locally instead of importing
interface IntelliSearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  relevanceScore: number;
  tags?: string[];
  source?: string;
  timestamp?: string;
}

interface IntelliSearchResultsProps {
  results: IntelliSearchResult[];
}

export function IntelliSearchResults({ results }: IntelliSearchResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No results found. Try a different search query.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => {
        // Check if URL is external (has http/https) or internal
        const isExternalUrl = result.url.startsWith('http');
        
        return (
          <Card key={result.id} className="transition-shadow hover:shadow-md">
            {isExternalUrl ? (
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-foreground no-underline"
              >
                <ResultCardContent result={result} showExternalIcon={true} />
              </a>
            ) : (
              <Link href={result.url} className="block text-foreground no-underline">
                <ResultCardContent result={result} showExternalIcon={false} />
              </Link>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function ResultCardContent({ result, showExternalIcon }: { result: IntelliSearchResult, showExternalIcon: boolean }) {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-start gap-2">
          <div className="flex-1">{result.title}</div>
          {showExternalIcon && <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {result.source && (
            <span className="font-medium">{result.source} · </span>
          )}
          <span>Relevance: {(result.relevanceScore * 100).toFixed(0)}%</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{result.description}</p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-1">
          {result.tags?.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </>
  );
} 