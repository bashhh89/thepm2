# Implementation Guide: YouTube Marketing Video Analyzer

This guide explains how to implement the YouTube Marketing Video Analyzer feature in the QanDu AI platform. This feature enables users to analyze competitor marketing videos and identify pitfalls to avoid in their own marketing.

## Architecture Overview

The feature consists of three main components:

1. **API Backend** (`/api/analyze-marketing-video/route.ts`)
2. **UI Component** (`/components/tools/MarketingAnalyzer.tsx`)
3. **Page Component** (`/app/tools/marketing-analyzer/page.tsx`)

## Step 1: Create the API Endpoint

Create a new file at `src/app/api/analyze-marketing-video/route.ts` with the following code:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { callPollinationsChat } from '@/lib/pollinationsApi';

// Function to extract YouTube video ID from URL
function extractYoutubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Function to fetch transcript from a YouTube video
async function fetchYoutubeTranscript(videoId: string): Promise<string> {
  try {
    // Using the public YouTube transcript API endpoint
    const response = await axios.get(`https://youtubetranscript.com/?v=${videoId}`);
    
    // Parse the response to extract transcript text
    if (response.data) {
      // The API returns HTML, so we need to extract the text
      // This is a simplified approach; you may need to refine this based on the actual response format
      const transcript = response.data;
      return typeof transcript === 'string' ? transcript : JSON.stringify(transcript);
    }
    
    throw new Error('Failed to retrieve transcript data');
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error);
    throw new Error('Failed to fetch transcript. The video may not have captions, or they might be disabled.');
  }
}

