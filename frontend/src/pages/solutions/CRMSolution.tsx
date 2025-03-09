import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Brain,
  PieChart,
  Workflow,
  CheckCircle,
  BarChart,
  Bot,
  UserCheck,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/Button';

const features = [
  {
    icon: Users,
    title: "Client & Candidate Management",
    description: "Comprehensive management of both clients and candidates with automated tracking and relationship building."
  },
  {
    icon: MessageSquare,
    title: "Integrated Communication",
    description: "Real-time communication tools for both client and candidate interactions with instant profile updates."
  },
  {
    icon: Brain,
    title: "AI-Enhanced Intelligence",
    description: "Smart insights for client matching, candidate placement, and business growth opportunities."
  },
  {
    icon: PieChart,
    title: "Business Analytics",
    description: "Advanced reporting and analytics for client relationships, placements, and revenue tracking."
  }
];

const workflowSteps = [
  {
    icon: MessageSquare,
    title: "Client & Candidate Acquisition",
    description: "Streamlined onboarding for both clients and candidates with automated data capture."
  },
  {
    icon: UserCheck,
    title: "Smart Matching",
    description: "AI-powered matching of candidates to client requirements with success prediction."
  },
  {
    icon: Workflow,
    title: "Relationship Management",
    description: "Automated follow-ups and relationship nurturing for both clients and candidates."
  },
  {
    icon: Target,
    title: "Business Growth",
    description: "Track success metrics, identify opportunities, and grow your agency's business."
  }
];

const stats = [
  { value: "50%", label: "Faster Deal Closure" },
  { value: "80%", label: "Automation of Tasks" },
  { value: "3x", label: "Revenue Growth" },
  { value: "95%", label: "Client Satisfaction" }
];

export default function CRMSolution() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Complete Agency Management Solution
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform your recruitment agency with our comprehensive CRM solution. Manage clients, candidates, and business growth all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive CRM system combines powerful features with intuitive design to streamline your recruitment process.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border bg-card"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Candidate Engagement Workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined process for managing candidate relationships from initial contact to successful placement.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl border bg-card"
              >
                <div className="mb-4">
                  <step.icon className="w-10 h-10 text-primary mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Recruitment Process?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join leading recruitment agencies using QanDu's intelligent CRM system.
            </p>
            <Button size="lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 