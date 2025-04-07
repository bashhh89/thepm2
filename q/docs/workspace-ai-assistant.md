# Workspace AI Assistant Documentation

## Overview

The Workspace AI Assistant is an intelligent, context-aware chat interface integrated with QanDu workspaces. It connects to the Pollinations API to provide natural language interaction with workspace data, allowing users to query information about projects, clients, tasks, and other workspace entities.

## Features

- **Real AI Integration**: Connected to Pollinations API for intelligent responses
- **Workspace Context Awareness**: AI has access to workspace-specific data
- **Command Recognition**: Parse natural language commands and execute workspace actions
- **Entity Recognition**: Automatically highlight and make clickable all workspace entity mentions
- **Context Sidebar**: Track and navigate to all entities mentioned in the conversation
- **Interactive Onboarding**: Step-by-step tour explaining the assistant features
- **Command Help**: Categorized command examples with one-click use
- **Suggested Actions**: Dynamically generated action buttons based on conversation context

## Architecture

The system consists of several key components:

1. **Frontend Components**:
   - `WorkspaceChat.tsx`: Main chat interface with entity recognition and display
   - `OnboardingTour.tsx`: Step-by-step walkthrough for new users

2. **Backend API**:
   - `/api/workspace-ai/route.ts`: API endpoint for processing requests
   - Integration with Pollinations API for LLM responses

3. **Helper Modules**:
   - `commandParser.ts`: Parse natural language into structured commands
   - `actionHandler.ts`: Execute parsed commands against workspace data
   - `contextProvider.ts`: Generate workspace context for the AI

## Command Categories

The AI assistant understands commands across several categories:

### Projects
- Show all projects in workspace
- Get details about a specific project
- Create a new project

### Clients & Leads
- List all clients
- View client details
- Add new clients

### Tasks & Calendar
- View tasks and deadlines
- Check what's due this week
- Create new tasks

### Content
- Find specific content
- Create new content using AI
- View recent content

## User Interface

The interface consists of:

1. **Chat Area**: Displays conversation with highlighted entities
2. **Input Bar**: Text input with command suggestions
3. **Context Sidebar**: Shows all workspace entities mentioned 
4. **Action Buttons**: Dynamically suggests relevant actions

## Entity Recognition

The assistant automatically recognizes and highlights:

- **Projects**: Blue highlighting with project icon
- **Clients**: Green highlighting with client icon
- **Tasks**: Yellow highlighting with task icon
- **Dates**: Purple highlighting with calendar icon

Clicking on any highlighted entity navigates directly to that item's page.

## Installation & Setup

The workspace AI assistant is pre-integrated with the QanDu platform. No additional setup is required beyond having:

1. An active QanDu account
2. At least one workspace created

## Usage Instructions

1. **Accessing the Assistant**:
   - Navigate to your workspace
   - Click the "Workspace AI" button in the top navigation
   - Alternatively, access from the workspace manager page

2. **Asking Questions**:
   - Type natural questions about your workspace data
   - "Show me all my projects"
   - "What's due this week?"
   - "Tell me about the Marketing project"

3. **Using Commands**:
   - Create entities: "Create a new project called Q3 Campaign"
   - Update entities: "Update the status of Marketing project to In Progress"
   - List entities: "Show me all clients"

4. **Navigation**:
   - Click on any highlighted entity to navigate to its details page
   - Use the context sidebar to quickly access mentioned items
   - Use suggested action buttons for common next steps

## Troubleshooting

If the assistant isn't responding as expected:

1. Check that your workspace contains data (projects, clients, etc.)
2. Try rephrasing your question or command
3. Use the help panel (? button) to see example commands
4. Restart the conversation by refreshing the page

## Technical Details

- The system uses regex patterns to recognize entities in text
- Commands are parsed with confidence scores - high confidence commands execute directly
- Low confidence commands are passed to the LLM with workspace context
- All responses include metadata to enable entity linking 