import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../AppWrapper';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  tags: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Replace this with your actual data fetching logic
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match our BlogPost interface
        const transformedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
          coverImage: post.cover_image,
          author: {
            name: post.author_name || 'Anonymous',
            avatar: post.author_avatar
          },
          createdAt: new Date(post.created_at).toLocaleDateString(),
          tags: post.tags || []
        }));

        setPosts(transformedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get unique tags from all posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Blog</h1>
              <p className="text-muted-foreground mt-2">
                Latest articles and updates
              </p>
            </div>
            <Button onClick={() => navigate('/dashboard/blog/new')}>
              Create Post
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Tags filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              onClick={() => setSelectedTag(null)}
              size="sm"
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
                size="sm"
              >
                {tag}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-4">
                  <div className="animate-pulse">
                    <div className="h-48 bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map(post => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/dashboard/blog/${post.id}`)}
                >
                  {post.coverImage && (
                    <div className="aspect-video relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {post.author.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {post.author.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">
                          {post.author.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.createdAt}
                        </div>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No posts found</h2>
              <p className="text-muted-foreground mb-4">
                {selectedTag
                  ? `No posts found with tag "${selectedTag}"`
                  : "Start creating your first blog post"}
              </p>
              <Button onClick={() => navigate('/dashboard/blog/new')}>
                Create Your First Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
