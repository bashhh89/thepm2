import React from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Newspaper } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 bg-primary/5">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-start space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-[600px]">
              Join hundreds of businesses using QanDu to streamline operations, create engaging content, 
              and drive growth with AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button size="lg" className="px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/blog">
                <Button size="lg" variant="outline" className="px-8">
                  <Newspaper className="mr-2 h-4 w-4" />
                  Read Our Blog
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-background rounded-lg border shadow-sm">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Content Creation</h3>
              <p className="text-sm text-muted-foreground">
                Create engaging blog posts and documents with AI assistance
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg border shadow-sm">
              <Newspaper className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Blog Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage your blog with powerful tools and analytics
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg border shadow-sm col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Join Our Newsletter</p>
                  <p className="text-xs text-muted-foreground">Stay updated with our latest features and tips</p>
                </div>
                <Button variant="outline" size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
