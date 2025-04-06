# YouTube Marketing Video Analyzer

## Overview
The YouTube Marketing Video Analyzer is a tool designed to help MENA businesses entering the US market learn from competitor marketing videos. It analyzes transcripts from YouTube videos and provides detailed feedback on marketing pitfalls to avoid.

## Key Features
- Extract and analyze transcripts from any YouTube video
- AI-powered critical analysis of competitor marketing strategies
- Identification of specific pitfalls in the competitor's approach
- Actionable advice tailored to your product/service
- Cultural context adaptation for MENA-to-US market entry

## How It Works
1. **Enter Your Product Description**: Provide details about your product or service
2. **Input Competitor YouTube URL**: Paste a link to a competitor's marketing video
3. **Get Analysis**: Receive detailed feedback on pitfalls to avoid and how to improve your own marketing efforts

## Implementation Details

### API Endpoint
A dedicated API endpoint (`/api/analyze-marketing-video`) processes requests and returns detailed analysis results.

#### Request Format
```json
{
  "productDescription": "Your product description text here",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

#### Response Format
```json
{
  "success": true,
  "advice": "Detailed analysis text here...",
  "videoId": "VIDEO_ID"
}
```

### Technical Components

#### YouTube Transcript Extraction
The system extracts transcripts from YouTube videos using a public API endpoint. The transcript provides the raw content for analysis.

#### Critical Marketing Analysis
The core of this feature is the "Critical Marketing Analyst" AI agent which provides specialized analysis of marketing content. The system prompt directs the AI to focus on:

- Clarity of value proposition
- Target audience alignment
- Emotional appeal
- Call to action effectiveness
- Unique selling proposition articulation
- Technical jargon/complexity level
- Cultural sensitivity for MENA to US marketing
- Competitive positioning

#### User Interface Integration
The feature is available through a dedicated page at `/tools/marketing-analyzer` and includes:
- Input fields for product description and YouTube URL
- Real-time analysis with loading states
- Embedded YouTube player for the analyzed video
- Formatted analysis results with clear sections

## Usage Examples

### Market Entry Strategy
Analyze US competitors' marketing videos to understand how they present similar products/services and identify gaps or weaknesses in their messaging.

### Product Messaging Refinement
Refine your product messaging by understanding how competitors position themselves and what resonates with US audiences.

### Culturally-Aware Content Creation
Create marketing content that avoids cultural misunderstandings by learning from both successful and unsuccessful competitor approaches.

## Technical Integration

### Dependencies
- Next.js API routes
- Pollinations API for LLM capabilities
- Axios for HTTP requests
- React for frontend components

### Location in Codebase
- API Route: `/src/app/api/analyze-marketing-video/route.ts`
- UI Component: `/src/components/tools/MarketingAnalyzer.tsx`
- Page Component: `/src/app/tools/marketing-analyzer/page.tsx`

## Future Enhancements
- Save analyses to projects
- Compare multiple competitors
- Export analysis reports
- Enhanced transcript parsing capabilities
- User-adjustable analysis parameters 