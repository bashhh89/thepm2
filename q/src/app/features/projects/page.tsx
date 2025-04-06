'use client';

import React from 'react';
import { ArrowRight, Briefcase, Sparkles, CheckCircle, Clock, BarChart2, Users, Target, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsFeaturePage() {
  const features = [
    {
      icon: <Target className="h-6 w-6 text-purple-500" />,
      title: "Smart Planning",
      description: "AI-assisted project planning that identifies critical tasks, timelines, and dependencies for US market entry."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      title: "Progress Tracking",
      description: "Real-time dashboards showing project status, tasks completed, and milestones achieved."
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Risk Management",
      description: "Automatically identify and mitigate potential risks in your US expansion strategy."
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      title: "Timeline Management",
      description: "Visual timelines with automated reminders to keep your market entry on schedule."
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Team Collaboration",
      description: "Seamless collaboration between team members across different regions and time zones."
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-purple-500" />,
      title: "Performance Analytics",
      description: "Intelligent insights into project performance with recommendations for improvement."
    }
  ];

  const projectTypes = [
    {
      title: "Market Entry Strategy",
      description: "Complete project framework for entering the US market, including research, compliance, and go-to-market planning.",
      tag: "Most Popular"
    },
    {
      title: "Business Expansion",
      description: "Structured approach to scaling your existing US presence through new locations, products, or service offerings.",
      tag: ""
    },
    {
      title: "Product Launch",
      description: "End-to-end management of product launches in the US market, from compliance to marketing.",
      tag: ""
    },
    {
      title: "Partnership Development",
      description: "Project templates for identifying, securing, and managing strategic US partnerships.",
      tag: "High ROI"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-12 md:mb-0 space-y-6">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-purple-500/10 text-purple-500 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Project Management</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Execute Your US Expansion with Precision
              </h1>
              
              <p className="text-xl text-zinc-300 mt-6">
                AI-powered project management tailored specifically for MENA businesses expanding to the United States.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-8">
                <Link 
                  href="/projects"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg shadow-purple-500/20 transition-all"
                >
                  Start a Project
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
                  <div className="mx-auto text-sm text-zinc-400">QanDu AI Project Dashboard</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                        <Briefcase className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">US Cosmetics Launch</h3>
                        <p className="text-sm text-zinc-400">75% Complete</p>
                      </div>
                    </div>
                    <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="bg-zinc-800/50 p-3 rounded-lg text-center">
                      <p className="text-sm text-zinc-400">Tasks</p>
                      <p className="font-semibold text-white">24/32</p>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-lg text-center">
                      <p className="text-sm text-zinc-400">Days Left</p>
                      <p className="font-semibold text-white">18</p>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-lg text-center">
                      <p className="text-sm text-zinc-400">Team</p>
                      <p className="font-semibold text-white">6</p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/30 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-3">Latest Updates</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-zinc-300">FDA registration completed</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-zinc-300">Product labeling finalized for US market</span>
                      </li>
                      <li className="flex items-start">
                        <Clock className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-zinc-300">Distributor agreement pending legal review</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg px-4 py-2 shadow-lg transform rotate-3">
                <span className="text-white font-semibold flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI-Optimized
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
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Project Management Reimagined
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Our AI-powered tools streamline the complex process of US market entry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="bg-purple-500/10 rounded-full p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Types Section */}
      <section className="py-16 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Ready-to-Use Project Templates
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Start with expertly designed project frameworks tailored for MENA-to-US expansion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectTypes.map((projectType, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 relative"
              >
                {projectType.tag && (
                  <div className="absolute -top-3 -right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {projectType.tag}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-3 text-white">{projectType.title}</h3>
                <p className="text-zinc-400 mb-6">{projectType.description}</p>
                <Link 
                  href="/projects/new"
                  className="inline-flex items-center text-purple-500 hover:text-purple-400 font-medium"
                >
                  Create Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-1">
                  <img 
                    src="/project-workflow.jpg" 
                    alt="Project Workflow Visualization"
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/800x500/1e293b/a855f7?text=Project+Workflow";
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Intelligent Workflow Optimization
              </h2>
              
              <p className="text-lg text-zinc-300">
                Our AI continuously analyzes your project progress and suggests optimizations to accelerate your US market entry.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-purple-500/20 p-2 rounded-full mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Adaptive Task Sequencing</h4>
                    <p className="text-zinc-400">Automatically reorder tasks based on changing priorities and dependencies</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-500/20 p-2 rounded-full mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Resource Allocation</h4>
                    <p className="text-zinc-400">AI-optimized resource distribution to maximize efficiency and minimize costs</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-500/20 p-2 rounded-full mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Bottleneck Identification</h4>
                    <p className="text-zinc-400">Proactive identification of potential roadblocks before they impact your timeline</p>
                  </div>
                </li>
              </ul>
              
              <Link 
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg shadow-purple-500/20 transition-all mt-4"
              >
                See How It Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">NJ</span>
                </div>
              </div>
              <div>
                <blockquote className="text-xl font-medium text-white italic mb-4">
                  "QanDu AI's project management system cut our US market entry timeline by 40%. The AI-generated insights helped us navigate regulatory complexities we wouldn't have identified on our own."
                </blockquote>
                <div className="font-medium text-white">Nader Jawad</div>
                <div className="text-zinc-400">COO, Dubai Health Solutions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Ready to Accelerate Your US Expansion?
          </h2>
          
          <p className="text-lg text-zinc-300 mb-8">
            Join hundreds of MENA businesses using QanDu AI to manage their US market entry projects with precision and confidence
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <Link 
              href="/projects/new"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg shadow-purple-500/20 transition-all"
            >
              Start Your First Project
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