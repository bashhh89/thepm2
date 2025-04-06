'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Zap, Globe, Clock, Command, Brain, Shield } from 'lucide-react';
import MarketingLayout from '../../marketing-layout';

export default function ChatFeaturePage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
                  AI-Powered Chat Assistant for MENA Businesses
                </h1>
                <p className="text-xl text-zinc-300">
                  Leverage advanced AI chat technology to connect with US markets, understand cultural nuances, and drive your business growth.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/chat" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg flex items-center shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                  Try AI Chat
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/signup" className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-700 transition-all">
                  Sign Up Free
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden shadow-2xl">
                <div className="border-b border-zinc-700/50 p-4 flex items-center">
                  <MessageSquare className="h-6 w-6 text-blue-500 mr-3" />
                  <h3 className="font-medium">QanDu AI Chat</h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="bg-zinc-700/30 rounded-lg p-4">
                    <p className="text-sm text-zinc-300">How should we adapt our marketing strategy for the US market?</p>
                  </div>
                  <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                    <p className="text-sm text-zinc-200">Based on your MENA business profile, I recommend emphasizing your unique cultural perspective while adapting messaging to US preferences. Focus on:</p>
                    <ul className="text-sm text-zinc-300 mt-2 space-y-1 list-disc pl-5">
                      <li>Highlighting your global expertise with local understanding</li>
                      <li>Emphasizing quality and innovation rather than just pricing</li>
                      <li>Creating content that addresses US consumer pain points</li>
                      <li>Partnering with US influencers to build credibility</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-700/30 rounded-lg p-4">
                    <p className="text-sm text-zinc-300">Generate a sample social media post for our US launch</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              className="text-xl text-zinc-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our AI chat system is specifically designed to help MENA businesses navigate US market expansion
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-6 w-6 text-blue-500" />,
                title: "Multi-Model Intelligence",
                description: "Access multiple AI models optimized for different business tasks and scenarios"
              },
              {
                icon: <Globe className="h-6 w-6 text-purple-500" />,
                title: "Cultural Context Translation",
                description: "Automatically adapts communication styles between MENA and US business cultures"
              },
              {
                icon: <Command className="h-6 w-6 text-pink-500" />,
                title: "Command-Driven Workflow",
                description: "Use simple commands to generate documents, analysis, and business insights"
              },
              {
                icon: <Zap className="h-6 w-6 text-yellow-500" />,
                title: "Instant Responses",
                description: "Real-time AI assistance for time-sensitive business decisions and inquiries"
              },
              {
                icon: <Clock className="h-6 w-6 text-green-500" />,
                title: "24/7 Availability",
                description: "Access your AI assistant anytime, bridging time zone differences between MENA and US"
              },
              {
                icon: <Shield className="h-6 w-6 text-red-500" />,
                title: "Secure Business Data",
                description: "Enterprise-grade security with encrypted conversations and data protection"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-full p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Business Use Cases
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Market Research",
                description: "Analyze US market trends, customer preferences, and competitive landscapes with AI-powered research assistance",
                cta: "Explore Market Research"
              },
              {
                title: "Content Creation",
                description: "Generate culturally appropriate marketing materials, product descriptions, and business communications for US audiences",
                cta: "Try Content Creation"
              },
              {
                title: "Customer Support",
                description: "Provide 24/7 customer service with AI that understands both MENA and US communication styles and preferences",
                cta: "See Support Options"
              }
            ].map((useCase, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-700/30 rounded-xl p-8 flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-white">{useCase.title}</h3>
                <p className="text-zinc-400 mb-6 flex-grow">{useCase.description}</p>
                <Link href="/chat" className="text-blue-400 hover:text-blue-300 flex items-center transition-colors font-medium">
                  {useCase.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial */}
      <section className="py-20 bg-zinc-900/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              
              <blockquote className="text-xl font-medium italic mb-6">
                "QanDu AI's chat system has transformed how we communicate with our US clients. It understands cultural nuances that we ourselves sometimes miss, making our messaging more effective and relationships stronger."
              </blockquote>
              
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  SA
                </div>
                <div>
                  <div className="font-medium">Sarah Al-Madani</div>
                  <div className="text-zinc-500 text-sm">Marketing Director, Gulf Innovations</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 to-black relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Start Your AI-Powered Business Journey
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-zinc-300 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience how our specialized AI chat can transform your MENA-to-US business expansion.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/chat" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg flex items-center shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
              Try AI Chat Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/pricing" className="px-8 py-4 bg-zinc-800 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-700 transition-all">
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
} 