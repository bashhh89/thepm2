import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useBlogStore } from '../utils/blog-store';
import { useAuthStore } from '../utils/auth-store';
import { NavigationHeader } from '../components/NavigationHeader';
import Footer from '../components/Footer';

export default function BlogPage() {
  const { posts, isLoading, loadPosts } = useBlogStore();
  const { isAuthenticated } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // Load posts and extract categories on mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Extract categories whenever posts change
  useEffect(() => {
    const allCategories = Array.from(
      new Set(posts.flatMap(post => post.categories))
    ).filter(Boolean);
    setCategories(['All', ...allCategories]);
  }, [posts]);

  // Filter posts by category
  const filterPostsByCategory = (category: string) => {
    setActiveCategory(category === 'All' ? null : category);
    setShowCategoryMenu(false);
  };

  // Get filtered and sorted posts
  const getFilteredPosts = () => {
    const publishedPosts = posts.filter(post => post.status === 'published');
    if (!activeCategory || activeCategory === 'All') {
      return publishedPosts;
    }
    return publishedPosts.filter(post => post.categories.includes(activeCategory));
  };

  const publishedPosts = getFilteredPosts();
  const featuredPosts = publishedPosts.slice(0, 3); // Show 3 featured posts
  const recentPosts = publishedPosts.slice(3); // Rest of the posts

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationHeader
        isAuthenticated={isAuthenticated}
        onSignIn={() => window.location.href = '/sign-in'}
        onSignUp={() => window.location.href = '/sign-up'}
        onLogout={() => window.location.href = '/sign-out'}
      />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <h1 className="text-4xl font-bold mb-2">QanDu Blog</h1>
                <p className="text-xl text-muted-foreground">Latest updates, guides, and industry insights</p>
              </div>
              <div className="relative">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="min-w-[160px] justify-between"
                >
                  {activeCategory || 'All Categories'}
                  <span className="ml-2">▼</span>
                </Button>
                {showCategoryMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border z-10">
                    <div className="py-1" role="menu">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className="block w-full px-4 py-2 text-sm hover:bg-accent text-left"
                          onClick={() => filterPostsByCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Featured Posts Grid */}
                {featuredPosts.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {featuredPosts.map((post, index) => (
                      <Link key={post.id} to={`/blog/${post.id}`} className="group">
                        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            {post.coverImage && (
                              <img 
                                src={post.coverImage} 
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                            )}
                          </div>
                          <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.categories.map((category, catIndex) => (
                                <span 
                                  key={catIndex}
                                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                            <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h2>
                            <p className="text-muted-foreground line-clamp-2 mb-4">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {new Date(post.publishDate).toLocaleDateString()}
                              </span>
                              <span className="text-sm font-medium text-primary">Read more →</span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Recent Posts List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="group">
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {post.coverImage && (
                            <img 
                              src={post.coverImage} 
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.categories.map((category, index) => (
                              <span 
                                key={index}
                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.publishDate).toLocaleDateString()}
                            </span>
                            <span className="text-sm font-medium text-primary">Read more →</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {publishedPosts.length === 0 && (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">No Posts Found</h2>
                    <p className="text-muted-foreground">
                      {activeCategory 
                        ? `No articles found in the ${activeCategory} category.` 
                        : 'No published articles available yet.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
