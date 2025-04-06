'use client';

import React from 'react';
import { ArrowRight, ArrowUpRight, MessageSquare, Briefcase, Image, FileText, Presentation, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      title: "AI Assistant",
      description: "Intelligent conversation and support for your US expansion journey",
      color: "from-blue-500/20 to-indigo-500/20",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/20",
      link: "/features/chat",
      benefits: [
        "Access multiple AI models with different strengths",
        "Context-aware responses tailored to MENA-to-US business needs",
        "Save hours of research with instant, accurate answers"
      ]
    },
    {
      icon: <Briefcase className="h-8 w-8 text-purple-500" />,
      title: "Project Management",
      description: "Organize and accelerate your US expansion with AI-powered tracking",
      color: "from-purple-500/20 to-pink-500/20",
      textColor: "text-purple-500",
      borderColor: "border-purple-500/20",
      link: "/features/projects",
      benefits: [
        "AI-generated project templates for US market entry",
        "Automated task prioritization and timeline management",
        "Risk identification and mitigation specific to MENA businesses"
      ]
    },
    {
      icon: <Image className="h-8 w-8 text-green-500" />,
      title: "Image Generation",
      description: "Create stunning visuals for your brand's US market presence",
      color: "from-green-500/20 to-emerald-500/20",
      textColor: "text-green-500",
      borderColor: "border-green-500/20",
      link: "/features/image-generator",
      benefits: [
        "Generate professional product and marketing images in seconds",
        "Create visuals that resonate with US audiences",
        "Save thousands on professional photography and design"
      ]
    },
    {
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      title: "Content Creation",
      description: "Generate marketing copy, product descriptions, and website content",
      color: "from-amber-500/20 to-yellow-500/20",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/20",
      link: "/features/content",
      benefits: [
        "Culturally adapted content that resonates with US audiences",
        "Industry-specific terminology for American markets",
        "Consistent brand voice across all content"
      ]
    },
    {
      icon: <Presentation className="h-8 w-8 text-red-500" />,
      title: "Presentation Builder",
      description: "Create compelling slide decks for investors and clients",
      color: "from-red-500/20 to-rose-500/20",
      textColor: "text-red-500",
      borderColor: "border-red-500/20",
      link: "/features/presentations",
      benefits: [
        "Professional slide decks designed for US business expectations",
        "Data visualization that highlights your competitive advantages",
        "Persuasive narratives that drive investment and partnerships"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-cyan-500" />,
      title: "Lead Management",
      description: "Track and nurture potential US clients with AI assistance",
      color: "from-cyan-500/20 to-blue-500/20",
      textColor: "text-cyan-500",
      borderColor: "border-cyan-500/20",
      link: "/features/leads",
      benefits: [
        "AI-powered lead scoring and prioritization",
        "Automated follow-up sequences tailored to American business culture",
        "Conversion insights based on successful MENA-to-US expansions"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-500/10 text-blue-500 mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>AI-Powered Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              The Complete Business OS for MENA Entrepreneurs
            </h1>
            
            <p className="text-xl text-zinc-300">
              Our comprehensive suite of AI tools is designed specifically to help MENA businesses successfully expand to the US market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-zinc-900 border ${feature.borderColor} rounded-xl overflow-hidden group hover:border-opacity-100 transition-all duration-300`}
              >
                <div className={`p-8 bg-gradient-to-br ${feature.color}`}>
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-lg bg-zinc-900/30 ${feature.textColor}`}>
                      {feature.icon}
                    </div>
                    <Link 
                      href={feature.link}
                      className="p-2 rounded-full bg-zinc-900/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowUpRight className={`h-5 w-5 ${feature.textColor}`} />
                    </Link>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-white">{feature.title}</h3>
                  <p className="text-zinc-300 mb-4">{feature.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className={`h-5 w-5 flex-shrink-0 ${feature.textColor} mr-2`}>•</span>
                        <span className="text-zinc-400 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={feature.link}
                    className={`inline-flex items-center ${feature.textColor} font-medium`}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 md:py-24 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                All Your Business Tools in One Unified Platform
              </h2>
              
              <p className="text-lg text-zinc-300 mb-8">
                QanDu AI doesn't just offer individual tools—it provides a completely integrated business operating system where every module works seamlessly with the others.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Seamless Data Flow</h3>
                  <p className="text-zinc-400 text-sm">Information moves effortlessly between modules, eliminating duplicate work and ensuring consistency.</p>
                </div>
                
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Unified AI Learning</h3>
                  <p className="text-zinc-400 text-sm">Our AI learns from all your interactions, becoming more effective across every module you use.</p>
                </div>
                
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Consistent User Experience</h3>
                  <p className="text-zinc-400 text-sm">Master one module and you'll feel at home in all the others, with intuitive, consistent design.</p>
                </div>
                
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Single Subscription</h3>
                  <p className="text-zinc-400 text-sm">One affordable plan gives you access to all features, with no hidden costs or add-ons.</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 relative">
                  {/* Central Hub */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Line to Chat */}
                    <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
                    {/* Line to Project */}
                    <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
                    {/* Line to Image */}
                    <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="2" />
                    {/* Line to Content */}
                    <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
                  </svg>
                  
                  {/* Module Icons */}
                  <div className="absolute top-[20%] left-[20%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="absolute top-[20%] left-[80%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="absolute top-[80%] left-[20%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <Image className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <div className="absolute top-[80%] left-[80%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Ready to Transform Your US Expansion Journey?
          </h2>
          
          <p className="text-lg text-zinc-300 mb-10 max-w-3xl mx-auto">
            Join hundreds of MENA entrepreneurs using QanDu AI to navigate the US market with confidence and success.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/20 transition-all"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 border border-zinc-700 text-base font-medium rounded-md text-white bg-zinc-800/50 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all"
            >
              Learn About Our Mission
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 