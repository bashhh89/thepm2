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

# QanDu White-Label Recruitment Platform - Technical Documentation

## Architecture Overview

### Multi-Tenant System
- Database-per-tenant strategy
- Row-level security (RLS)
- Tenant isolation
- Custom domain routing

### Frontend Architecture
- React with TypeScript
- Module Federation for white-label customization
- Dynamic theme injection
- Micro-frontend approach for scalability

### Backend Services
- Node.js/Express API
- PostgreSQL with Prisma ORM
- Redis for caching
- AWS S3 for file storage
- Elasticsearch for search

## Implementation Details

### White-Label Implementation
```typescript
interface TenantConfig {
  name: string;
  domain: string;
  branding: {
    colors: {
      primary: string;
      secondary: string;
      accent?: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
    };
    layout: {
      navStyle: 'default' | 'minimal' | 'centered';
    };
  };
}
```

### Multi-Tenant Database Schema
```prisma
model Tenant {
  id            String   @id @default(uuid())
  name          String
  domain        String   @unique
  features      Json
  settings      Json
  users         User[]
  jobs          Job[]
  candidates    Candidate[]
}

model User {
  id        String   @id
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  role      String
  @@index([tenantId])
}
```

### Authentication Flow
1. Custom domain resolution
2. Tenant identification
3. User authentication
4. Role-based access control
5. Session management

### Theme Engine
- Runtime CSS variable injection
- Dynamic style loading
- Component-level theming
- Font loading optimization

## Security Measures

### Tenant Isolation
- Database level isolation
- Storage bucket isolation
- API route isolation
- Cache isolation

### Data Protection
- End-to-end encryption
- GDPR compliance tools
- Data retention policies
- Audit logging

### API Security
- JWT authentication
- Rate limiting
- CORS policies
- Input validation

## Performance Optimization

### Frontend Performance
- Code splitting
- Lazy loading
- Image optimization
- Cache strategies
- Bundle optimization

### Database Performance
- Indexing strategy
- Query optimization
- Connection pooling
- Read replicas

### Caching Strategy
- Redis caching
- Browser caching
- Static asset caching
- API response caching

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies
3. Setup local database
4. Configure environment
5. Start development servers

### Deployment Pipeline
1. Code review
2. Automated testing
3. Staging deployment
4. QA verification
5. Production deployment

### Testing Strategy
- Unit tests (Jest)
- Integration tests (Cypress)
- E2E tests (Playwright)
- Load testing (k6)
- Security testing

## API Documentation

### RESTful Endpoints
```typescript
interface JobAPI {
  POST   /api/v1/jobs           // Create job
  GET    /api/v1/jobs           // List jobs
  GET    /api/v1/jobs/:id       // Get job
  PUT    /api/v1/jobs/:id       // Update job
  DELETE /api/v1/jobs/:id       // Delete job
}

interface CandidateAPI {
  POST   /api/v1/candidates     // Create candidate
  GET    /api/v1/candidates     // List candidates
  GET    /api/v1/candidates/:id // Get candidate
  PUT    /api/v1/candidates/:id // Update candidate
  DELETE /api/v1/candidates/:id // Delete candidate
}
```

### WebSocket Events
```typescript
interface WebSocketEvents {
  'application:new'    // New application received
  'interview:scheduled'// Interview scheduled
  'message:new'       // New message received
  'status:changed'    // Application status changed
}
```

## Error Handling

### Frontend Errors
- Global error boundary
- Toast notifications
- Retry mechanisms
- Offline support

### Backend Errors
- Error logging
- Status codes
- Error responses
- Fallback strategies

## Monitoring & Logging

### Metrics Collection
- User actions
- Performance metrics
- Error rates
- API usage

### Logging System
- Application logs
- Access logs
- Error logs
- Audit logs

## Infrastructure

### AWS Services
- EC2 for application servers
- RDS for databases
- S3 for file storage
- CloudFront for CDN
- Route53 for DNS

### DevOps Tools
- Docker containers
- Kubernetes orchestration
- Terraform for IaC
- GitHub Actions for CI/CD

## Scalability Considerations

### Horizontal Scaling
- Stateless applications
- Load balancing
- Database sharding
- Cache distribution

### Vertical Scaling
- Resource optimization
- Query optimization
- Memory management
- CPU utilization

## Backup & Recovery

### Database Backups
- Daily snapshots
- Point-in-time recovery
- Cross-region replication
- Backup retention

### Disaster Recovery
- Failover strategy
- Data recovery
- Service restoration
- Business continuity

## Integration Points

### External Services
- Payment gateways
- Email providers
- SMS services
- Analytics tools

### Third-Party APIs
- Calendar integration
- Video conferencing
- Document processing
- Background checks

## Future Technical Considerations

### AI Integration
- Machine learning models
- Natural language processing
- Computer vision
- Recommendation systems

### Mobile Development
- Progressive Web App
- React Native app
- Mobile-first design
- Offline capabilities

Updates to this documentation will be made as the technical implementation progresses.