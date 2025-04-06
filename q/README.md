# QanDu AI Platform

QanDu AI is a comprehensive business intelligence platform that helps organizations make data-driven decisions with AI-powered tools and insights.

## Features

- **Chat Interface**: Interact with multiple AI models through a unified chat interface
- **Advanced Research**: Guided research assistant for in-depth business intelligence
- **IntelliSearch**: Quick web search capabilities integrated into the platform
- **Project Management**: Organize and track business initiatives
- **Presentation Generator**: Create compelling presentations from simple prompts

## Advanced Research

The Advanced Research feature provides a guided approach to complex business questions, helping users:

1. **Define Research Goals**: Select from predefined goals like Business Formation, Competitive Analysis, Market Research, etc.
2. **Guided Conversation**: The AI assistant asks targeted follow-up questions to better understand your needs
3. **Comprehensive Results**: Get detailed, context-aware answers drawn from multiple web sources
4. **Suggested Next Steps**: Follow-up questions help continue your research journey
5. **Easy Export**: Copy markdown-formatted results for use in other applications

### Using Advanced Research

1. Navigate to the Advanced Research section from the sidebar
2. Select a research goal that matches your needs
3. Answer the initial questions to establish context
4. Review the generated research and use the suggested follow-up questions to dive deeper
5. Use the copy button to export your findings

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bashhh89/thepm2.git
   cd thepm2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the necessary environment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

5. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Application Structure

- `src/app` - Next.js app router pages
- `src/components` - React components
- `src/lib` - Utility functions, API clients, and constants
- `src/store` - Global state management
- `src/context` - React context providers
- `public` - Static assets

## Key Features Guide

### AI Chat Interface

The chat interface allows users to interact with AI models. The interface includes:

- Model selection dropdown
- Web search toggle for using SearchGPT
- Agent selection for using custom agents
- Message history and conversation management

### SearchGPT Web Search

Enable the web search feature by clicking the "Web Search" button in the chat interface. This automatically:

1. Switches to the SearchGPT model
2. Adds web search capabilities to your queries
3. Returns answers with information from the internet

## GitHub Workflow Guidelines

### Simple GitHub Workflow

1. **Always Work from Main Branch**

   Start by ensuring you're on the main branch and it's up to date:

   ```bash
   git checkout main
   git pull
   ```

2. **Create a Feature Branch**

   Create a new branch for your feature:

   ```bash
   git checkout -b feature-name
   ```

3. **Make Your Changes**

   Write your code, add features, fix bugs, etc.

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Descriptive message about what you did"
   ```

5. **Push to GitHub**

   ```bash
   git push -u origin feature-name
   ```

6. **Merge to Main**

   When your feature is ready:

   ```bash
   git checkout main
   git merge feature-name
   git push origin main
   ```

### Git Best Practices

1. **Use Descriptive Commit Messages**

   Bad: `git commit -m "fixed stuff"`
   Good: `git commit -m "Fix authentication timeout issue in login flow"`

2. **Commit Often**

   Make small, focused commits that are easy to understand and review.

3. **Pull Before Pushing**

   Always pull the latest changes from the remote repository before pushing:
   
   ```bash
   git pull origin main
   ```

4. **Use Tags for Releases**

   ```bash
   git tag -a v1.0 -m "Version 1.0 release"
   git push origin v1.0
   ```

## Troubleshooting

### Fixing Common Issues

1. **Port already in use**

   If port 3000 is already in use, kill the process:

   ```bash
   # PowerShell
   Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }
   
   # Then restart the server
   npm run dev
   ```

2. **Clean Cache if Needed**

   If you encounter strange build errors:

   ```bash
   # Delete the Next.js cache
   rm -rf .next
   # Or on Windows
   Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
   
   # Restart the development server
   npm run dev
   ```

## Contributing

Please follow these guidelines when contributing to the project:

1. Follow the established code style and architecture
2. Test your changes thoroughly
3. Document new features or changes
4. Use the GitHub workflow described above

## License

This project is proprietary and confidential.

# QanDu AI - Clean Project Structure

This is the consolidated QanDu AI project with all necessary files in the root directory.

## Project Structure

- All source code is in the `src` directory
- Configuration files are at the root level
- No need to navigate to subdirectories to run commands

## Development

Run the development server:

```bash
npm run dev
```

All commands should be run from the project root (E:\q).

## Important Files

- `src/components/sidebar.tsx` - Sidebar component with navigation
- `src/components/ClientLayout.tsx` - Layout for authenticated users
- `src/app/layout.tsx` - Main application layout

## Notes

- The sidebar now correctly displays on all authenticated pages
- The project runs properly from the root directory
- No need for nested thepm2, theprojectmanager, or temp-clone directories

If you encounter any issues with the sidebar not showing, check:
1. You're properly authenticated 
2. The page isn't in the public routes list
3. All imports in sidebar.tsx use the correct paths

# Project Management App

A Next.js application with Supabase authentication and project management features.

## Features

- User authentication (signup, login, logout)
- Project management (create, list, view projects)
- Task management (create, edit, list tasks within projects)
- Project progress tracking
- Dark mode UI with responsive design
- JSON import for quick project creation

## Installation and Setup

1. Clone the repository
2. Install dependencies:
```
npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run SQL setup scripts in your Supabase database:
   - `supabase-projects-setup.sql` - Creates the projects table and RLS policies
   - `supabase-tasks-setup.sql` - Creates the tasks table and RLS policies

