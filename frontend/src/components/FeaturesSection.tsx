import React from "react";
import FeatureCard from "./FeatureCard";
import { MessageSquare, Users, Brain, FileText, Briefcase, Settings } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Front-End Chat Widget",
      description: "AI-powered chat with multiple model support, lead generation, chat history tracking, and multilingual capabilities.",
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      title: "Lead Management & CRM",
      description: "Visual Kanban board for pipeline management with drag-and-drop interface, customizable stages, and comprehensive tracking.",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "AI-Powered Blog Creation",
      description: "Intelligent content creation with title suggestions, improvement recommendations, and SEO optimization features.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Internal AI Assistant",
      description: "Query lead data, analyze CRM metrics, summarize customer interactions, and gain real-time business insights.",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Job/Career Management",
      description: "AI-powered job listing generation, career page management, and application tracking in one seamless interface.",
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      title: "Settings & Configuration",
      description: "Comprehensive system controls for AI providers, model selection, API configuration, and language preferences.",
      icon: <Settings className="w-6 h-6" />
    }
  ];

  return (
    <section id="features" className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover the powerful capabilities of Nexus Suite designed to transform your business operations
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
