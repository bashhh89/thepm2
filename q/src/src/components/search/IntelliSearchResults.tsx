'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ExternalLink } from 'lucide-react';
import { IntelliSearchResult } from '../../lib/search/intelliSearchService';

interface IntelliSearchResultsProps {
  results: IntelliSearchResult[];
}

export function IntelliSearchResults({ results }: IntelliSearchResultsProps) {
  if (!results.length) return null;
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Results ({results.length})</h3>
      
      <div className="space-y-3">
        {results.map((result, index) => (
          <ResultCard key={index} result={result} />
        ))}
      </div>
    </div>
  );
}

interface ResultCardProps {
  result: IntelliSearchResult;
}

function ResultCard({ result }: ResultCardProps) {
  // Function to render different badge colors based on relevance score
  const getRelevanceBadge = (score: number) => {
    if (score >= 0.85) return 'bg-green-100 text-green-800';
    if (score >= 0.7) return 'bg-blue-100 text-blue-800';
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Function to truncate text if it's too long
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-base mb-1">{result.title}</h4>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {result.tags?.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              
              <Badge 
                variant="secondary" 
                className={`text-xs ${getRelevanceBadge(result.relevanceScore)}`}
              >
                {Math.round(result.relevanceScore * 100)}% match
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {truncateText(result.description || '', 150)}
            </p>
            
            {result.metadata && (
              <div className="text-xs text-gray-500 space-y-1 mt-2">
                {Object.entries(result.metadata).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}: </span>
                    <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