5. Start the development server:
   ```
npm run dev
   ```

## Database Structure

The application uses two main tables:

### Projects Table
- `id` - UUID, primary key
- `name` - Text, required
- `description` - Text, optional
- `user_id` - UUID, references auth.users
- `status` - Text, enum ('planning', 'active', 'completed', 'archived')
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Tasks Table
- `id` - UUID, primary key
- `title` - Text, required
- `description` - Text, optional
- `project_id` - UUID, references projects.id
- `user_id` - UUID, references auth.users
- `status` - Text, enum ('pending', 'in_progress', 'completed')
- `priority` - Text, enum ('low', 'medium', 'high')
- `due_date` - Timestamp, optional
- `created_at` - Timestamp
- `updated_at` - Timestamp

Both tables are protected with Row Level Security (RLS) policies to ensure users can only access their own data.

## Usage

1. Register a new account or log in
2. From the dashboard, create new projects or import from JSON
3. Navigate to a project to view details
4. Add tasks to your projects
5. Update task status as you progress
6. Track overall project progress based on completed tasks

## Troubleshooting

If you encounter issues:

1. Check that your Supabase credentials are correct
2. Ensure the SQL setup scripts have been run successfully
3. Verify that Row Level Security policies are properly configured

For more details, see the complete [Project Documentation](PROJECT_DOCUMENTATION.md).

# AnythingLLM Integration

## Overview

This project integrates with AnythingLLM to provide AI-powered document processing and chat functionality for projects. Each project in the system is associated with its own AnythingLLM workspace, allowing for project-specific document management and AI chat.

## Features

- **Workspace Management**: Automatic creation of AnythingLLM workspaces for each project
- **Document Processing**: Upload and process documents through AnythingLLM
- **AI Chat**: Interact with project documents using the AnythingLLM chat interface
- **Vector Search**: Search for information across all project documents
- **JSON Import**: Create complete projects from JSON data, including milestones, tasks, and risks

## Setup

1. Install and configure AnythingLLM according to its documentation
2. Set the following environment variables in your `.env` file:
   ```
   NEXT_PUBLIC_ANYTHINGLLM_BASE_URL=https://your-anythingllm-instance.com
   ANYTHINGLLM_API_KEY=your_api_key_here
   ANYTHINGLLM_SIMILARITY_THRESHOLD=0.7
   ANYTHINGLLM_MAX_RESULTS=5
   ANYTHINGLLM_HISTORY_MESSAGE_COUNT=20
   ```
3. Run the Supabase migrations to add the necessary database tables

## API Endpoints

### Document Upload
```
POST /api/document-upload
Content-Type: multipart/form-data
Body: {
  file: File,
  projectId: string
}
```

### Project Chat
```
POST /api/project-chat
Content-Type: application/json
Body: {
  projectId: string,
  message: string,
  mode: 'chat' | 'query' (optional, defaults to 'chat')
}
```

### Streaming Chat
```
POST /api/project-chat-stream
Content-Type: application/json
Body: {
  projectId: string,
  message: string,
  mode: 'chat' | 'query' (optional, defaults to 'chat')
}
```

### JSON Import
```
POST /api/create-project-from-json
Content-Type: application/json
Body: {
  title: string,
  description: string,
  status: string,
  priority: string,
  milestones: Array<{
    title: string,
    description: string,
    status: string
  }>,
  tasks: Array<{
    title: string,
    description: string,
    status: string,
    priority: string,
    due_date: string,
    subtasks: Array<{
      title: string,
      status: string
    }>
  }>,
  risks: Array<{
    title: string,
    description: string,
    impact: string,
    probability: string,
    mitigation: string
  }>,
  kanban: {
    columns: Array<{
      title: string,
      tasks: Array<{
        title: string,
        description: string
      }>
    }>
  }
}
```

## Supported Document Types

The integration supports the following document types:
- PDF (.pdf)
- Microsoft Word (.docx, .doc)
- Plain Text (.txt)
- Markdown (.md)
- CSV (.csv)

## Technologies

- Next.js
- React
- TypeScript
- TailwindCSS
- Pollinations API