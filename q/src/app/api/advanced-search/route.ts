import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { callPollinationsChat } from '../../../lib/pollinationsApi';

/**
 * Advanced Search API Route
 * 
 * This API implements a comprehensive search workflow that:
 * 1. Takes a user query
 * 2. Optionally generates sub-queries to gather diverse information
 * 3. Uses searchgpt model to perform web searches for each query
 * 4. Synthesizes results into a comprehensive answer using openai-large
 */

// Response interfaces
interface AdvancedSearchResponse {
  success: boolean;
  synthesizedAnswer?: string;
  error?: string;
  metadata?: {
    searchQueries: string[];
    executionTimeMs: number;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Parse and validate request body
    const body = await req.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A valid search query is required' 
        },
        { status: 400 }
      );
    }

    const userQuery = query.trim();
    console.log(`Advanced Search query: "${userQuery}"`);
    
    // Step 1: Generate sub-queries to diversify search (optional)
    let searchQueries: string[] = [];
    try {
      // System prompt for generating diverse sub-queries
      const subQuerySystemPrompt = `
        You are a search query expansion expert. Your task is to take a user's main query and create 3 related 
        but diverse sub-queries that will help gather comprehensive information on the topic.
        
        Generate sub-queries that:
        1. Explore different aspects of the main query
        2. Use different keywords and phrasings
        3. Are specific and web-search friendly
        
        Return ONLY the 3 sub-queries as a JSON array of strings without any explanation or introduction.
        Format: ["sub-query 1", "sub-query 2", "sub-query 3"]
      `;
      
      const subQueryResponse = await callPollinationsChat(
        [{ role: 'user', content: `Generate 3 diverse search queries related to: "${userQuery}"` }],
        'openai', // Using a fast model for this step
        subQuerySystemPrompt,
        false
      );
      
      // Parse the response to extract the sub-queries
      if (subQueryResponse && subQueryResponse.choices && subQueryResponse.choices.length > 0) {
        const content = subQueryResponse.choices[0].message.content;
        try {
          // Attempt to parse the response as JSON
          searchQueries = JSON.parse(content);
          console.log("Generated sub-queries:", searchQueries);
        } catch (error) {
          // If parsing fails, extract queries using regex
          console.warn("Failed to parse sub-queries as JSON, falling back to regex extraction");
          const matches = content.match(/"([^"]+)"/g);
          if (matches && matches.length > 0) {
            searchQueries = matches.map(m => m.replace(/"/g, ''));
            console.log("Extracted sub-queries using regex:", searchQueries);
          }
        }
      }
    } catch (error) {
      console.error("Error generating sub-queries:", error);
      // Fall back to using the original query if sub-query generation fails
    }
    
    // If sub-query generation failed or returned empty results, use the original query
    if (!searchQueries || searchQueries.length === 0) {
      console.log("Using original query as fallback");
      searchQueries = [userQuery, `${userQuery} latest information`, `${userQuery} comprehensive guide`];
    }
    
    // Step 2: Perform web searches using searchgpt model for each query
    let aggregatedContext = '';
    
    // Execute searches in parallel for efficiency
    const searchResults = await Promise.allSettled(
      searchQueries.map(async (searchQuery, index) => {
        try {
          console.log(`Executing search ${index + 1}/${searchQueries.length}: "${searchQuery}"`);
          
          // Use the searchgpt model to perform the web search
          const searchResponse = await callPollinationsChat(
            [{ role: 'user', content: searchQuery }],
            'searchgpt', // Using the specialized web search model
            'You are an expert web researcher. Perform a comprehensive web search on the query and return detailed, accurate information with source citations where possible. Include recent and relevant information.',
            false
          );
          
          // Extract the content from the response
          if (searchResponse && searchResponse.choices && searchResponse.choices.length > 0) {
            const content = searchResponse.choices[0].message.content;
            return {
              query: searchQuery,
              content: content
            };
          }
          
          throw new Error("No valid content in search response");
        } catch (error) {
          console.error(`Error in search ${index + 1} for query "${searchQuery}":`, error);
          throw error;
        }
      })
    );
    
    // Process search results and build the aggregated context
    searchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        aggregatedContext += `\n\n--- Search Result for: "${result.value.query}" ---\n\n${result.value.content}`;
      } else {
        console.warn(`Search ${index + 1} failed:`, result.reason);
      }
    });
    
    // Check if we have any context to work with
    if (!aggregatedContext.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Failed to gather information from web search.',
        metadata: {
          searchQueries,
          executionTimeMs: Date.now() - startTime
        }
      }, { status: 500 });
    }
    
    // Step 3: Synthesize the search results into a comprehensive answer
    const synthesizerSystemPrompt = `
      You are an expert research analyst AI. Your task is to synthesize the provided context, 
      gathered from web searches, into a comprehensive answer for the user's original query. 
      
      Adhere strictly to the provided context; do not add outside information or opinions. 
      Structure your answer clearly using Markdown (headings, lists, bolding).
      
      If source URLs were included in the context for specific points, cite them appropriately 
      inline or in a concluding list.
      
      Your answer should be:
      - Comprehensive and detailed
      - Well-organized with headers and sections
      - Factual and based only on the provided context
      - Formatted with Markdown for readability
    `;
    
    const synthesizerUserPrompt = `
      Original User Query: "${userQuery}"
      
      Collected Information from Web Search:
      ${aggregatedContext}
      
      Please synthesize a detailed answer based ONLY on the collected information above.
    `;
    
    try {
      console.log("Synthesizing final answer...");
      const synthesisResponse = await callPollinationsChat(
        [{ role: 'user', content: synthesizerUserPrompt }],
        'openai-large', // Using a more powerful model for synthesis
        synthesizerSystemPrompt,
        false
      );
      
      // Extract the synthesized answer
      if (synthesisResponse && synthesisResponse.choices && synthesisResponse.choices.length > 0) {
        const synthesizedAnswer = synthesisResponse.choices[0].message.content;
        
        return NextResponse.json({
          success: true,
          synthesizedAnswer,
          metadata: {
            searchQueries,
            executionTimeMs: Date.now() - startTime
          }
        });
      } else {
        throw new Error("Failed to extract synthesized answer from response");
      }
    } catch (error) {
      console.error("Error synthesizing final answer:", error);
      return NextResponse.json({
        success: false,
        error: 'Failed to synthesize search results.',
        metadata: {
          searchQueries,
          executionTimeMs: Date.now() - startTime
        }
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Advanced Search API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred processing your search.',
      metadata: {
        searchQueries: [],
        executionTimeMs: Date.now() - startTime
      }
    }, { status: 500 });
  }
} 