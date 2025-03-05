import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-card mt-auto border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/pages/product/features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link to="/pages/product/security" className="text-muted-foreground hover:text-foreground">Security</Link></li>
              <li><Link to="/pages/product/enterprise" className="text-muted-foreground hover:text-foreground">Enterprise</Link></li>
              <li><Link to="/pages/product/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/pages/resources/documentation" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link to="/pages/resources/guides" className="text-muted-foreground hover:text-foreground">Guides</Link></li>
              <li><Link to="/pages/resources/support" className="text-muted-foreground hover:text-foreground">Support</Link></li>
              <li><Link to="/pages/resources/api" className="text-muted-foreground hover:text-foreground">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/pages/company/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link to="/pages/company/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link to="/pages/company/partners" className="text-muted-foreground hover:text-foreground">Partners</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/pages/legal/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/pages/legal/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/pages/legal/cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
              <li><Link to="/pages/legal/compliance" className="text-muted-foreground hover:text-foreground">Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} QanDu. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/pages/social/twitter" className="text-muted-foreground hover:text-foreground">
                Twitter
              </Link>
              <Link to="/pages/social/linkedin" className="text-muted-foreground hover:text-foreground">
                LinkedIn
              </Link>
              <Link to="/pages/social/github" className="text-muted-foreground hover:text-foreground">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
