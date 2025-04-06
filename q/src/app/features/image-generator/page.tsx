'use client';

import React from 'react';
import { ArrowRight, Image, Sparkles, Paintbrush, Share2, Download, RotateCw, Layers, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ImageGeneratorFeaturePage() {
  const features = [
    {
      icon: <Paintbrush className="h-6 w-6 text-green-500" />,
      title: "AI-Powered Image Creation",
      description: "Generate professional-quality images from text descriptions in seconds. No design skills required."
    },
    {
      icon: <Layers className="h-6 w-6 text-green-500" />,
      title: "Multiple Style Options",
      description: "Choose from photorealistic, artistic, conceptual, and many other styles to match your brand's aesthetic."
    },
    {
      icon: <RotateCw className="h-6 w-6 text-green-500" />,
      title: "Unlimited Iterations",
      description: "Refine your images with unlimited revisions until they perfectly match your vision."
    },
    {
      icon: <Share2 className="h-6 w-6 text-green-500" />,
      title: "Direct Integration",
      description: "Use generated images directly in presentations, websites, and marketing materials."
    },
    {
      icon: <Download className="h-6 w-6 text-green-500" />,
      title: "High-Resolution Downloads",
      description: "Download images in high resolution for print and digital use with full usage rights."
    },
    {
      icon: <Zap className="h-6 w-6 text-green-500" />,
      title: "Fast Generation",
      description: "Create images in seconds, not minutes or hours, keeping your creative flow uninterrupted."
    }
  ];

  const useCases = [
    {
      title: "Product Visualization",
      description: "Create compelling product images for new market entries without expensive photo shoots.",
      imageSrc: "/product-visualization.jpg"
    },
    {
      title: "Marketing Campaigns",
      description: "Generate unique visuals for social media, ads, and marketing materials tailored to US audiences.",
      imageSrc: "/marketing-campaigns.jpg"
    },
    {
      title: "Brand Identity",
      description: "Explore visual brand elements like logos, color schemes, and design motifs before committing.",
      imageSrc: "/brand-identity.jpg"
    },
    {
      title: "Website Graphics",
      description: "Create consistent, on-brand imagery for your US-facing website and digital platforms.",
      imageSrc: "/website-graphics.jpg"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-green-500/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-12 md:mb-0 space-y-6">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-green-500/10 text-green-500 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>AI Image Generation</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Create Stunning Visuals for Your US Market Entry
              </h1>
              
              <p className="text-xl text-zinc-300 mt-6">
                Transform your ideas into professional images instantly with our AI image generator - designed specifically for MENA businesses entering the US market.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-8">
                <Link 
                  href="/image-generator"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg shadow-green-500/20 transition-all"
                >
                  Try Image Generator
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-800">
                    <img 
                      src="/placeholder-image-1.jpg" 
                      alt="AI-generated business meeting"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400/1e293b/4ade80?text=Business+Meeting";
                      }}
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-800">
                    <img 
                      src="/placeholder-image-2.jpg" 
                      alt="AI-generated product showcase"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400/1e293b/4ade80?text=Product+Showcase";
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-800">
                    <img 
                      src="/placeholder-image-3.jpg" 
                      alt="AI-generated office space"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400/1e293b/4ade80?text=Office+Space";
                      }}
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-800">
                    <img 
                      src="/placeholder-image-4.jpg" 
                      alt="AI-generated team collaboration"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400/1e293b/4ade80?text=Team+Collaboration";
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg px-4 py-2 shadow-lg transform rotate-3">
                <span className="text-white font-semibold flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  100% AI Generated
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              How It Works
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Create professional images in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-white">1</div>
              <h3 className="text-xl font-semibold mb-4 text-white mt-2">Describe Your Vision</h3>
              <p className="text-zinc-400 mb-4">Simply type a detailed description of the image you want to create, including style, mood, and specific elements.</p>
              <div className="bg-zinc-800 p-3 rounded-md text-zinc-300 text-sm">
                "A modern office space for a tech company in downtown New York with panoramic city views, minimalist design, and Middle Eastern artistic elements"
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-white">2</div>
              <h3 className="text-xl font-semibold mb-4 text-white mt-2">Generate Images</h3>
              <p className="text-zinc-400 mb-4">Click the generate button and our AI will create multiple high-quality images based on your description in seconds.</p>
              <div className="flex justify-center">
                <div className="animate-pulse w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Image className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-white">3</div>
              <h3 className="text-xl font-semibold mb-4 text-white mt-2">Download & Use</h3>
              <p className="text-zinc-400 mb-4">Select your favorite image, download in high resolution, and use it immediately in your marketing materials.</p>
              <div className="flex justify-center space-x-3">
                <div className="p-2 bg-zinc-800 rounded-full hover:bg-green-600 transition-colors cursor-pointer">
                  <Download className="h-5 w-5" />
                </div>
                <div className="p-2 bg-zinc-800 rounded-full hover:bg-green-600 transition-colors cursor-pointer">
                  <Share2 className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Powerful Features
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Our image generator includes everything you need to create stunning visuals for your US market entry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300"
              >
                <div className="bg-green-500/10 rounded-full p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Business Use Cases
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              See how MENA businesses are using QanDu AI's image generator to enhance their US market presence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300"
              >
                <div className="aspect-video bg-zinc-800">
                  <img 
                    src={useCase.imageSrc} 
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/800x450/1e293b/4ade80?text=${useCase.title.replace(' ', '+')}`;
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">{useCase.title}</h3>
                  <p className="text-zinc-400 mb-4">{useCase.description}</p>
                  <Link 
                    href="/image-generator"
                    className="inline-flex items-center text-green-500 hover:text-green-400 font-medium"
                  >
                    Try it now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">KA</span>
                </div>
              </div>
              <div>
                <blockquote className="text-xl font-medium text-white italic mb-4">
                  "QanDu AI's image generator has saved us thousands in photography costs. We created an entire product catalog for our US launch with custom images that perfectly match our brand aesthetic."
                </blockquote>
                <div className="font-medium text-white">Khalid Ahmed</div>
                <div className="text-zinc-400">CMO, Riyadh Fashion House</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
            Transform Your Visual Content Today
          </h2>
          
          <p className="text-lg text-zinc-300 mb-8">
            Join hundreds of MENA businesses using QanDu AI to create professional imagery for the US market
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <Link 
              href="/image-generator"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg shadow-green-500/20 transition-all"
            >
              Try Image Generator Now
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