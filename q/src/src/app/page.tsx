'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight, Terminal, Sparkles, Presentation, FileText, Image, BarChart3, MessageSquare, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import MarketingLayout from './marketing-layout';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featureMenuOpen, setFeatureMenuOpen] = useState(false);
  const router = useRouter();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
      title: "AI Assistant",
      description: "Powerful conversational AI assistant to help with any business task",
      link: "/features/chat",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: <Briefcase className="h-6 w-6 text-purple-500" />,
    title: "Project Management",
      description: "Organize and accelerate your US expansion with AI-powered project tracking",
      link: "/features/projects",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: <Image className="h-6 w-6 text-green-500" />,
      title: "Image Generation",
      description: "Create stunning visuals for your brand in seconds",
      link: "/features/image-generator",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: <FileText className="h-6 w-6 text-amber-500" />,
      title: "Content Creation",
      description: "Generate marketing copy, product descriptions, and website content",
      link: "/features/content",
      color: "from-amber-600 to-yellow-600"
    },
    {
      icon: <Presentation className="h-6 w-6 text-red-500" />,
      title: "Presentation Builder",
      description: "Create compelling slide decks for investors and clients",
      link: "/features/presentations",
      color: "from-red-600 to-rose-600"
    },
    {
      icon: <Users className="h-6 w-6 text-cyan-500" />,
      title: "Lead Management",
      description: "Track and nurture potential clients with AI assistance",
      link: "/features/leads",
      color: "from-cyan-600 to-blue-600"
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section - adjusted top padding to account for header */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-24 flex items-center bg-gradient-to-b from-zinc-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full filter blur-3xl"></div>
            </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-12 md:mb-0 space-y-8">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold tracking-tight"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <span className="inline bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  The AI-powered Business OS for MENA Entrepreneurs
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-zinc-300 mt-6"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Expand to the US market with confidence using our comprehensive suite of AI tools designed specifically for MENA businesses.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-8"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <button
                  onClick={() => router.push('/register')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/20 transition-all"
                >
                Request Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                
                <button
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-zinc-700 text-base font-medium rounded-md text-white bg-zinc-800/50 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </button>
              </motion.div>
            </div>
            
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="aspect-video rounded-xl overflow-hidden border border-zinc-800 shadow-2xl shadow-blue-500/10 bg-zinc-900">
                <img 
                  src="/dashboard-preview.png" 
                alt="QanDu AI Platform Dashboard" 
                  className="w-full h-full object-cover"
                onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x450/1e293b/e2e8f0?text=QanDu+AI+Platform";
                }}
              />
            </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-4 py-2 shadow-lg transform rotate-3">
                <span className="text-white font-semibold flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Powered by AI
                </span>
            </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              All-in-One Business Platform
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Everything you need to expand your business to the US market - powered by the latest AI technology
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index} 
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={feature.link}>
                  <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/5">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
                    <div className="relative">
                      <div className="bg-zinc-800/50 rounded-full p-3 w-fit mb-5">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                      <p className="text-zinc-400 mb-4">{feature.description}</p>
                      <div className="flex items-center text-blue-500 font-medium">
                        <span>Explore</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
          </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            
            <div className="relative z-10 md:flex md:items-center md:justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl font-medium text-white italic mb-6">
                  "QanDu AI has revolutionized how we approach our US market entry. The AI tools have saved us countless hours and helped us navigate complex business decisions with confidence."
                </blockquote>
                <div>
                  <div className="font-medium text-white">Mohammed Al-Farsi</div>
                  <div className="text-zinc-400">CEO, TechVentures MENA</div>
                </div>
            </div>
            
              <div className="md:w-1/3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="text-4xl font-bold mb-2">94%</div>
                  <div className="font-medium mb-4">Time Saved on Market Research</div>
                  <p className="text-white/80 text-sm">
                    Our clients report dramatically faster business expansion with QanDu AI compared to traditional methods.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Accelerate Your US Expansion?
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
}
