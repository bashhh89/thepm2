import React, { useEffect } from "react";
import { NavigationHeader } from "../components/NavigationHeader";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { useBlogStore } from "../utils/blog-store";
import { Link } from "react-router-dom";
import { useAuthStore } from "../utils/auth-store";
import { Card } from "../components/Card";

export default function App() {
  const { posts, isLoading, loadPosts } = useBlogStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const recentPosts = posts?.filter(post => post.status === 'published')?.slice(0, 3) || [];

  return (
    <div className="flex min-h-screen flex-col">
      <NavigationHeader 
        isAuthenticated={isAuthenticated}
        onSignIn={() => window.location.href = '/sign-in'}
        onSignUp={() => window.location.href = '/sign-up'}
        onLogout={() => window.location.href = '/sign-out'}
      />
      <main>
        <HeroSection />
        <FeaturesSection />
        
        {/* Recent Blog Posts Section */}
        <section className="w-full py-12 md:py-24 bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-3xl font-bold tracking-tighter mb-2">Latest from Our Blog</h2>
                <p className="text-muted-foreground md:text-lg max-w-[600px]">
                  Stay updated with our latest articles and industry insights
                </p>
              </div>
              <Link to="/blog" className="text-primary hover:underline">
                View all posts →
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <Card className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-lg">
                      <div className="aspect-video overflow-hidden">
                        {post.coverImage && (
                          <img 
                            src={post.coverImage} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {post.categories?.[0] && (
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {post.categories[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts available yet.</p>
              </div>
            )}
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Technical Excellence</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Built with cutting-edge technology for maximum performance and reliability
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col p-6 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold mb-2">AI Integration</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Multiple AI model support</li>
                  <li>• Contextual responses</li>
                  <li>• Knowledge base training</li>
                  <li>• Smart content generation</li>
                </ul>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold mb-2">Development Stack</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• React with TypeScript</li>
                  <li>• Modern component library</li>
                  <li>• Responsive design</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold mb-2">Storage & Security</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Persistent data storage</li>
                  <li>• Secure file handling</li>
                  <li>• Automatic backups</li>
                  <li>• Version control</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
