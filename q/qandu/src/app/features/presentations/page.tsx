'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Presentation, Sparkles, LayoutGrid, LineChart, PenTool, RefreshCw, Zap, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function PresentationFeaturePage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-red-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-red-500/10 text-red-500 mb-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>AI-Powered Presentations</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Create Stunning Presentations in Minutes, Not Hours
                </h1>
                
                <p className="text-xl text-zinc-300 mb-8">
                  Our AI presentation builder helps MENA entrepreneurs create professional slide decks that resonate with US investors, partners, and customers.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <Link 
                    href="/presentations"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg shadow-red-500/20 transition-all"
                  >
                    Create Presentation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-6 py-3 border border-zinc-700 text-base font-medium rounded-md text-white bg-zinc-800/50 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all"
                  >
                    Sign Up Free
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 relative">
              <motion.div 
                className="relative rounded-xl overflow-hidden border border-zinc-800 shadow-2xl shadow-red-500/10"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="aspect-video bg-gradient-to-br from-red-900/20 via-pink-900/20 to-purple-900/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Presentation className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-zinc-200">Presentation Builder Preview</p>
                      <p className="text-sm text-zinc-400">Generate professional slides that impress</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
              Your Unfair Advantage for Business Presentations
            </h2>
            
            <p className="text-lg text-zinc-300">
              Create professional, captivating presentations that meet US business standards without the learning curve or design skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-red-500/50 transition-colors">
              <LayoutGrid className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Templates</h3>
              <p className="text-zinc-400">Access dozens of US-standard business templates for pitch decks, market entry plans, and partner presentations.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-red-500/50 transition-colors">
              <LineChart className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Visualization</h3>
              <p className="text-zinc-400">Transform complex data into compelling charts and graphics that highlight your business's potential.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-red-500/50 transition-colors">
              <PenTool className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cultural Adaptation</h3>
              <p className="text-zinc-400">AI ensures your content uses US-appropriate language, examples, and cultural references.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-red-500/50 transition-colors">
              <RefreshCw className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unlimited Revisions</h3>
              <p className="text-zinc-400">Generate multiple versions and refine your presentations until they're perfect for your audience.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-red-500/50 transition-colors">
              <Zap className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">One-Click Export</h3>
              <p className="text-zinc-400">Download your presentations in PPTX format, ready for Microsoft PowerPoint or direct presentation.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-red-500/50 transition-colors">
              <MessageSquare className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Presentation Coaching</h3>
              <p className="text-zinc-400">Get AI suggestions for delivery, anticipating questions, and adapting to American presentation styles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
              Presentation Types Built for Your US Expansion
            </h2>
            
            <p className="text-lg text-zinc-300">
              Specialized templates designed for MENA businesses entering the American market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-pink-900/20 to-transparent z-0"></div>
              <div className="relative z-10 p-8">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400">
                    Most Popular
                  </span>
                  <span className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    01
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mt-4 mb-2">Investor Pitch Deck</h3>
                <p className="text-zinc-400 mb-4">
                  A professionally structured presentation designed to attract US venture capital and angel investors. Highlights your unique value proposition, market opportunity, and growth metrics formatted to American investor expectations.
                </p>
                
                <Link 
                  href="/presentations/templates/investor-pitch"
                  className="inline-flex items-center text-red-500 hover:text-red-400 font-medium"
                >
                  View Template
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-pink-900/20 to-transparent z-0"></div>
              <div className="relative z-10 p-8">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400">
                    High Conversion
                  </span>
                  <span className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    02
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mt-4 mb-2">Partnership Proposal</h3>
                <p className="text-zinc-400 mb-4">
                  Showcase your MENA business as an ideal partner for US companies. Emphasizes complementary strengths, market access benefits, and clear partnership structure in line with American business expectations.
                </p>
                
                <Link 
                  href="/presentations/templates/partnership"
                  className="inline-flex items-center text-red-500 hover:text-red-400 font-medium"
                >
                  View Template
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-pink-900/20 to-transparent z-0"></div>
              <div className="relative z-10 p-8">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400">
                    Strategic
                  </span>
                  <span className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    03
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mt-4 mb-2">Market Entry Strategy</h3>
                <p className="text-zinc-400 mb-4">
                  Detail your plan for entering the US market with timelines, resource allocation, and growth projections. Formatted to provide clarity and confidence to stakeholders, teams, and potential partners.
                </p>
                
                <Link 
                  href="/presentations/templates/market-entry"
                  className="inline-flex items-center text-red-500 hover:text-red-400 font-medium"
                >
                  View Template
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-zinc-800 hover:border-red-500/50 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-pink-900/20 to-transparent z-0"></div>
              <div className="relative z-10 p-8">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-amber-500/20 text-amber-400">
                    Client-Facing
                  </span>
                  <span className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    04
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mt-4 mb-2">Product & Service Showcase</h3>
                <p className="text-zinc-400 mb-4">
                  Present your offerings in ways that clearly communicate value to American clients. Addresses common US customer concerns and highlights benefits using cultural references and examples that resonate with the US market.
                </p>
                
                <Link 
                  href="/presentations/templates/product-showcase"
                  className="inline-flex items-center text-red-500 hover:text-red-400 font-medium"
                >
                  View Template
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-black/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">MA</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">Mohammad Al-Fahim</h3>
                <p className="text-zinc-400">CEO, Dubai Tech Ventures</p>
              </div>
              
              <div className="md:w-2/3">
                <svg className="h-8 w-8 text-red-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0
                  01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804
                  .167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                
                <p className="text-lg text-zinc-300 italic mb-4">
                  "QanDu's Presentation Builder transformed our pitch to US investors. Before, we were getting rejected—our presentations looked 'unprofessional' by American standards. After using the AI templates and cultural adaptation features, our next pitch secured $1.2M in funding. The investors specifically commented on how well-structured and clear our presentation was."
                </p>
                
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-zinc-400 text-sm">Results after 3 months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
            Ready to Create Presentations that Win in the US Market?
          </h2>
          
          <p className="text-lg text-zinc-300 mb-10 max-w-3xl mx-auto">
            Join hundreds of MENA entrepreneurs using QanDu AI to create professional presentations that impress American audiences.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <Link 
              href="/presentations"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg shadow-red-500/20 transition-all"
            >
              Create Your First Presentation
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