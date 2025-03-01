import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">QanDu Insights</h1>
            <p className="text-muted-foreground mt-2">Latest updates, guides, and industry insights</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Categories</Button>
            <Button>Subscribe</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="col-span-full md:col-span-2 overflow-hidden">
            <div className="aspect-video bg-muted"></div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Featured</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">5 min read</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Leveraging AI for Business Growth</h2>
              <p className="text-muted-foreground mb-4">
                Discover how QanDu's AI-powered solutions are transforming business operations and driving growth.
              </p>
              <Button variant="outline">Read More</Button>
            </div>
          </Card>

          {[
            {
              title: 'Best Practices for Document Management',
              category: 'Guides',
              readTime: '3 min',
            },
            {
              title: 'Streamlining Your Sales Pipeline',
              category: 'Sales',
              readTime: '4 min',
            },
          ].map((article, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">{article.category}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <h3 className="font-semibold mb-2">{article.title}</h3>
                <Button variant="ghost" size="sm">Read Article</Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            'Project Management Tips',
            'AI Integration Strategies',
            'Team Collaboration Tools',
            'Data Security Best Practices',
            'Business Process Optimization',
            'Industry Insights',
          ].map((title, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Latest articles and resources about {title.toLowerCase()}.
              </p>
              <Button variant="ghost" size="sm">View Articles</Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest insights and updates.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">Weekly Digest</Button>
            <Button>Subscribe Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
