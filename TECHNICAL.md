# QanDu Technical Documentation

## 🛠 Technical Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Modern component architecture

### Backend
- Python with FastAPI
- Advanced AI/ML capabilities
- Secure authentication system
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Package managers (pnpm for frontend, pip for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/qandu.git
cd qandu
```

2. Frontend Setup:
```bash
cd frontend
pnpm install
pnpm run dev
```

3. Backend Setup:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python main.py
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# QanDu Technical Specification

## Blog System Architecture

### Navigation Flow
1. Creating a new post:
   - Dashboard -> Blog Posts -> Create New Post -> Edit -> Preview -> Publish -> View Post
2. Editing an existing post:
   - Dashboard -> Blog Posts -> Edit -> Preview -> Update -> View Post
3. Managing posts:
   - Dashboard -> Blog Posts (list view with status indicators)
   - Public blog view: /blog -> Individual post view

### Data Storage
- Blog posts are stored using Puter.js filesystem
- File format: JSON
- Storage path: `/blog-posts/{post-id}.json`
- Images are stored as base64 or URLs

### Blog Post Schema
```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageType: 'url' | 'upload' | 'generate';
  author: string;
  publishDate: string;
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### AI Integration
1. Title Generation/Enhancement:
   - Uses Puter.js AI chat for suggestions
   - Formats output as numbered list
   - Enhances SEO and readability

2. Content Generation:
   - Supports multiple length options
   - Uses markdown formatting
   - Includes section structure

3. Image Generation:
   - Integration with Stability AI
   - Professional photo style
   - 16:9 aspect ratio for consistency

### User Interface Components
1. Editor Features:
   - Rich text editing
   - Real-time preview
   - AI assistance tools
   - Image management
   - Category/tag management

2. Blog List Features:
   - Grid layout with cards
   - Status indicators
   - Quick actions (edit, view, delete)
   - Filtering options

3. Blog View Features:
   - Responsive layout
   - Social sharing
   - Related posts
   - Category/tag navigation

### Performance Considerations
1. Image Optimization:
   - Lazy loading for images
   - Proper aspect ratios
   - Responsive sizes

2. Content Loading:
   - Progressive loading for lists
   - Cached blog posts
   - Optimistic updates

### Security Measures
1. Authentication:
   - Required for editing/publishing
   - Public access for viewing
   - Role-based permissions

2. Data Validation:
   - Input sanitization
   - Markdown safety
   - Image validation

### Future Enhancements
1. Planned Features:
   - Analytics integration
   - SEO optimization tools
   - Multi-language support
   - Newsletter integration

2. Technical Improvements:
   - Image optimization service
   - Full-text search
   - Automated backups
   - Version control for posts