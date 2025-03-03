import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { Brain, Pen, Image, Share2 } from "lucide-react";
import { useBlogStore } from "../utils/blog-store";
import { Link } from "react-router-dom";

export default function App() {
  const { posts } = useBlogStore();
  
  // Get the 3 most recent published posts
  const recentPosts = posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        
        {/* Recent Blog Posts */}
        {recentPosts.length > 0 && (
          <section className="w-full py-12 md:py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter mb-4">Latest Insights</h2>
                  <p className="text-muted-foreground md:text-lg max-w-[600px]">
                    Stay updated with our latest articles and industry insights
                  </p>
                </div>
                <Link to="/blog" className="text-primary hover:underline">
                  View all posts →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <div className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-lg">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {post.categories[0] && (
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {post.categories[0]}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.publishDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Features Showcase */}
        <section className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">AI-Powered Blog Creation</h2>
              <p className="text-muted-foreground md:text-lg max-w-[800px] mx-auto">
                Create, manage, and optimize your blog content with our advanced AI tools
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center p-6 bg-background rounded-xl border text-center">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">AI Content Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Get intelligent suggestions for titles, content, and improvements
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-background rounded-xl border text-center">
                <Pen className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Rich Text Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Write and format your content with our intuitive editor
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-background rounded-xl border text-center">
                <Image className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">AI Image Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Create unique cover images for your blog posts
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-background rounded-xl border text-center">
                <Share2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Social Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Share your posts across multiple platforms
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technical Features Section */}
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
