import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { callPollinationsChat } from '../../../lib/pollinationsApi';

/**
 * Enhanced Advanced Search API Route
 * 
 * This API implements a comprehensive search workflow that:
 * 1. Takes a user query and optional context
 * 2. Optionally generates sub-queries to gather diverse information
 * 3. Uses searchgpt model to perform web searches for each query
 * 4. Synthesizes results into a comprehensive answer using openai-large
 * 5. Provides metadata and suggested follow-up questions
 */

// Types
type ContextData = {
  goal?: string;  // research goal (business-formation, market-research, etc.)
  location?: string;  // geographic region/location
  businessType?: string;  // LLC, Corporation, etc.
  industry?: string;  // Technology, Retail, etc.
  priorQueries?: string[];  // previous queries in this conversation
};

// Response interfaces
interface AdvancedSearchResponse {
  success: boolean;
  synthesizedAnswer?: string;
  error?: string;
  metadata?: {
    searchQueries: string[];
    executionTimeMs: number;
    contextUsed?: ContextData;
    suggestedFollowups?: string[];
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Parse and validate request body
    const body = await req.json();
    const { query, context } = body;
    
    // Extract context data for enhanced search
    const contextData: ContextData = context || {};
    
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
    console.log(`Advanced Search query: "${userQuery}" with context:`, contextData);
    
    // Enhance the query based on context
    const enhancedQuery = enhanceQueryWithContext(userQuery, contextData);
    console.log(`Enhanced query: "${enhancedQuery}"`);
    
    // Step 1: Generate sub-queries to diversify search (optional)
    let searchQueries: string[] = [];
    try {
      // System prompt for generating diverse sub-queries
      const subQuerySystemPrompt = `
        You are a search query expansion expert. Your task is to take a user's main query and create 3 related 
        but diverse sub-queries that will help gather comprehensive information on the topic.
        
        Context information: ${JSON.stringify(contextData)}
        
        Generate sub-queries that:
        1. Explore different aspects of the main query
        2. Use different keywords and phrasings
        3. Are specific and web-search friendly
        4. Take into account the user's context information
        
        Return ONLY the 3 sub-queries as a JSON array of strings without any explanation or introduction.
        Format: ["sub-query 1", "sub-query 2", "sub-query 3"]
      `;
      
      const subQueryResponse = await callPollinationsChat(
        [{ role: 'user', content: `Generate 3 diverse search queries related to: "${enhancedQuery}"` }],
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
      searchQueries = [enhancedQuery, `${enhancedQuery} latest information`, `${enhancedQuery} comprehensive guide`];
    }
    
    // Step 2: Perform web searches using searchgpt model for each query
    let aggregatedContext = '';
    
    // Execute searches in parallel for efficiency
    const searchResults = await Promise.allSettled(
      searchQueries.map(async (searchQuery, index) => {
        try {
          console.log(`Executing search ${index + 1}/${searchQueries.length}: "${searchQuery}"`);
          
          // Customize the search system prompt based on the goal
          let searchSystemPrompt = 'You are an expert web researcher. Perform a comprehensive web search on the query and return detailed, accurate information with source citations where possible. Include recent and relevant information.';
          
          // Add context-specific guidance to the system prompt
          if (contextData.goal === 'business-formation') {
            searchSystemPrompt += ' Focus on legal requirements, costs, processes, and best practices for business formation. Include information about registration, licenses, and tax implications.';
          } else if (contextData.goal === 'competitive-analysis') {
            searchSystemPrompt += ' Focus on market players, competitive landscape, market shares, strengths and weaknesses of key companies, and recent market developments.';
          } else if (contextData.goal === 'market-research') {
            searchSystemPrompt += ' Focus on market size, growth trends, customer segments, needs, preferences, and opportunities. Include data about market potential and barriers to entry.';
          }
          
          // Use the searchgpt model to perform the web search
          const searchResponse = await callPollinationsChat(
            [{ role: 'user', content: searchQuery }],
            'searchgpt', // Using the specialized web search model
            searchSystemPrompt,
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
          executionTimeMs: Date.now() - startTime,
          contextUsed: contextData
        }
      }, { status: 500 });
    }
    
    // Step 3: Synthesize the search results into a comprehensive answer
    // Customize the synthesizer prompt based on the goal and context
    let synthesisInstructions = '';
    if (contextData.goal === 'business-formation') {
      synthesisInstructions = 'Organize the information into sections covering legal requirements, costs, timeline, and best practices. Highlight specific requirements if a location or business type was specified.';
    } else if (contextData.goal === 'competitive-analysis') {
      synthesisInstructions = 'Organize the information to clearly identify major competitors, their strengths/weaknesses, market shares, and competitive positioning. Include a summary of the overall competitive landscape.';
    } else if (contextData.goal === 'market-research') {
      synthesisInstructions = 'Structure the answer to cover market size, growth trends, key segments, customer needs, and opportunities. Include data points where available.';
    }
    
    const synthesizerSystemPrompt = `
      You are an expert research analyst AI. Your task is to synthesize the provided context, 
      gathered from web searches, into a comprehensive answer for the user's original query.
      
      User context: ${JSON.stringify(contextData)}
      
      Adhere strictly to the provided context; do not add outside information or opinions. 
      Structure your answer clearly using Markdown (headings, lists, bolding).
      
      ${synthesisInstructions}
      
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
      Enhanced Query: "${enhancedQuery}"
      
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
        
        // Generate suggested follow-up questions
        const suggestedFollowups = await generateFollowupQuestions(
          userQuery, 
          enhancedQuery, 
          synthesizedAnswer, 
          contextData
        );
        
        return NextResponse.json({
          success: true,
          synthesizedAnswer,
          metadata: {
            searchQueries,
            executionTimeMs: Date.now() - startTime,
            contextUsed: contextData,
            suggestedFollowups
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
          executionTimeMs: Date.now() - startTime,
          contextUsed: contextData
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

/**
 * Enhances a user query with contextual information
 */
function enhanceQueryWithContext(query: string, context: ContextData): string {
  let enhancedQuery = query;
  
  // Add location context if available
  if (context.location && !query.toLowerCase().includes(context.location.toLowerCase())) {
    enhancedQuery += ` in ${context.location}`;
  }
  
  // Add business type context if available and relevant
  if (context.businessType && context.goal === 'business-formation' && 
      !query.toLowerCase().includes(context.businessType.toLowerCase())) {
    enhancedQuery += ` for ${context.businessType} business`;
  }
  
  // Add industry context if available
  if (context.industry && !query.toLowerCase().includes(context.industry.toLowerCase())) {
    enhancedQuery += ` in the ${context.industry} industry`;
  }
  
  // Add goal-specific enhancements
  if (context.goal === 'business-formation' && 
      !query.toLowerCase().includes('formation') && 
      !query.toLowerCase().includes('establish') &&
      !query.toLowerCase().includes('start')) {
    enhancedQuery += ' business formation process';
  } else if (context.goal === 'competitive-analysis' && 
            !query.toLowerCase().includes('competitor') && 
            !query.toLowerCase().includes('competition')) {
    enhancedQuery += ' competitive landscape analysis';
  } else if (context.goal === 'market-research' && 
            !query.toLowerCase().includes('market')) {
    enhancedQuery += ' market analysis';
  }
  
  return enhancedQuery;
}

/**
 * Generates suggested follow-up questions based on the search results and context
 */
async function generateFollowupQuestions(
  originalQuery: string, 
  enhancedQuery: string, 
  answer: string, 
  context: ContextData
): Promise<string[]> {
  // Default follow-ups if generation fails
  const defaultFollowups = [
    'Can you provide more specific details about this topic?',
    'What are the next steps I should take?',
    'Are there any alternatives I should consider?'
  ];
  
  try {
    const followupSystemPrompt = `
      You are an expert research assistant. Based on the user's query and the answer they received,
      generate 3 highly relevant follow-up questions that would help them explore the topic further.
      
      The questions should:
      1. Address different aspects not fully covered in the answer
      2. Help the user take next steps with the information
      3. Be specific and actionable
      4. Take into account the user's context: ${JSON.stringify(context)}
      
      Return ONLY the 3 questions as a JSON array of strings without any explanation.
      Format: ["Question 1?", "Question 2?", "Question 3?"]
    `;
    
    const followupUserPrompt = `
      Original User Query: "${originalQuery}"
      Enhanced Query: "${enhancedQuery}"
      
      Answer they received: 
      ${answer.substring(0, 1000)}... [truncated for brevity]
      
      Generate 3 follow-up questions they should ask next.
    `;
    
    const followupResponse = await callPollinationsChat(
      [{ role: 'user', content: followupUserPrompt }],
      'openai', // Using a faster model for this
      followupSystemPrompt,
      false
    );
    
    if (followupResponse && followupResponse.choices && followupResponse.choices.length > 0) {
      const content = followupResponse.choices[0].message.content;
      try {
        // Attempt to parse the response as JSON
        const followups = JSON.parse(content);
        if (Array.isArray(followups) && followups.length > 0) {
          return followups;
        }
      } catch (error) {
        // If parsing fails, extract questions using regex
        console.warn("Failed to parse follow-up questions as JSON, falling back to regex extraction");
        const matches = content.match(/"([^"]+\?)"?/g);
        if (matches && matches.length > 0) {
          return matches.map(m => m.replace(/"/g, ''));
        }
      }
    }
    
    // Return default followups if generation failed
    return defaultFollowups;
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return defaultFollowups;
  }
} 