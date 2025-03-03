import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-12 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              <li><Link to="/dashboard/documents" className="text-muted-foreground hover:text-foreground">Documents</Link></li>
              <li><Link to="/dashboard/chat" className="text-muted-foreground hover:text-foreground">Chat</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Features</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog Creation</Link></li>
              <li><Link to="/dashboard/analytics" className="text-muted-foreground hover:text-foreground">Analytics</Link></li>
              <li><Link to="/dashboard/leads" className="text-muted-foreground hover:text-foreground">Lead Management</Link></li>
              <li><Link to="/dashboard/settings" className="text-muted-foreground hover:text-foreground">Settings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/partners" className="text-muted-foreground hover:text-foreground">Partners</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold">QanDu</span>
              <span className="text-muted-foreground">© {year} All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                Twitter
              </a>
              <a href="https://linkedin.com" className="text-muted-foreground hover:text-foreground">
                LinkedIn
              </a>
              <a href="https://github.com" className="text-muted-foreground hover:text-foreground">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
