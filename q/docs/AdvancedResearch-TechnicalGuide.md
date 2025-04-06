# Advanced Research
## Technical Implementation Guide

This document provides technical details for developers working with the Advanced Research feature, including architecture, components, API contracts, and implementation guidelines.

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      Client Browser                         │
│                                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   Next.js Application                       │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐│
│  │AdvancedSearchUI│    │advanced-search│    │Pollinations   ││
│  │  Component    │◄──►│    API Route  │◄──►│API Integration││
│  └───────────────┘    └───────────────┘    └───────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  External Services                          │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐│
│  │   SearchGPT   │    │ OpenAI/Other  │    │   Web Search  ││
│  │    Model      │    │  LLM Models   │    │   Services    ││
│  └───────────────┘    └───────────────┘    └───────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. Frontend Component (`AdvancedSearchUI.tsx`)

Location: `src/components/search/AdvancedSearchUI.tsx`

Key Features:
- Goal selection wizard
- Conversation management
- Context tracking
- Result rendering with Markdown
- Copy functionality

#### 2. API Route (`route.ts`)

Location: `src/app/api/advanced-search/route.ts`

Main Functions:
- Request/response handling
- Query enhancement
- Multi-step search process
- Result synthesis
- Follow-up question generation

#### 3. Pollinations API Integration

Location: `src/lib/pollinationsApi.ts`

Functionality:
- Model selection logic
- SearchGPT capabilities
- Error handling
- Rate limiting management

### API Contracts

#### Advanced Search API Request

```typescript
// POST /api/advanced-search
interface AdvancedSearchRequest {
  query: string;
  context?: {
    goal?: string;  // business-formation, market-research, etc.
    location?: string;
    businessType?: string;
    industry?: string;
    priorQueries?: string[];
  };
}
```

#### Advanced Search API Response

```typescript
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
```

### Environment Configuration

Required environment variables:
```
POLLINATIONS_API_KEY=your-api-key-here
```

Optional configuration:
```
MAX_SEARCH_QUERIES=3  # Number of parallel searches to perform
SYNTHESIS_MODEL=openai-large  # Model for result synthesis
QUERY_EXPANSION_MODEL=openai  # Model for generating search sub-queries
```

### Key Implementation Details

#### Context Extraction

The system extracts context from user messages using pattern matching:

```typescript
// Location extraction
const locationMatch = message.match(/\b(?:in|at|near|for)\s+([A-Za-z\s,]+)(?:\b|$)/i);
if (locationMatch && locationMatch[1] && locationMatch[1].length > 2) {
  setSearchContext(prev => ({ ...prev, location: locationMatch[1].trim() }));
}

// Business type extraction
const businessTypeMatch = message.match(/\b(?:LLC|Corporation|Inc|Sole Proprietorship|Partnership|S-Corp|C-Corp)\b/i);
if (businessTypeMatch && businessTypeMatch[0]) {
  setSearchContext(prev => ({ ...prev, businessType: businessTypeMatch[0] }));
}
```

#### Query Enhancement

Queries are enhanced based on the goal and extracted context:

```typescript
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
  }
  
  return enhancedQuery;
}
```

#### System Prompts

Different system prompts are used for each stage of the process:

1. **Sub-query Generation**:
```
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
```

2. **Search Execution**:
```
You are an expert web researcher. Perform a comprehensive web search on the query and return detailed, 
accurate information with source citations where possible. Include recent and relevant information.

[Goal-specific additions based on research type]
```

3. **Result Synthesis**:
```
You are an expert research analyst AI. Your task is to synthesize the provided context, 
gathered from web searches, into a comprehensive answer for the user's original query.

User context: ${JSON.stringify(contextData)}

Adhere strictly to the provided context; do not add outside information or opinions. 
Structure your answer clearly using Markdown (headings, lists, bolding).

[Goal-specific formatting instructions]

If source URLs were included in the context for specific points, cite them appropriately 
inline or in a concluding list.

Your answer should be:
- Comprehensive and detailed
- Well-organized with headers and sections
- Factual and based only on the provided context
- Formatted with Markdown for readability
```

### Error Handling

The system handles several types of errors:

1. **API Failures**: When external API calls fail, provide fallback mechanisms
2. **Query Timeout**: Handle long-running searches gracefully
3. **Result Synthesis Errors**: Provide partial results when full synthesis fails
4. **Context Extraction Failures**: Use default contexts when pattern matching fails

Example error handling pattern:
```typescript
try {
  // API call or processing logic
} catch (error) {
  console.error("Error in process:", error);
  
  // Provide fallback behavior
  if (fallbackAvailable) {
    return fallbackResult;
  }
  
  // Return error information to client
  return {
    success: false,
    error: error.message || "An unexpected error occurred",
    metadata: {
      // Include partial metadata if available
    }
  };
}
```

### Performance Optimization

1. **Parallel Search Execution**
```typescript
const searchResults = await Promise.allSettled(
  searchQueries.map(async (searchQuery, index) => {
    // Execute search for each query in parallel
  })
);
```

2. **Model Selection**
- Use smaller, faster models for query expansion
- Use specialized models (SearchGPT) for search operations
- Use larger models only for final synthesis

3. **Response Streaming**
- Consider implementing streaming for large responses

### Testing

Key test scenarios:
1. Goal selection and initial prompting
2. Context extraction from user messages
3. Query enhancement logic
4. API integration with search services
5. Synthesis and formatting
6. Error handling and fallbacks

### Deployment Considerations

1. **API Rate Limits**
- Monitor usage of external APIs
- Implement rate limiting and queueing if necessary

2. **Caching**
- Consider caching common searches
- Implement context persistence for longer sessions

3. **Monitoring**
- Track performance metrics
- Monitor error rates and types

### Extension Points

1. **New Research Goals**
   Add new goals by extending the `SEARCH_GOALS` array and implementing goal-specific system prompts

2. **Additional Context Types**
   Extend the `ContextData` type and add new extraction patterns

3. **Custom Result Formatting**
   Modify the synthesis system prompt to change result formatting

4. **Alternative Search Providers**
   The architecture supports swapping SearchGPT with other search providers

### Related Documentation

- [Pollinations API Documentation](https://docs.pollinations.ai)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Markdown](https://github.com/remarkjs/react-markdown)

### Support

For technical assistance, contact the development team at dev@qanduai.com or open an issue in the repository. 