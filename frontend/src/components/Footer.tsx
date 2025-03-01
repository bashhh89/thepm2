import React from "react";

export default function Footer() {
  return (
    <footer className="bg-background border-t py-6 mt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Nexus Suite</h3>
            <p className="text-muted-foreground">
              The complete business management system designed to streamline your operations and boost productivity.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Features</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Chat Widget</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Admin Dashboard</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Lead Management</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog Creation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Partners</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Nexus Suite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
