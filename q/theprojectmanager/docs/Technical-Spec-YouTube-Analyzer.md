# Technical Specification: YouTube Marketing Video Analyzer

## Overview

The YouTube Marketing Video Analyzer is a feature that extracts and analyzes the transcripts of YouTube marketing videos to provide actionable insights for MENA businesses targeting the US market. The system uses AI to identify marketing pitfalls and provide constructive criticism.

## Architecture

The feature follows a standard client-server architecture:

```
┌─────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  React UI   │ ──── │  Next.js API    │ ──── │  YouTube API    │
│  Component  │      │  Endpoint       │      │  (Transcript)   │
└─────────────┘      └─────────────────┘      └─────────────────┘
                            │
                            │
                     ┌─────────────────┐
                     │  Pollinations   │
                     │  LLM API        │
                     └─────────────────┘
```

## API Endpoints

### `POST /api/analyze-marketing-video`

Analyzes a YouTube marketing video based on the provided product description and YouTube URL.

#### Request Parameters

| Parameter          | Type   | Required | Description                                     |
|--------------------|--------|----------|-------------------------------------------------|
| productDescription | string | Yes      | Description of the user's product or service    |
| youtubeUrl         | string | Yes      | URL of the YouTube video to analyze             |

#### Response

| Field   | Type    | Description                                        |
|---------|---------|---------------------------------------------------|
| success | boolean | Indicates whether the operation was successful     |
| advice  | string  | The detailed analysis of the marketing video       |
| videoId | string  | The extracted YouTube video ID for embedding       |
| error   | string  | Error message (only present if success is false)   |

#### Status Codes

- `200 OK`: Request successful, analysis returned
- `400 Bad Request`: Missing parameters or invalid YouTube URL
- `500 Internal Server Error`: Server-side error during processing

#### Example Request

```json
{
  "productDescription": "Our Smart Abaya is a traditional Middle Eastern garment with integrated technology.",
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

#### Example Response (Success)

```json
{
  "success": true,
  "advice": "The competitor's marketing video focuses on technology but lacks emotional connection...",
  "videoId": "dQw4w9WgXcQ"
}
```

#### Example Response (Error)

```json
{
  "error": "Failed to fetch transcript. The video may not have captions, or they might be disabled."
}
```

## Components

### 1. API Route (`/api/analyze-marketing-video/route.ts`)

- **Purpose**: Backend API endpoint for processing YouTube video analysis requests
- **Key Functions**:
  - `extractYoutubeVideoId`: Extracts the video ID from a YouTube URL
  - `fetchYoutubeTranscript`: Fetches the transcript using a public API
  - `POST`: Main request handler that orchestrates the analysis process

### 2. UI Component (`/components/tools/MarketingAnalyzer.tsx`)

- **Purpose**: Interactive interface for users to input and receive analysis
- **State Management**:
  - `productDescription`: User's product description
  - `youtubeUrl`: YouTube URL to analyze
  - `isAnalyzing`: Loading state indicator
  - `result`: Analysis results
  - `error`: Error state
- **Key Functions**:
  - `handleAnalyzeVideo`: Manages form submission and API calls
  - `formatAnalysis`: Formats the analysis for display

### 3. Page Component (`/app/tools/marketing-analyzer/page.tsx`)

- **Purpose**: Container page for the Marketing Analyzer feature
- **Metadata**: Page title and description for SEO
- **Rendering**: Server-side rendered page with client-side interactivity

## Dependencies

### External APIs

- **YouTube Transcript API**: Accessed via `youtubetranscript.com` (public endpoint)
- **Pollinations API**: Used for LLM capabilities via `callPollinationsChat` function

### NPM Packages

- **axios**: For HTTP requests to external APIs
- **react**: For UI component implementation
- **next**: For API routes and server-side rendering
- **lucide-react**: For UI icons

## Data Flow

1. User enters product description and YouTube URL in the UI
2. UI sends a POST request to `/api/analyze-marketing-video`
3. API extracts the YouTube video ID from the URL
4. API fetches the transcript using the YouTube transcript API
5. API prepares a system prompt with the user's product description
6. API calls the Pollinations LLM API with the transcript and prompt
7. API formats and returns the analysis results
8. UI displays the formatted analysis to the user

## Security Considerations

### Input Validation

- Validate that `productDescription` is provided and is a string
- Validate that `youtubeUrl` is provided and is a valid YouTube URL
- Sanitize inputs to prevent XSS attacks

### Error Handling

- Implement comprehensive error handling throughout the process
- Avoid exposing sensitive details in error messages
- Log errors server-side for debugging

### Rate Limiting

- Consider implementing rate limiting for the API endpoint
- Limit the number of requests per user per hour to prevent abuse

## Performance Considerations

### Caching

- Consider caching transcript extraction results by video ID
- Implement caching at the API level for repeated requests

### Progressive Loading

- Implement proper loading states in the UI during analysis
- Consider skeleton UI for better user experience during loading

## Testing Strategy

### Unit Tests

- Test the `extractYoutubeVideoId` function with various URL formats
- Test error handling in the API route
- Test UI component rendering in different states

### Integration Tests

- Test the complete data flow from UI to API and back
- Test error scenarios and handling

### Manual Testing

- Test with videos of varying lengths and qualities
- Test with videos in different languages
- Test with different product descriptions

## Implementation Timeline

| Phase | Description | Estimated Duration |
|-------|-------------|-------------------|
| 1     | Create API endpoint | 1 day |
| 2     | Implement UI component | 1 day |
| 3     | Create page component | 0.5 day |
| 4     | Testing and refinement | 1 day |
| 5     | Documentation | 0.5 day |

## Future Enhancements

- Implement support for more video platforms beyond YouTube
- Add ability to save analyses to projects
- Enable batch analysis of multiple videos
- Implement more sophisticated transcript handling for better results
- Add support for non-English videos with translation
- Integrate with the project management feature for better workflow

## Monitoring and Maintenance

- Log API usage metrics for feature adoption tracking
- Monitor error rates, especially for transcript extraction
- Track LLM API usage for cost management
- Regularly validate the YouTube transcript API endpoint functionality 