import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';

// Mock data for blog posts - in a real app, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Recruitment',
    excerpt: 'Discover how artificial intelligence is transforming the recruitment landscape and what it means for hiring managers.',
    image: '/blog/ai-recruitment.jpg',
    date: '2024-03-15',
    readTime: '5 min read',
    slug: 'future-of-ai-in-recruitment'
  },
  {
    id: 2,
    title: 'Best Practices for Video Interviews',
    excerpt: 'Learn the essential tips and tricks to conduct effective video interviews and assess candidates remotely.',
    image: '/blog/video-interviews.jpg',
    date: '2024-03-10',
    readTime: '4 min read',
    slug: 'best-practices-for-video-interviews'
  },
  {
    id: 3,
    title: 'Reducing Bias in Hiring',
    excerpt: 'Explore strategies and tools to minimize unconscious bias in your recruitment process.',
    image: '/blog/hiring-bias.jpg',
    date: '2024-03-05',
    readTime: '6 min read',
    slug: 'reducing-bias-in-hiring'
  },
  // Add more blog posts as needed
];

export default function BlogListing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Recruitment Insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Stay updated with the latest trends, best practices, and insights in recruitment and HR technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="rounded-xl overflow-hidden mb-4 aspect-video bg-muted">
                    {/* Replace with actual images in production */}
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary">Featured Image</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="pt-2">
                      <Button variant="link" className="group/btn p-0">
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 