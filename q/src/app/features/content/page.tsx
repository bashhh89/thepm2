'use client';

import React from 'react';
import { ArrowRight, FileText, Sparkles, BookOpen, Globe, BarChart, Tag, TextCursorInput, FileEdit, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ContentFeaturePage() {
  const features = [
    {
      icon: <TextCursorInput className="h-6 w-6 text-amber-500" />,
      title: "AI Copywriting",
      description: "Generate compelling marketing copy, product descriptions, and website content tailored for US audiences."
    },
    {
      icon: <Globe className="h-6 w-6 text-amber-500" />,
      title: "Cross-Cultural Adaptation",
      description: "Automatically adapt your content for American cultural preferences and language nuances."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-amber-500" />,
      title: "Blog & Article Creation",
      description: "Create SEO-optimized blog posts and articles that establish your authority in the US market."
    },
    {
      icon: <Tag className="h-6 w-6 text-amber-500" />,
      title: "US Market Terminology",
      description: "Ensure your content uses the correct industry-specific terms and phrases for the American market."
    },
    {
      icon: <FileEdit className="h-6 w-6 text-amber-500" />,
      title: "Instant Editing",
      description: "Refine and polish existing content with a single click to match your brand voice."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-amber-500" />,
      title: "Content Variations",
      description: "Generate multiple versions of the same content to test different approaches and messages."
    }
  ];

  const contentTypes = [
    {
      title: "Website Copy",
      description: "Create compelling website content that resonates with US consumers, from home pages to product descriptions.",
      example: "Our cutting-edge software helps businesses streamline operations, reducing overhead by up to 35% while improving customer satisfaction scores."
    },
    {
      title: "Social Media Content",
      description: "Generate engaging posts, captions, and hashtags optimized for American social media platforms and audiences.",
      example: "Ready to revolutionize your workflow? Our AI-powered solution just dropped, and early users are reporting 40% time savings! #ProductivityHack #TechInnovation"
    },
    {
      title: "Email Campaigns",
      description: "Create compelling email sequences that nurture leads and convert customers in the US market.",
      example: "Subject: Exclusive Early Access: Transform Your Business Operations\n\nDear [Name],\n\nAs a business leader always ahead of the curve, we're offering you exclusive early access to our game-changing platform..."
    },
    {
      title: "Sales & Pitch Materials",
      description: "Develop persuasive sales copy, pitch decks, and proposal content tailored to US business expectations.",
      example: "By implementing our solution, your company stands to increase operational efficiency by 28% while reducing compliance risks by 40% - all within the first quarter of adoption."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-12 md:mb-0 space-y-6">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-amber-500/10 text-amber-500 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>AI Content Generation</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Communicate Perfectly with US Audiences
              </h1>
              
              <p className="text-xl text-zinc-300 mt-6">
                Our AI content generator creates compelling, culturally-resonant copy that helps MENA businesses connect authentically with American customers.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-8">
                <Link 
                  href="/content"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg shadow-amber-500/20 transition-all"
                >
                  Generate Content Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-zinc-700 text-base font-medium rounded-md text-white bg-zinc-800/50 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 shadow-xl rounded-xl overflow-hidden">
                <div className="bg-zinc-800/50 px-4 py-2 flex items-center border-b border-zinc-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-sm text-zinc-400">QanDu AI Content Generator</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center">
                      <div className="bg-amber-500/20 p-2 rounded-lg mr-3">
                        <FileText className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Product Description Generator</h3>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Product Information</label>
                      <div className="bg-zinc-900 p-3 rounded-md text-zinc-300 text-sm border border-zinc-700">
                        A luxury skincare oil made from Moroccan argan oil, designed for anti-aging benefits
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Target Audience</label>
                      <div className="bg-zinc-900 p-3 rounded-md text-zinc-300 text-sm border border-zinc-700">
                        US luxury skincare consumers, ages 35-55, concerned about aging
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Generated Content</label>
                      <div className="bg-zinc-900 p-3 rounded-md text-zinc-300 text-sm border border-zinc-700">
                        <p className="mb-2"><strong>Luxurious Moroccan Argan Elixir</strong></p>
                        <p>Discover the secret that Moroccan women have treasured for centuries. Our premium Argan Facial Oil delivers intense hydration while fighting visible signs of aging with its powerful natural antioxidants.</p>
                        <p className="mt-2">This lightweight, fast-absorbing formula reduces fine lines and wrinkles while restoring your skin's youthful radiance. Ethically sourced from women's cooperatives in Morocco and formulated for the discerning American skincare enthusiast.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-lg px-4 py-2 shadow-lg transform rotate-3">
                <span className="text-white font-semibold flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  US Market Optimized
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
              AI-Powered Content Features
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Create compelling content that resonates with American audiences in minutes, not hours
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="bg-amber-500/10 rounded-full p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-16 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
              Content That Converts
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Generate any type of content you need for your US market expansion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contentTypes.map((contentType, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-3 text-white">{contentType.title}</h3>
                <p className="text-zinc-400 mb-4">{contentType.description}</p>
                <div className="bg-zinc-800/70 p-4 rounded-lg border-l-4 border-amber-500 mt-4">
                  <p className="text-sm text-zinc-300 italic">{contentType.example}</p>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/content"
                    className="inline-flex items-center text-amber-500 hover:text-amber-400 font-medium"
                  >
                    Try {contentType.title} Generator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Intelligence Section */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-amber-900/20 to-yellow-900/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Globe className="h-10 w-10 text-amber-500" />
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-amber-500/5 to-yellow-500/5">
                  <h3 className="text-xl font-semibold mb-4 text-white">Before and After: Cultural Intelligence</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Original Content (MENA-focused)</div>
                      <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700 text-sm text-zinc-300">
                        Our company has been a family business for generations, offering the finest quality products with traditional craftsmanship that honors our heritage.
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-amber-500" />
                    </div>
                    
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">AI-Adapted for US Market</div>
                      <div className="bg-zinc-800/50 p-3 rounded border border-amber-500/30 text-sm text-zinc-300">
                        Founded on family traditions and now bringing innovation to the global stage, we combine time-honored craftsmanship with cutting-edge technology to deliver premium products that stand out in today's competitive market.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
                Cross-Cultural Intelligence
              </h2>
              
              <p className="text-lg text-zinc-300">
                Our AI doesn't just translate words—it understands cultural contexts, preferences, and communication styles that resonate with US consumers.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-amber-500/20 p-2 rounded-full mr-3 mt-1">
                    <BarChart className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">American Value Proposition Framing</h4>
                    <p className="text-zinc-400">Adapts your messaging to emphasize innovation, efficiency, and practical benefits that American customers prioritize</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-500/20 p-2 rounded-full mr-3 mt-1">
                    <BarChart className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Regional Language Nuances</h4>
                    <p className="text-zinc-400">Adjusts terminology, idioms, and expressions to match US regional preferences and industry standards</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-500/20 p-2 rounded-full mr-3 mt-1">
                    <BarChart className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Trust Signal Integration</h4>
                    <p className="text-zinc-400">Incorporates elements that build credibility with American audiences, such as testimonials, data points, and social proof</p>
                  </div>
                </li>
              </ul>
              
              <Link 
                href="/content"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg shadow-amber-500/20 transition-all mt-4"
              >
                Try Cultural Adaptation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/20 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">LK</span>
                </div>
              </div>
              <div>
                <blockquote className="text-xl font-medium text-white italic mb-4">
                  "QanDu AI transformed our messaging completely. We struggled for months trying to connect with US customers before we found this platform. Now our content resonates perfectly with American audiences, and our conversion rates have increased by 68%."
                </blockquote>
                <div className="font-medium text-white">Layla Karimi</div>
                <div className="text-zinc-400">Marketing Director, Persian Artisan Exports</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
            Create Content That Speaks to American Audiences
          </h2>
          
          <p className="text-lg text-zinc-300 mb-8">
            Join hundreds of MENA businesses using QanDu AI to create compelling content that resonates with US customers
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <Link 
              href="/content"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg shadow-amber-500/20 transition-all"
            >
              Start Creating Content
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 border border-zinc-700 text-base font-medium rounded-md text-white bg-zinc-800/50 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 