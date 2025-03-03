import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useBlogStore } from '../utils/blog-store';

export default function BlogPage() {
  const { posts, isLoading, loadPosts } = useBlogStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Load posts and extract categories on mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Extract categories whenever posts change
  useEffect(() => {
    const allCategories = Array.from(
      new Set(posts.flatMap(post => post.categories))
    );
    setCategories(['All', ...allCategories]);
  }, [posts]);

  // Filter posts by category
  const filterPostsByCategory = (category: string | null) => {
    setActiveCategory(category);
  };

  // Get filtered and sorted posts
  const getFilteredPosts = () => {
    if (!activeCategory || activeCategory === 'All') {
      return posts;
    }
    return posts.filter(post => post.categories.includes(activeCategory));
  };

  // Split posts into featured and recent
  const publishedPosts = getFilteredPosts().filter(post => post.status === 'published');
  const featuredPosts = publishedPosts.slice(0, 1);
  const recentPosts = publishedPosts.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">QanDu Insights</h1>
            <p className="text-muted-foreground mt-2">Latest updates, guides, and industry insights</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Button variant="outline" onClick={() => filterPostsByCategory(activeCategory === 'All' ? null : 'All')}>
                {activeCategory || 'All Categories'}
              </Button>
              {categories.length > 0 && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10" style={{ display: activeCategory === 'All' ? 'block' : 'none' }}>
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => filterPostsByCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button>Subscribe</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredPosts.length > 0 && (
                <Card className="col-span-full md:col-span-2 overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={featuredPosts[0].coverImage} 
                      alt={featuredPosts[0].title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">Featured</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">5 min read</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{featuredPosts[0].title}</h2>
                    <p className="text-muted-foreground mb-4">
                      {featuredPosts[0].excerpt}
                    </p>
                    <Link to={`/blog/${featuredPosts[0].id}`}>
                      <Button variant="outline">Read More</Button>
                    </Link>
                  </div>
                </Card>
              )}

              {recentPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{post.categories[0]}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">5 min read</span>
                    </div>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm">Read Article</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentPosts.slice(2).map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{post.categories[0]}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">5 min read</span>
                    </div>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm">Read Article</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-full md:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.filter(cat => cat !== 'All').map((category) => (
                    <Card key={category} className="p-6">
                      <h3 className="font-semibold mb-2">{category}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Latest articles and resources about {category.toLowerCase()}.
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => filterPostsByCategory(category)}
                      >
                        View Articles
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-1">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Stay Updated</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Subscribe to our newsletter for the latest insights and updates.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="you@example.com"
                      />
                    </div>
                    <Button className="w-full">Subscribe Now</Button>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
