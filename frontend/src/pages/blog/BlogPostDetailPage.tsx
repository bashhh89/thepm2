import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useBlogStore } from '../../utils/blog-store';

export default function BlogPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, loadPosts, isLoading } = useBlogStore();
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  // Load posts if not already loaded
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Find current post and related posts
  const post = id ? posts.find(p => p.id === id) : null;

  // Update related posts when current post changes
  useEffect(() => {
    if (post) {
      // Find posts with matching categories or tags
      const related = posts.filter(p => 
        p.id !== post.id && 
        p.status === 'published' &&
        (
          p.categories.some(cat => post.categories.includes(cat)) ||
          p.tags.some(tag => post.tags.includes(tag))
        )
      ).slice(0, 3);
      
      setRelatedPosts(related);
    }
  }, [post, posts]);

  // Simplified markdown renderer for preview
  const renderMarkdown = (markdown: string) => {
    const htmlContent = markdown
      .replace(/# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/## (.*$)/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>')
      .replace(/### (.*$)/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br />');
    
    return { __html: htmlContent };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Blog Post Not Found</h1>
          <p className="mt-4">The article you are looking for does not exist or has been removed.</p>
          <Link to="/blog" className="mt-6 inline-block">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-primary">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <span className="mr-3 font-medium">{post.author}</span>
            </div>
            <span className="mx-3 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{post.publishDate}</span>
            <span className="mx-3 text-muted-foreground">•</span>
            <span className="text-muted-foreground">5 min read</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category, index) => (
              <Link key={index} to={`/blog?category=${category}`}>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 aspect-video rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={renderMarkdown(post.content)} />
        </div>

        {/* Tags */}
        <div className="mt-10 pt-6 border-t">
          <h3 className="text-lg font-bold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Link key={index} to={`/blog?tag=${tag}`}>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {tag}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-10 pt-6 border-t">
          <h3 className="text-lg font-bold mb-3">Share this article</h3>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}>
              Twitter
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
              Facebook
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`, '_blank')}>
              LinkedIn
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}>
              Copy Link
            </Button>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-10 pt-6 border-t">
          <div className="flex items-center">
            <div>
              <h3 className="font-bold">{post.author}</h3>
              <p className="text-muted-foreground">
                Writer and content creator specializing in technology and business topics.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-6 border-t">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={relatedPost.coverImage} 
                      alt={relatedPost.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{relatedPost.categories[0]}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">5 min read</span>
                    </div>
                    <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                    <Link to={`/blog/${relatedPost.id}`}>
                      <Button variant="ghost" size="sm">Read Article</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-12 bg-muted p-8 rounded-lg">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest articles, resources, and updates delivered to your inbox.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-l-md border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}