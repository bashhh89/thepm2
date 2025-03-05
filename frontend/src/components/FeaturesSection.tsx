import React from "react";
import { Brain, Briefcase, FileText, MessageSquare, Settings, Users, Newspaper, Globe } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export default function FeaturesSection() {
  const features = [
    {
      title: "Smart Blog Creation",
      description: "Create engaging blog content with AI assistance. Get title suggestions, content ideas, and auto-generated images.",
      icon: <Newspaper className="w-6 h-6" />
    },
    {
      title: "Front-End Chat Widget",
      description: "AI-powered chat with multiple model support, lead generation, and multilingual capabilities.",
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      title: "Lead Management & CRM",
      description: "Visual Kanban board for pipeline management with drag-and-drop interface and comprehensive tracking.",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Document Creation",
      description: "Generate professional documents and presentations with AI assistance and rich formatting.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Internal AI Assistant",
      description: "Query data, analyze metrics, summarize customer interactions, and gain real-time business insights.",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Multilingual Support",
      description: "Create and manage content in multiple languages with automatic translation and localization.",
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: "Advanced Settings",
      description: "Comprehensive controls for AI providers, model selection, and language preferences.",
      icon: <Settings className="w-6 h-6" />
    }
  ];

  return (
    <section id="features" className="w-full py-12 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover the comprehensive capabilities of QanDu designed to transform your business operations
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className="transform transition-all hover:scale-105 hover:shadow-lg"
            />
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Ready to experience these features?</p>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}
