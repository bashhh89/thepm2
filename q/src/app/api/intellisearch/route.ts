import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define types locally instead of importing from intelliSearchService
interface IntelliSearchRequest {
  query: string;
  context?: string;
  limit?: number;
}

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

// Mock results as fallback
const getMockResults = (query: string): IntelliSearchResult[] => {
  return [
    {
      id: uuidv4(),
      title: "Market Entry Strategies for MENA Tech Companies",
      description: "A comprehensive guide to help MENA technology companies successfully enter the US market, with regulatory compliance considerations and market analysis.",
      url: "/dashboard",
      relevanceScore: 0.95,
      tags: ["Market Entry", "Technology", "Guide"],
      source: "Harvard Business Review",
      timestamp: new Date().toISOString()
    },
    {
      id: uuidv4(),
      title: "US Regulatory Compliance for MENA Businesses",
      description: "Essential regulations and compliance requirements for Middle Eastern companies entering the United States market across various industries.",
      url: "/chat",
      relevanceScore: 0.87,
      tags: ["Compliance", "Regulations", "Guide"],
      source: "U.S. Chamber of Commerce",
      timestamp: new Date().toISOString()
    },
    {
      id: uuidv4(),
      title: "Cultural Intelligence: MENA to US Business Adaptation",
      description: "Understanding cultural differences and adapting business practices when transitioning from MENA markets to United States commercial environments.",
      url: "/projects",
      relevanceScore: 0.82,
      tags: ["Culture", "Business Practices", "Adaptation"],
      source: "McKinsey Global Institute",
      timestamp: new Date().toISOString()
    },
    {
      id: uuidv4(),
      title: "US Entity Formation for MENA Companies",
      description: "Legal guide to establishing a business entity in the United States for companies from the Middle East and North Africa region.",
      url: "/products",
      relevanceScore: 0.78,
      tags: ["Legal", "Entity Formation", "Guide"],
      source: "PwC International Business",
      timestamp: new Date().toISOString()
    },
    {
      id: uuidv4(),
      title: "US-MENA Trade Agreements and Benefits",
      description: "Overview of current trade agreements between the US and MENA countries, with analysis of benefits and opportunities for business expansion.",
      url: "/dashboard",
      relevanceScore: 0.71,
      tags: ["Trade", "Agreements", "Analysis"],
      source: "World Trade Organization",
      timestamp: new Date().toISOString()
    }
  ];
};

// Mock synthesis for fallback
const getMockSynthesis = (query: string): string => {
  return `# Key Insights on US Market Entry for MENA Companies

Based on the search results, here are the most important factors for MENA businesses entering the US market:

## Regulatory Compliance
MENA companies must navigate complex US regulations that vary by industry [Source 2]. Key considerations include:
- Federal, state, and local compliance requirements
- Industry-specific regulations (especially stringent for financial and healthcare sectors)
- Data privacy and security compliance (GDPR equivalents)

## Market Entry Strategies
The most successful approaches for MENA companies [Source 1] include:
- Strategic partnerships with established US companies
- Acquisition of smaller US businesses in the same sector
- Gradual market entry starting with East or West Coast hubs

## Cultural Adaptation
Business success requires understanding cultural differences [Source 3]:
- More direct communication styles in US business settings
- Different negotiation expectations and meeting protocols
- Importance of building relationships differently than in MENA regions

## Legal Considerations
When establishing a US entity [Source 4]:
- LLC structures offer flexibility for most MENA companies
- Consider tax implications between US and home country
- Intellectual property protection strategies are essential

## Trade Advantages
Current trade agreements [Source 5] provide several benefits:
- Reduced tariffs in certain sectors
- Simplified import/export procedures
- Investment protections for qualifying businesses

These insights should provide a solid foundation for developing your US market entry strategy.`;
};

// Note: The export needs to be named 'POST' exactly for Next.js API routes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as IntelliSearchRequest;
    const { query, context, limit = 5 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    console.log(`IntelliSearch query: "${query}" with context: "${context || ''}"`);
    
    // Use mock results only to avoid dependencies that might cause issues
    const mockResults = getMockResults(query);
    const mockSynthesis = getMockSynthesis(query);
    
    return NextResponse.json({
      results: mockResults.slice(0, limit),
      aiSynthesis: mockSynthesis
    });
  } catch (error: any) {
    console.error('IntelliSearch error:', error);
    return NextResponse.json({ 
      error: 'Search failed', 
      message: error.message 
    }, { status: 500 });
  }
} 