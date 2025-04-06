import { NextRequest, NextResponse } from 'next/server';
import { searchWeb } from '../../../lib/search/searchService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, model, limit = 5 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required', success: false }, { status: 400 });
    }

    if (!process.env.SERPER_API_KEY) {
      return NextResponse.json({ 
        error: 'Search API key not configured',
        details: 'Please add SERPER_API_KEY to your environment variables',
        success: false
      }, { status: 500 });
    }

    console.log(`Performing web search with query: ${query} using model: ${model}`);

    const results = await searchWeb(query, { 
      limit,
      cacheResults: true
    });

    // Format the results in a way that's easy to present
    const formattedResults = results.map((result, index) => 
      `${index + 1}. [${result.title}](${result.url})\n   ${result.snippet}`
    ).join('\n\n');

    return NextResponse.json({ 
      results: formattedResults,
      rawResults: results,
      success: true
    });
  } catch (error: any) {
    console.error('Web Search API error:', error);
    return NextResponse.json({ 
      error: 'Search failed', 
      details: error.message,
      success: false
    }, { status: 500 });
  }
} 