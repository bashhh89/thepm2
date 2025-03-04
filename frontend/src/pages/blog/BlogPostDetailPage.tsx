import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useBlogStore } from '../../utils/blog-store';

export default function BlogPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, loadPosts } = useBlogStore();
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  // Load posts if not already loaded
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Find current post and related posts
  const post = posts.find(p => p.id === id && p.status === 'published');

  // Get related posts when current post changes
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

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/blog')}>
            Return to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/blog')}
          className="mb-8"
        >
          ← Back to Blog
        </Button>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          {post.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/blog?category=${category}`}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm no-underline"
                >
                  {category}
                </Link>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>{post.author}</span>
              <span>•</span>
              <time dateTime={post.publishDate}>
                {new Date(post.publishDate).toLocaleDateString()}
              </time>
            </div>
          </header>

          <div className="mb-12">
            {post.content}
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Link key={index} to={`/blog?tag=${tag}`}>
                <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                  {tag}
                </span>
              </Link>
            ))}
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden">
                  {relatedPost.coverImage && (
                    <div className="aspect-video bg-muted">
                      <img 
                        src={relatedPost.coverImage} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link to={`/blog/${relatedPost.id}`}>
                      <Button variant="ghost" size="sm">Read Article</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}