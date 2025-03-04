import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Card } from './Card';
import { ArrowLeft, ChevronRight, Shield, Building, Users, Phone } from 'lucide-react';
import { NavigationHeader } from './NavigationHeader';
import { cn } from '../lib/utils';
import { useAuthStore } from '../utils/auth-store';

interface ContentPageProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const pageContent: Record<string, Record<string, { title: string; content: React.ReactNode }>> = {
  product: {
    solutions: {
      title: "Enterprise Solutions",
      content: (
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Transform Your Business with AI</h2>
            <p className="text-lg text-muted-foreground">QanDu provides cutting-edge AI solutions that help businesses automate processes, gain insights, and scale operations efficiently.</p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-2">AI-Powered Automation</h3>
                <p className="text-muted-foreground mb-4">Streamline workflows and reduce manual tasks with intelligent automation.</p>
                <Button variant="outline">Learn More</Button>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
                <p className="text-muted-foreground mb-4">Get actionable insights from your data with advanced analytics.</p>
                <Button variant="outline">Explore Analytics</Button>
              </Card>
            </div>
          </section>
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Featured Case Studies</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {['Retail', 'Healthcare', 'Finance'].map((industry) => (
                <Card key={industry} className="p-6">
                  <h3 className="font-semibold mb-2">{industry}</h3>
                  <p className="text-sm text-muted-foreground mb-4">How QanDu helped transform {industry.toLowerCase()} operations.</p>
                  <Link to={`/case-studies/${industry.toLowerCase()}`} className="text-primary hover:underline inline-flex items-center">
                    Read More <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )
    },
    "ai-assistant": {
      title: "AI Assistant",
      content: (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Intelligent Business Partner</h2>
            <p className="text-lg text-muted-foreground">Meet QanDu's AI Assistant - your 24/7 companion for business automation and insights.</p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                {
                  title: "Natural Conversations",
                  description: "Communicate naturally with an AI that understands context and intent"
                },
                {
                  title: "Multi-task Support",
                  description: "Handle multiple tasks simultaneously with intelligent task management"
                },
                {
                  title: "Custom Training",
                  description: "Adapt to your business needs with customizable learning"
                }
              ].map((feature, i) => (
                <Card key={i} className="p-6">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Key Capabilities</h2>
            <div className="grid gap-4">
              {[
                "Document Analysis & Summarization",
                "Meeting Transcription & Action Items",
                "Email Response Suggestions",
                "Data Analysis & Visualization",
                "Process Automation"
              ].map((capability, i) => (
                <Card key={i} className="p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-medium">{i + 1}</span>
                    </div>
                    <span className="font-medium">{capability}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )
    }
  },
  resources: {
    documentation: {
      title: "Documentation",
      content: (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Quick Start Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">Get up and running with QanDu in minutes.</p>
                <Button variant="outline">Start Here</Button>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">API Reference</h3>
                <p className="text-sm text-muted-foreground mb-4">Detailed API documentation for developers.</p>
                <Button variant="outline">View APIs</Button>
              </Card>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Authentication",
                "Webhooks",
                "Rate Limits",
                "Error Handling",
                "Best Practices",
                "SDK Examples"
              ].map((topic, i) => (
                <Link
                  key={i}
                  to={`/docs/${topic.toLowerCase().replace(" ", "-")}`}
                  className="block p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <span className="font-medium">{topic}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )
    }
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-8">
          <section>
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <div className="grid gap-8">
              {[
                {
                  title: "Information We Collect",
                  content: "We collect information that you provide directly to us, information we obtain automatically when you use our services, and information from third-party sources."
                },
                {
                  title: "How We Use Your Information",
                  content: "We use the information we collect to provide, maintain, and improve our services, develop new features, protect the security of our users, and comply with legal obligations."
                },
                {
                  title: "Information Sharing",
                  content: "We do not share your personal information except in limited circumstances, such as with your consent, with service providers, or when required by law."
                }
              ].map((section) => (
                <Card key={section.title} className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground">{section.content}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Your Privacy Rights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Access your personal information",
                "Request deletion of your data",
                "Opt-out of marketing communications",
                "Update your preferences",
                "Export your data",
                "Report concerns"
              ].map((right) => (
                <div key={right} className="flex items-center p-4 border rounded-lg">
                  <Shield className="h-5 w-5 mr-3 text-primary" />
                  <span>{right}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )
    }
  },

  company: {
    about: {
      title: "About QanDu",
      content: (
        <div className="space-y-12">
          <section>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-xl text-muted-foreground">
                  Empowering businesses with intelligent solutions that drive growth and innovation.
                </p>
              </div>
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-purple-600/10">
                <div className="text-4xl font-bold mb-4">2000+</div>
                <p className="text-muted-foreground">Businesses Empowered</p>
              </Card>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building,
                title: "Our Story",
                content: "Founded in 2020, QanDu has grown from a startup to a leading provider of AI solutions."
              },
              {
                icon: Users,
                title: "Our Team",
                content: "A diverse team of experts passionate about technology and innovation."
              },
              {
                icon: Shield,
                title: "Our Values",
                content: "Committed to excellence, innovation, and customer success."
              }
            ].map((item) => (
              <Card key={item.title} className="p-6">
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.content}</p>
              </Card>
            ))}
          </section>

          <section className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-8">Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Chen", role: "CEO & Co-founder" },
                { name: "Michael Rodriguez", role: "CTO" },
                { name: "Emma Thompson", role: "Head of AI" }
              ].map((member) => (
                <Card key={member.name} className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 mx-auto mb-4" />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="border-t pt-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-muted-foreground mb-8">
                We're always looking for talented individuals to join our team and help shape the future of AI.
              </p>
              <div className="flex justify-center gap-4">
                <Button>View Open Positions</Button>
                <Button variant="outline">Learn About Culture</Button>
              </div>
            </div>
          </section>
        </div>
      )
    },
    
    contact: {
      title: "Contact Us",
      content: (
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you. Our team is always here to help.
            </p>
          </section>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Phone,
                title: "Sales",
                contact: "sales@qandu.ai",
                details: "For business inquiries"
              },
              {
                icon: Users,
                title: "Support",
                contact: "support@qandu.ai",
                details: "24/7 customer support"
              },
              {
                icon: Building,
                title: "Press",
                contact: "press@qandu.ai",
                details: "Media inquiries"
              }
            ].map((item) => (
              <Card key={item.title} className="p-6">
                <div className="flex flex-col items-center text-center">
                  <item.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-primary mb-1">{item.contact}</p>
                  <p className="text-sm text-muted-foreground">{item.details}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full p-2 border rounded-md h-32"
                  placeholder="Tell us more..."
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </Card>
        </div>
      )
    }
  },
  pricing: {
    plans: {
      title: "Pricing Plans",
      content: (
        <div className="space-y-12">
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that best fits your needs. All plans include core features.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" className="rounded-full">Monthly Billing</Button>
              <Button variant="outline" className="rounded-full">Annual Billing</Button>
            </div>
          </section>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$49",
                description: "Perfect for small businesses and startups",
                features: [
                  "Up to 5 team members",
                  "Basic AI assistant features",
                  "5GB document storage",
                  "Email support",
                  "Basic analytics"
                ]
              },
              {
                name: "Professional",
                price: "$99",
                description: "Ideal for growing businesses",
                popular: true,
                features: [
                  "Up to 20 team members",
                  "Advanced AI capabilities",
                  "25GB document storage",
                  "Priority support",
                  "Advanced analytics",
                  "Custom integrations"
                ]
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with specific needs",
                features: [
                  "Unlimited team members",
                  "Custom AI model training",
                  "Unlimited storage",
                  "24/7 dedicated support",
                  "Custom analytics",
                  "API access",
                  "SLA guarantee"
                ]
              }
            ].map((plan) => (
              <Card 
                key={plan.name} 
                className={cn(
                  "p-8 relative",
                  plan.popular && "border-primary shadow-lg"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <svg
                        className="h-5 w-5 text-primary mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={cn(
                    "w-full",
                    plan.popular ? "bg-primary" : "bg-muted"
                  )}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </Card>
            ))}
          </div>

          <section className="border-t pt-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our pricing and features.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  q: "Can I change plans later?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans."
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes, all plans come with a 14-day free trial. No credit card required."
                },
                {
                  q: "What's included in the Enterprise plan?",
                  a: "Enterprise plans include custom features, dedicated support, and special compliance requirements. Contact us for details."
                }
              ].map((faq) => (
                <Card key={faq.q} className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="border-t pt-12">
            <Card className="p-8 bg-primary/5">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
                <p className="text-muted-foreground mb-6">
                  Get in touch with our sales team to discuss your specific requirements.
                </p>
                <div className="flex justify-center gap-4">
                  <Button>Contact Sales</Button>
                  <Button variant="outline">View Documentation</Button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      )
    }
  }
};

export default function ContentPage({ title, subtitle, children }: ContentPageProps) {
  const { category = '', page = '' } = useParams();
  const { isAuthenticated } = useAuthStore();
  const content = pageContent[category]?.[page];
  
  const pageTitle = title || content?.title || (
    page && category 
      ? `${page.charAt(0).toUpperCase() + page.slice(1)} - ${category.charAt(0).toUpperCase() + category.slice(1)}`
      : 'Information'
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        isAuthenticated={isAuthenticated}
        onSignIn={() => window.location.href = '/sign-in'}
        onSignUp={() => window.location.href = '/sign-up'}
        onLogout={() => window.location.href = '/sign-out'}
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {pageTitle}
            </h1>
            {subtitle && (
              <p className="text-xl text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {children || content?.content || (
              <div className="space-y-8">
                <Card className="p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                    <p className="text-muted-foreground mb-8">
                      This page is currently under construction. Please check back later for more information about {page}.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => window.location.href = '/'}>
                        Return Home
                      </Button>
                      <Button variant="outline" onClick={() => window.location.href = '/contact'}>
                        Contact Us
                      </Button>
                    </div>
                  </div>
                </Card>

                <section className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Explore Other Resources</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { title: "Documentation", path: "/pages/resources/documentation" },
                      { title: "Support", path: "/pages/resources/support" },
                      { title: "Community", path: "/pages/resources/community" }
                    ].map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={cn(
                          "block p-6 rounded-lg border",
                          "hover:bg-accent/50 transition-colors",
                          "flex items-center justify-between"
                        )}
                      >
                        <span className="font-medium">{link.title}</span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}