/**
 * IntelliSearch service using Pollinations API
 * 
 * This service provides AI-powered intelligent search functionality
 * that understands context and provides more relevant results than
 * traditional keyword search.
 */

import { callPollinationsChat } from '@/lib/pollinations';

export interface IntelliSearchResult {
  id?: string;
  title: string;
  description?: string;
  url?: string;
  relevanceScore: number;
  tags?: string[];
  metadata?: Record<string, any>;
  content?: string;
  source?: string;
  timestamp?: string | number;
}

export interface IntelliSearchRequest {
  query: string;
  context?: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface IntelliSearchResponse {
  results: IntelliSearchResult[];
  totalResults?: number;
  queryTime?: number;
  suggestedQueries?: string[];
}

interface IntelliSearchOptions {
  limit?: number;
  cacheResults?: boolean;
  context?: string;
}

const defaultOptions: IntelliSearchOptions = {
  limit: 5,
  cacheResults: true,
  context: ''
};

// Simple in-memory cache
const searchCache = new Map<string, {results: IntelliSearchResult[], timestamp: number}>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// System prompt for the IntelliSearch
const INTELLISEARCH_SYSTEM_PROMPT = `
You are IntelliSearch, an advanced AI search assistant for MENA businesses expanding to the US market.
Your task is to analyze the user's search query and provide highly relevant, contextual results.
You should understand the business context and intent behind the query to deliver precise information.

For each result, provide:
1. A relevant title
2. Detailed content that directly addresses the query
3. A relevance score from 1-100
4. Source information when applicable
5. URL when applicable

Format your response as a JSON array of objects, each with the following structure:
{
  "title": "Result title",
  "content": "Detailed information addressing the query",
  "relevance": 95,
  "source": "Source of information (if applicable)",
  "url": "URL to more information (if applicable)"
}

Ensure your responses are tailored to MENA businesses expanding to the US market.
`;

/**
 * Perform an intelligent search using Pollinations API
 */
export const intelliSearch = async (
  query: string, 
  options: IntelliSearchOptions = defaultOptions
): Promise<IntelliSearchResult[]> => {
  const cacheKey = `${query}-${options.context}-${options.limit}`;
  
  // Check cache first if enabled
  if (options.cacheResults) {
    const cached = searchCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log(`Using cached results for intelligent search: ${query}`);
      return cached.results;
    }
  }
  
  try {
    // Prepare the search context
    const contextMessage = options.context 
      ? `Consider this additional context: ${options.context}`
      : '';
    
    // Use Pollinations API to get intelligent search results
    const response = await callPollinationsChat({
      systemPrompt: INTELLISEARCH_SYSTEM_PROMPT,
      userMessages: [`Search query: ${query}\n${contextMessage}`],
      temperature: 0.3,
      responseFormat: { type: "json_object" }
    });
    
    // Parse the response
    let results: IntelliSearchResult[] = [];
    try {
      const parsedResponse = JSON.parse(response);
      if (Array.isArray(parsedResponse)) {
        results = parsedResponse.slice(0, options.limit);
      } else {
        console.error('Unexpected response format from Pollinations API:', response);
      }
    } catch (error) {
      console.error('Error parsing IntelliSearch results:', error);
    }
    
    // Cache results if enabled
    if (options.cacheResults) {
      searchCache.set(cacheKey, {
        results,
        timestamp: Date.now()
      });
    }
    
    return results;
  } catch (error) {
    console.error('IntelliSearch error:', error);
    return [];
  }
};

// Helper for React Server Components
import { cache } from 'react';
export const cachedIntelliSearch = cache(intelliSearch);
