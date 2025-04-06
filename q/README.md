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