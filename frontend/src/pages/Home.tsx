import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Building2, 
  Users, 
  Brain, 
  BarChart3, 
  Shield, 
  Globe, 
  Zap,
  ArrowRight,
  Check,
  Video,
  MessageSquare,
  FileText,
  Target
} from 'lucide-react';
import { Button } from '../components/Button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Launch Your Own Branded Recruitment Platform
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Transform your recruitment agency with a fully white-labeled platform featuring AI-powered tools, video interviews, and automated workflows. Your brand, your success.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button size="lg" asChild>
                  <Link to="/signup">Get Your Platform</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/demo">Watch Demo</Link>
                </Button>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Check className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <Check className="h-4 w-4 text-primary" />
                <span>14-day free trial</span>
                <span className="mx-2">•</span>
                <Check className="h-4 w-4 text-primary" />
                <span>Full feature access</span>
              </motion.div>
            </div>
            <motion.div 
              className="relative lg:h-[600px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img 
                src="/dashboard-preview.png" 
                alt="Platform Preview" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-background border rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">50+ Agencies Live</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Active Agencies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Candidates Placed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">40%</div>
              <div className="text-sm text-muted-foreground">Time Saved with AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Your Complete Recruitment Platform</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to run and scale your recruitment agency, branded as your own.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Recruitment */}
            <div className="rounded-lg border bg-card p-8 hover:shadow-lg transition-shadow">
              <Brain className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-muted-foreground mb-4">
                Smart candidate matching and screening powered by advanced AI.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Resume parsing & analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Skill-based matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Automated shortlisting</span>
                </li>
              </ul>
            </div>

            {/* Video Interviews */}
            <div className="rounded-lg border bg-card p-8 hover:shadow-lg transition-shadow">
              <Video className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-2">Video Interviews</h3>
              <p className="text-muted-foreground mb-4">
                Conduct and analyze video interviews with AI assistance.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Live & async interviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>AI sentiment analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Automated assessments</span>
                </li>
              </ul>
            </div>

            {/* Career Portal */}
            <div className="rounded-lg border bg-card p-8 hover:shadow-lg transition-shadow">
              <Globe className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-2">Branded Portal</h3>
              <p className="text-muted-foreground mb-4">
                Your own branded career portal and job board.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Custom domain</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>SEO optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Mobile responsive</span>
                </li>
              </ul>
            </div>

            {/* ATS Features */}
            <div className="rounded-lg border bg-card p-8 hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-2">Complete ATS</h3>
              <p className="text-muted-foreground mb-4">
                Powerful applicant tracking system built-in.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Pipeline management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Workflow automation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Team collaboration</span>
                </li>
              </ul>
            </div>

            {/* Communication Hub */}
            <div className="rounded-lg border bg-card p-8 hover:shadow-lg transition-shadow">
              <MessageSquare className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-2">Communication Hub</h3>
              <p className="text-muted-foreground mb-4">
                Centralized communication with candidates and clients.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Email templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>SMS integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Chat support</span>
                </li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="rounded-lg border bg-card p-8 hover:shadow-lg transition-shadow">
              <BarChart3 className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Data-driven insights and reporting.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Performance metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Custom reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Revenue tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">Loved by Recruitment Agencies</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <blockquote className="rounded-lg bg-background p-8">
              <p className="text-muted-foreground mb-4">
                "The AI-powered matching has transformed our recruitment process. We've reduced time-to-hire by 60% while improving candidate quality."
              </p>
              <footer className="flex items-center gap-4">
                <img 
                  src="/testimonial-1.jpg" 
                  alt="Sarah Wilson" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">Sarah Wilson</div>
                  <div className="text-sm text-muted-foreground">CEO, TechRecruit Pro</div>
                </div>
              </footer>
            </blockquote>

            <blockquote className="rounded-lg bg-background p-8">
              <p className="text-muted-foreground mb-4">
                "Having our own branded platform has elevated our agency's image. Clients love the professional experience and candidates find it easy to use."
              </p>
              <footer className="flex items-center gap-4">
                <img 
                  src="/testimonial-2.jpg" 
                  alt="James Chen" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">James Chen</div>
                  <div className="text-sm text-muted-foreground">Director, Global Talent Solutions</div>
                </div>
              </footer>
            </blockquote>

            <blockquote className="rounded-lg bg-background p-8">
              <p className="text-muted-foreground mb-4">
                "The video interview platform with AI analysis gives us insights we never had before. It's like having an expert interviewer on the team."
              </p>
              <footer className="flex items-center gap-4">
                <img 
                  src="/testimonial-3.jpg" 
                  alt="Emma Davis" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">Emma Davis</div>
                  <div className="text-sm text-muted-foreground">Founder, Next Level Recruiting</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Ready to Transform Your Agency?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the growing number of agencies using our platform to scale their business and provide better service to their clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/demo">Schedule Demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}