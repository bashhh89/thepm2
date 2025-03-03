# QanDu White Label Platform

A powerful, AI-driven document creation and content management platform that can be white-labeled for different businesses.

## Features

### Document Creation
- AI-powered document generation from topics
- Customizable section count and content length
- Support for multiple document types (documents, presentations, webpages)
- Template-based document creation
- Rich text editing capabilities

### Content Generation
- Integration with Puter.js AI services
- Support for multiple AI models including:
  - GPT-4o mini (default)
  - GPT-4o
  - Claude-3.5-sonnet
  - DeepSeek Chat/Reasoner
  - Gemini 2.0/1.5 Flash
  - Meta Llama 3.1 series
  - Mistral/Pixtral Large
  - Codestral
  - Gemma 2.27B
  - Grok Beta

### Content Enhancement
- Automatic content generation
- AI-powered visual suggestions (images, charts, tables)
- Grammar and style checking
- Content enhancement and refinement

### Multilingual Support
- Content translation across multiple languages
- Cultural localization options
- Support for different regional markets (US, UK, etc.)
- Formal and casual tone adjustments

### Collaboration
- Real-time collaboration features
- Document sharing capabilities
- Role-based access control
- Version history tracking

### Visual Content
- AI-generated images
- Dynamic chart creation and editing
- Interactive data tables
- Custom visualization options

### Blog System
- AI-powered blog post creation and management
- Persistent storage using Puter.js
- Rich text editing with markdown support
- Cover image generation with AI
- Category and tag management
- Related posts suggestions
- SEO-friendly content structure
- Preview and draft system
- Social sharing functionality

### User Interface
- Modern, responsive design
- Dark/light theme support
- Customizable components
- Floating chat interface

### Recent Updates
- Added complete blog management system
- Implemented AI-assisted content creation
- Added persistent storage for blog posts
- Enhanced UI/UX for content management
- Improved navigation and dashboard integration

## Technical Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- ShadcnUI components
- Recharts for data visualization

### Backend
- Python with FastAPI
- PostgreSQL database
- Docker containerization
- JWT authentication

### AI Integration
- Puter.js AI services
- Multiple AI model support
- Streaming responses
- Function calling capabilities

### Storage
- Puter.js for blog post storage and file management
- Persistent data sync across sessions
- Secure file storage with encryption

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
\`\`\`

2. Install frontend dependencies:
\`\`\`bash
cd frontend
pnpm install
\`\`\`

3. Install backend dependencies:
\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

4. Start the development servers:

Frontend:
\`\`\`bash
cd frontend
pnpm dev
\`\`\`

Backend:
\`\`\`bash
cd backend
python main.py
\`\`\`

## Docker Deployment

Both frontend and backend include Dockerfile configurations for containerized deployment.

To build and run with Docker:

\`\`\`bash
# Frontend
cd frontend
docker build -t qandu-frontend .
docker run -p 3000:3000 qandu-frontend

# Backend
cd backend
docker build -t qandu-backend .
docker run -p 8000:8000 qandu-backend
\`\`\`

## Environment Configuration

Create a \`.env\` file in the backend directory with the following variables:
\`\`\`
DATABASE_URL=postgresql://user:password@localhost:5432/qandu
JWT_SECRET=your-secret-key
AI_API_KEY=your-ai-api-key
\`\`\`

## Usage

### Blog Management
1. Navigate to Dashboard > Blog Posts
2. Create new posts with AI assistance
3. Use the editor to customize content
4. Preview posts before publishing
5. Manage categories and tags
6. Generate AI images for cover photos
7. Share posts on social media

### Content Creation
The platform includes AI-powered tools for:
- Title suggestions and enhancement
- Content generation
- Image creation
- Category and tag suggestions
- SEO optimization hints

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Development

## Roadmap
- Enhanced analytics for blog posts
- Automated social media scheduling
- Advanced SEO tools integration
- Multi-language blog support
- Newsletter integration

## License

This project is proprietary software. All rights reserved.