// Critical Marketing Analyst system prompt
const CRITICAL_MARKETING_ANALYST_PROMPT = `
You are the "Critical Marketing Analyst" - an AI agent specialized in critically analyzing marketing videos and providing constructive criticism.

CONTEXT:
The user is trying to create their own marketing video but wants to learn from competitors' mistakes. They've provided:
1. A description of their own product
2. A transcript from a competitor's marketing video

YOUR TASK:
Analyze the competitor's video transcript and identify potential pitfalls, weaknesses, or ineffective strategies that the user should avoid when creating their own marketing materials.

ANALYSIS REQUIREMENTS:
1. Focus on SPECIFIC pitfalls in the competitor's marketing approach, not generic advice
2. For each pitfall identified, provide:
   - A clear description of the issue
   - Why it's problematic for effective marketing
   - Specific advice on how to avoid this issue
3. Consider these aspects:
   - Clarity of value proposition
   - Target audience alignment
   - Emotional appeal
   - Call to action effectiveness
   - Unique selling proposition articulation
   - Technical jargon/complexity level
   - Cultural sensitivity for MENA to US marketing
   - Competitive positioning

USER'S PRODUCT:
[User's Product Description]

FORMAT YOUR RESPONSE:
1. Brief summary of the competitor's overall approach (1-2 sentences)
2. Identified pitfalls (at least 3-5 specific issues)
3. Conclusion with most important takeaway

Remember: Be honest but constructive. The goal is to help the user create MORE EFFECTIVE marketing by learning from competitors' mistakes.
`;

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { productDescription, youtubeUrl } = body;
    
    // Validate request parameters
    if (!productDescription) {
      return NextResponse.json(
        { error: 'Product description is required' },
        { status: 400 }
      );
    }
    
    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }
    
    // Extract YouTube video ID
    const videoId = extractYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }
    
    // Fetch the transcript
    let transcript: string;
    try {
      transcript = await fetchYoutubeTranscript(videoId);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch transcript' },
        { status: 500 }
      );
    }
    
    // Prepare system prompt with the user's product description
    const systemPrompt = CRITICAL_MARKETING_ANALYST_PROMPT.replace(
      '[User\'s Product Description]', 
      productDescription
    );
    
    // Prepare user message with the transcript
    const userMessage = `Here is the transcript from the competitor's marketing video:\n\n${transcript}\n\nPlease analyze this and identify the marketing pitfalls to avoid.`;
    
    // Call the LLM API via Pollinations
    try {
      const apiResponse = await callPollinationsChat(
        [{ role: 'user', content: userMessage }],
        'openai-large', // Using GPT-4o for better analysis
        systemPrompt,
        false
      );
      
      // Extract the response content
      let advice: string;
      if (typeof apiResponse === 'string') {
        advice = apiResponse;
      } else if (apiResponse.choices && apiResponse.choices.length > 0) {
        advice = apiResponse.choices[0].message.content;
      } else {
        throw new Error('Unexpected API response format');
      }
      
      // Return the analysis
      return NextResponse.json({
        success: true,
        advice,
        videoId, // Return the video ID for potential embedding on the frontend
      });
      
    } catch (error: any) {
      console.error('Error calling LLM API:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to analyze transcript' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in analyze-marketing-video API:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

## Step 2: Create the UI Component

Create a new file at `src/components/tools/MarketingAnalyzer.tsx` with the following code:

```typescript
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, FileAnalytics, Loader2, Youtube } from "lucide-react";

interface MarketingAnalysisResult {
  success: boolean;
  advice: string;
  videoId: string;
  error?: string;
}

export default function MarketingAnalyzer() {
  const [productDescription, setProductDescription] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<MarketingAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleAnalyzeVideo = async () => {
    if (!productDescription.trim()) {
      setError('Please enter your product description');
      return;
    }

    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }

    // Clear previous results and errors
    setResult(null);
    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-marketing-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productDescription,
          youtubeUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze video');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to format the analysis text with proper headings and spacing
  const formatAnalysis = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.match(/^[0-9]+\.\s+/) || line.match(/^[A-Z][A-Za-z\s]+:/)) {
          // If line starts with a number followed by period and space, or
          // if line starts with capital letter followed by letters/spaces and a colon,
          // make it a heading
          return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line}</h3>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="mb-2">{line}</p>;
        }
      });
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAnalytics className="h-6 w-6" />
            Critical Marketing Analyst
          </CardTitle>
          <CardDescription>
            Analyze competitor marketing videos and learn what pitfalls to avoid in your own marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="productDescription" className="block text-sm font-medium mb-1">
                Your Product Description
              </label>
              <Textarea
                id="productDescription"
                placeholder="Describe your product or service in detail..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide clear details about your product's features, benefits, and target audience
              </p>
            </div>

            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium mb-1">
                Competitor YouTube Video URL
              </label>
              <Input
                id="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="mb-1"
              />
              <p className="text-xs text-muted-foreground">
                Enter a YouTube URL of a competitor's marketing video
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && result.success && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Marketing Analysis</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {formatAnalysis(result.advice)}
                </div>
                
                {result.videoId && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Analyzed Video</h3>
                    <div className="aspect-video w-full max-w-xl">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${result.videoId}`} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleAnalyzeVideo} 
            disabled={isAnalyzing}
            className="w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Video...
              </>
            ) : (
              <>
                <Youtube className="mr-2 h-4 w-4" />
                Analyze Video
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

## Step 3: Create the Page Component

Create a new file at `src/app/tools/marketing-analyzer/page.tsx` with the following code:

```typescript
import MarketingAnalyzer from "@/components/tools/MarketingAnalyzer";

export const metadata = {
  title: 'Marketing Video Analyzer - QanDu AI',
  description: 'Analyze competitor marketing videos and learn what pitfalls to avoid in your own marketing'
};

export default function MarketingAnalyzerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketing Video Analyzer</h1>
        <p className="text-muted-foreground">
          Learn from competitors' mistakes and improve your marketing strategy
        </p>
      </div>
      
      <MarketingAnalyzer />
    </div>
  );
}
```

## Step 4: Update Navigation (Optional)

Consider adding the Marketing Analyzer to your site navigation:

1. Add a new link in the sidebar or header navigation component
2. Point to `/tools/marketing-analyzer`
3. Use an appropriate icon (like `Youtube` or `FileAnalytics` from Lucide)

## Implementation Notes

### Transcript API Considerations

The current implementation uses a public YouTube transcript API (`youtubetranscript.com`). In a production environment, you might want to:

1. Implement a more robust transcript extraction method
2. Consider using an official YouTube API with proper authentication
3. Add caching to improve performance for repeated analyses of the same video

### Error Handling

The implementation includes comprehensive error handling:

- Validation of input parameters
- Handling of missing or invalid YouTube URLs
- Error management during transcript fetching
- Error handling for LLM API calls

### Testing

Before deploying, test the feature with various scenarios:

1. Videos with and without captions
2. Videos in different languages
3. Videos of varying lengths
4. Different types of product descriptions
5. Error scenarios (invalid URLs, API failures)

### Security Considerations

1. Validate and sanitize all user inputs
2. Consider rate limiting for the API endpoint to prevent abuse
3. Ensure proper error handling to prevent information leakage

### Performance Optimization

1. Consider caching responses for previously analyzed videos
2. Optimize transcript extraction for large videos
3. Implement progressive loading UI for better user experience

## Troubleshooting

### Common Issues

1. **Transcript Extraction Fails**: Ensure the video has captions enabled and is publicly accessible
2. **LLM API Errors**: Check the Pollinations API configuration and ensure you have the correct credentials
3. **UI Rendering Issues**: Verify that all required UI components are properly imported

### API Response Status Codes

- `200`: Success
- `400`: Bad request (missing parameters or invalid YouTube URL)
- `500`: Server error (transcript fetch failure or LLM API error)

### Debugging

For debugging issues:

1. Check browser console for frontend errors
2. Review server logs for backend issues
3. Test the transcript API endpoint directly to ensure it's working
4. Verify LLM API functionality by testing with other features that use it 