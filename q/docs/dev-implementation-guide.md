# Workspace AI Assistant: Developer Implementation Guide

This document provides technical details for developers working on the QanDu Workspace AI Assistant feature. It covers code organization, key components, and guidance for extending or modifying the system.

## Code Organization

The Workspace AI Assistant implementation is organized across several directories:

```
src/
├── components/
│   └── workspace-chat/
│       ├── WorkspaceChat.tsx      # Main chat component
│       └── OnboardingTour.tsx     # User onboarding component
├── app/
│   ├── workspace-chat/
│   │   └── page.tsx               # Chat page wrapper
│   └── api/
│       └── workspace-ai/
│           └── route.ts           # API endpoint for AI integration
├── lib/
│   ├── ai/
│   │   ├── commandParser.ts       # Parse text to structured commands
│   │   ├── actionHandler.ts       # Execute workspace commands
│   │   └── workspaceContextProvider.ts # Generate AI context 
│   └── pollinationsApi.ts         # Pollinations API client integration
└── store/
    └── workspaceChatStore.ts      # State management for chat
```

## Key Components

### 1. Frontend Chat Interface (WorkspaceChat.tsx)

The main chat interface handles:
- Displaying messages and maintaining conversation flow
- Processing user input and sending API requests
- Rendering entity-enriched responses with clickable elements
- Managing the context sidebar and suggested actions

Key functions:
- `handleSendMessage()`: Processes user input and calls the API
- `processProjectLinks()`: Detects and converts entities to clickable elements
- `updateContextEntities()`: Maintains the context sidebar with detected entities
- `updateSuggestedActions()`: Generates relevant action buttons based on message content

### 2. API Route (workspace-ai/route.ts)

The API endpoint that:
- Receives user messages and conversation history
- Generates workspace-specific context
- Parses potential commands in the message
- Executes high-confidence commands directly
- Forwards low-confidence requests to Pollinations API with context
- Formats and returns responses

Key logic flow:
1. Extract message, workspaceId, and conversation history
2. Generate workspace context
3. Parse message for commands
4. If high confidence command -> execute directly
5. If low confidence or not a command -> call Pollinations API
6. Format and return response

### 3. Command Parser (commandParser.ts)

Parses natural language into structured commands with:
- Entity type detection (project, client, task, etc.)
- Command type detection (create, update, list, etc.)
- Confidence scoring mechanism
- Parameter extraction

Command structure:
```typescript
interface ParsedCommand {
  type: CommandType;         // 'create', 'update', 'list', etc.
  entityType: EntityType;    // 'project', 'client', 'task', etc.
  entityName?: string;       // Name of the entity if applicable
  params: Record<string, any>; // Additional parameters
  confidence: number;        // 0-1 confidence score
  originalText: string;      // Original message text
}
```

### 4. Action Handler (actionHandler.ts)

Executes parsed commands against workspace data:
- Maps command types to specific action functions
- Performs database operations
- Handles errors and returns standardized results

Result structure:
```typescript
interface CommandResult {
  status: 'success' | 'error';
  message: string;
  data?: any;               // Command-specific result data
}
```

### 5. Context Provider (workspaceContextProvider.ts)

Generates AI-consumable context from workspace data:
- Fetches relevant workspace data (projects, clients, tasks)
- Formats data into prompt-friendly text
- Supports different detail levels (basic/full)

## Pollinations API Integration

The Workspace AI uses the `pollinationsApi.ts` client to communicate with the Pollinations LLM service:

```typescript
const response = await callPollinationsChat(
  messages,        // Array of chat messages (without system prompt)
  'openai',        // Model to use
  systemPrompt,    // System prompt with workspace context
  false            // Stream mode (false for standard request)
);
```

## Entity Recognition System

Entity recognition uses regex patterns to identify and highlight workspace entities:

1. **Pattern Definition**: Patterns for each entity type (projects, clients, etc.)
2. **HTML Generation**: Convert matches to styled and clickable HTML elements
3. **Processing**: Apply patterns systematically to message content

Pattern example:
```typescript
{
  type: 'project',
  pattern: /\b([A-Z][A-Za-z0-9]*)\b(?= project| Project)/g,
  replacementFn: (match) => 
    `<span class="entity-tag project-tag">
      <span class="entity-icon">📋</span>${match}
     </span>`
}
```

## State Management

Chat state is managed using the `workspaceChatStore.ts` store which:
- Maintains chat sessions per workspace
- Stores message history
- Handles chat creation and message addition
- Manages the active chat session

## Extension Points

### Adding New Command Types

To add a new command type:
1. Update `CommandType` in `commandParser.ts`
2. Add detection logic in `identifyCommandType()`
3. Implement handling in `executeAction()` in `actionHandler.ts`

### Adding New Entity Types

To add a new entity type for recognition:
1. Add a new entry to the `entityTypes` array in `processProjectLinks()`
2. Define the pattern and styling
3. Update the context sidebar to display the new entity type

### Customizing UI Components

The system uses several UI components that can be customized:
- Command suggestions in `WorkspaceChat.tsx`
- Onboarding steps in `OnboardingTour.tsx`
- Command help categories in `COMMAND_CATEGORIES`

## Testing

When testing the AI integration:
1. Verify command execution results by checking workspace data
2. Test entity recognition with various entity mention formats
3. Test with empty workspaces and workspaces containing data
4. Check error handling by forcing API errors

## Performance Considerations

1. **Regex Efficiency**: Entity recognition uses multiple regex passes
2. **Context Size**: Large workspaces generate large context prompts
3. **API Latency**: Pollinations API calls add latency to responses

## Security Considerations

1. Workspace data is exposed to the LLM - ensure sensitive data is not included
2. Command execution requires proper authorization checks
3. User input is processed by both client and server - sanitize appropriately 