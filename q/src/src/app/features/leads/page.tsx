'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles, Database, FilterX, BarChart, Clock, Mail, ChevronRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LeadsFeaturePage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
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
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-cyan-500/10 text-cyan-500 mb-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>AI-Powered Lead Management</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Turn US Prospects into Loyal Customers
                </h1>
                
                <p className="text-xl text-zinc-300 mb-8">
                  Our AI-powered lead management system helps MENA businesses understand, engage, and convert American leads with cultural intelligence.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <Link 
                    href="/leads"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    Manage Your Leads
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
                className="relative rounded-xl overflow-hidden border border-zinc-800 shadow-2xl shadow-cyan-500/10"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="aspect-video bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-zinc-200">Lead Management Dashboard</p>
                      <p className="text-sm text-zinc-400">Track, nurture and convert US leads with AI</p>
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
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Smart Lead Management for US Market Success
            </h2>
            
            <p className="text-lg text-zinc-300">
              Our AI understands the nuances of American business culture to help you qualify, prioritize, and engage with US leads effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
              <Database className="h-10 w-10 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Intelligent Lead Scoring</h3>
              <p className="text-zinc-400">AI automatically evaluates lead quality based on industry-specific criteria and US market relevance.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
              <FilterX className="h-10 w-10 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cultural Context Filter</h3>
              <p className="text-zinc-400">Evaluate leads with cultural intelligence, understanding US corporate hierarchies and decision-making processes.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
              <BarChart className="h-10 w-10 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Conversion Analytics</h3>
              <p className="text-zinc-400">Track lead journey with metrics tailored to MENA-to-US business contexts, identifying successful patterns.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
              <Clock className="h-10 w-10 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Follow-up Automation</h3>
              <p className="text-zinc-400">Schedule culturally-appropriate follow-ups with timing optimized for US business practices and time zones.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
              <Mail className="h-10 w-10 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Communications</h3>
              <p className="text-zinc-400">Generate email templates and outreach messages tailored to American business communication styles.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
              <CheckCircle className="h-10 w-10 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Deal Probability</h3>
              <p className="text-zinc-400">AI predicts closing likelihood based on lead behavior patterns and comparison with successful MENA-to-US deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              How QanDu Leads Management Works
            </h2>
            
            <p className="text-lg text-zinc-300">
              A streamlined process designed for MENA businesses navigating the US market.
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500 hidden md:block"></div>
            
            <div className="space-y-12 relative">
              {/* Step 1 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <h3 className="text-xl font-bold mb-2 text-white">Lead Capture & Enrichment</h3>
                  <p className="text-zinc-400">
                    Gather leads from multiple sources while our AI automatically enriches profiles with relevant US business data and cultural context.
                  </p>
                </div>
                <div className="md:w-12 flex justify-center relative z-10 my-6 md:my-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                      <div className="h-4 w-full rounded-t-lg bg-zinc-800/50"></div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-zinc-800/50 rounded"></div>
                        <div className="h-4 w-1/2 bg-zinc-800/50 rounded"></div>
                        <div className="h-4 w-5/6 bg-zinc-800/50 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right order-1 md:order-2">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                      <div className="h-4 w-full rounded-t-lg bg-zinc-800/50"></div>
                    </div>
                    <div className="p-4">
                      <div className="flex space-x-2">
                        <div className="h-16 w-1/3 bg-green-500/20 rounded"></div>
                        <div className="h-16 w-1/3 bg-yellow-500/20 rounded"></div>
                        <div className="h-16 w-1/3 bg-red-500/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-12 flex justify-center relative z-10 my-6 md:my-0 order-2 md:order-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 order-3">
                  <h3 className="text-xl font-bold mb-2 text-white">Prioritization & Scoring</h3>
                  <p className="text-zinc-400">
                    Our AI analyzes leads based on fit with successful MENA-to-US expansion patterns and prioritizes high-potential opportunities.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <h3 className="text-xl font-bold mb-2 text-white">Smart Engagement</h3>
                  <p className="text-zinc-400">
                    Engage with leads using AI-generated communications that respect American business etiquette and cultural expectations.
                  </p>
                </div>
                <div className="md:w-12 flex justify-center relative z-10 my-6 md:my-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                      <div className="h-4 w-full rounded-t-lg bg-zinc-800/50"></div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-zinc-800/50 rounded"></div>
                        <div className="h-4 w-full bg-zinc-800/50 rounded"></div>
                        <div className="h-4 w-3/4 bg-zinc-800/50 rounded"></div>
                        <div className="h-8 w-1/3 bg-cyan-500/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right order-1 md:order-2">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                      <div className="h-4 w-full rounded-t-lg bg-zinc-800/50"></div>
                    </div>
                    <div className="p-4">
                      <div className="h-32 w-full bg-gradient-to-r from-green-500/20 via-green-500/10 to-green-500/5 rounded relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-500/30 rounded"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-500/40 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-12 flex justify-center relative z-10 my-6 md:my-0 order-2 md:order-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 order-3">
                  <h3 className="text-xl font-bold mb-2 text-white">Conversion & Analysis</h3>
                  <p className="text-zinc-400">
                    Convert leads into customers while our AI analyzes successful interactions to continuously improve your US market approach.
                  </p>
                </div>
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
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">RA</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">Rania Al-Masri</h3>
                <p className="text-zinc-400">Sales Director, Cairo Software Solutions</p>
              </div>
              
              <div className="md:w-2/3">
                <svg className="h-8 w-8 text-cyan-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0
                  01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804
                  .167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                
                <p className="text-lg text-zinc-300 italic mb-4">
                  "Before QanDu, our conversion rate with US leads was under 5%. We didn't understand why our approaches weren't working. The AI lead scoring and cultural intelligence features revealed we were targeting the wrong decision-makers and using communication styles that didn't resonate. After 3 months with QanDu's lead management, our conversion rate jumped to 22%, and our sales cycle shortened by 40%."
                </p>
                
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-zinc-400 text-sm">4.4x ROI in first quarter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Start Converting More US Leads Today
          </h2>
          
          <p className="text-lg text-zinc-300 mb-10 max-w-3xl mx-auto">
            Join the growing community of MENA businesses succeeding in the US market with QanDu's AI-powered lead management.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <Link 
              href="/leads"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/20 transition-all"
            >
              Start Managing Leads
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