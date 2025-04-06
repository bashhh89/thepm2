'use client';

import React, { useState } from 'react';
import { Sparkles, Search, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IntelliSearchResults } from './IntelliSearchResults';
import { toast } from '@/components/ui/use-toast';
import { IntelliSearchResult } from '@/lib/search/intelliSearchService';

interface IntelliSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextData?: string;
}

export function IntelliSearchModal({
  isOpen,
  onClose,
  contextData = ''
}: IntelliSearchModalProps) {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState(contextData);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<IntelliSearchResult[]>([]);
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch('/api/intellisearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          context,
          limit: 10 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Search failed');
      }
      
      const data = await response.json();
      setResults(data.results);
    } catch (error: any) {
      console.error('IntelliSearch failed:', error);
      toast({
        title: "Search Error",
        description: error.message || "Failed to search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
            IntelliSearch
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col space-y-2">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching}
                autoFocus
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
            
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Optional: Add context to improve search results..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                disabled={isSearching}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Adding context helps the AI understand your specific needs and provide more relevant results.
              </p>
            </div>
          </div>
          
          {results.length > 0 && (
            <IntelliSearchResults 
              results={results}
            />
          )}
          
          {query && !isSearching && results.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              No results found. Try a different search query or add more context.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 