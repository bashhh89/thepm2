import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Brain,
  LayoutGrid,
  Users,
  Bot,
  Bell,
  Globe,
  Zap,
  MessageCircle,
  UserCheck,
  BarChart,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../components/Button';

const features = [
  {
    icon: MessageSquare,
    title: "Smart Chat Interface",
    description: "Real-time messaging with AI-powered responses and rich media support."
  },
  {
    icon: Brain,
    title: "AI Assistant Integration",
    description: "Intelligent response suggestions and context-aware conversations."
  },
  {
    icon: LayoutGrid,
    title: "Conversation Management",
    description: "Organized threads, priority queueing, and team collaboration tools."
  },
  {
    icon: Globe,
    title: "Global User Experience",
    description: "Multi-language support, offline capabilities, and mobile optimization."
  }
];

const workflowSteps = [
  {
    icon: MessageCircle,
    title: "Conversation Initiation",
    description: "AI-powered greetings and initial context gathering."
  },
  {
    icon: Bot,
    title: "Interaction Flow",
    description: "Message processing with AI assistance and file handling."
  },
  {
    icon: CheckCircle,
    title: "Resolution Management",
    description: "Conversation closure and satisfaction tracking."
  },
  {
    icon: BarChart,
    title: "Quality Assurance",
    description: "Performance metrics and continuous improvement."
  }
];

const stats = [
  { value: "70%", label: "Faster Response Time" },
  { value: "24/7", label: "AI Availability" },
  { value: "15+", label: "Supported Languages" },
  { value: "98%", label: "User Satisfaction" }
];

export default function ChatWidgetSolution() {
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
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Intelligent Chat & Widget Solution
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform candidate engagement with AI-powered chat support and intelligent conversation management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Live Demo
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
              Our intelligent chat solution combines powerful features with AI assistance to enhance candidate engagement.
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
            <h2 className="text-3xl font-bold mb-4">Chat Workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined process for managing conversations from initiation to resolution.
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

      {/* Integration Preview Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Easily integrate our chat widget into your website with just a few lines of code.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <pre className="text-sm overflow-x-auto p-4 bg-muted rounded-lg">
              {`<script>
  window.QanDuChat = {
    companyId: 'your-company-id',
    theme: 'light',
    position: 'bottom-right'
  };
</script>
<script src="https://chat.qandu.ai/widget.js"></script>`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Candidate Experience?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join leading recruitment agencies using QanDu's intelligent chat solution.
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