import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, User, Tag } from 'lucide-react';
import { Button } from '../../components/Button';

// Mock data for a blog post - in a real app, this would come from an API
const blogPost = {
  title: 'The Future of AI in Recruitment',
  content: `
    <p>Artificial Intelligence is revolutionizing the way organizations approach recruitment and talent acquisition. As we move further into the digital age, AI-powered solutions are becoming increasingly sophisticated and capable of handling complex hiring processes.</p>
    
    <h2>The Current State of AI in Recruitment</h2>
    <p>Today's AI recruitment tools can analyze resumes, conduct initial candidate screenings, and even predict candidate success rates. These capabilities are transforming how HR professionals approach their daily tasks and making the hiring process more efficient than ever before.</p>
    
    <h2>Key Benefits of AI-Powered Recruitment</h2>
    <ul>
      <li>Reduced time-to-hire through automated screening</li>
      <li>Improved candidate matching accuracy</li>
      <li>Elimination of unconscious bias</li>
      <li>Enhanced candidate experience</li>
      <li>Data-driven decision making</li>
    </ul>
    
    <h2>Looking Ahead</h2>
    <p>The future of AI in recruitment looks promising, with emerging technologies set to further transform the hiring landscape. From advanced natural language processing to predictive analytics, these innovations will continue to shape how organizations find and retain top talent.</p>
  `,
  date: '2024-03-15',
  readTime: '5 min read',
  author: {
    name: 'Sarah Johnson',
    role: 'HR Technology Specialist',
    avatar: '/avatars/sarah.jpg'
  },
  tags: ['AI', 'Recruitment', 'HR Tech', 'Future of Work'],
  relatedPosts: [
    {
      id: 2,
      title: 'Best Practices for Video Interviews',
      excerpt: 'Learn the essential tips and tricks to conduct effective video interviews.',
      slug: 'best-practices-for-video-interviews'
    },
    {
      id: 3,
      title: 'Reducing Bias in Hiring',
      excerpt: 'Explore strategies and tools to minimize unconscious bias in your recruitment process.',
      slug: 'reducing-bias-in-hiring'
    }
  ]
};

export default function BlogPost() {
  const { slug } = useParams();

  // In a real app, you would fetch the blog post data based on the slug
  // const [post, setPost] = useState(null);
  // useEffect(() => {
  //   fetchPost(slug).then(setPost);
  // }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      {/* Back to Blog */}
      <div className="container mx-auto max-w-4xl px-4 pt-8">
        <Link to="/blog">
          <Button variant="ghost" className="group">
            <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="pt-12 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(blogPost.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blogPost.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              {blogPost.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{blogPost.author.name}</div>
                <div className="text-sm text-muted-foreground">{blogPost.author.role}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {blogPost.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden mb-12 aspect-video bg-muted">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary">Featured Image</span>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
          </motion.div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPost.relatedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 