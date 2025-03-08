import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useBlogStore } from '../utils/blog-store';
import { Check, Clock, Eye, Edit, Trash2, Plus } from 'lucide-react';

export default function BlogPostsPage() {
  const { posts, loadPosts, deletePost, isInitialized, isLoading: storeLoading } = useBlogStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const init = async () => {
      await loadPosts();
      setIsLoading(false);
    };
    init();
  }, [loadPosts]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const filteredPosts = posts
    .filter(post => filter === 'all' ? true : post.status === filter)
    .filter(post => 
      searchTerm ? 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const statusIcons = {
    published: <Check className="w-4 h-4 text-green-500" />,
    draft: <Clock className="w-4 h-4 text-yellow-500" />
  };

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link to="/dashboard/blog-posts/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Post
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            onClick={() => setFilter('published')}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Published
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Drafts
          </Button>
        </div>
        <div className="w-full md:w-72">
          <input
            type="search"
            placeholder="Search posts..."
            className="w-full px-3 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading || storeLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-600">{!isInitialized ? 'Initializing storage system...' : 'Loading posts...'}</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {statusIcons[post.status]}
                      <span className="text-sm font-medium capitalize">
                        {post.status}
                      </span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 ml-4">
                    <Link to={`/dashboard/blog-posts/edit/${post.id}`}>
                      <Button variant="outline" size="icon" className="w-9 h-9" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    {post.status === 'published' && (
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="outline" size="icon" className="w-9 h-9" title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-9 h-9 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(post.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}