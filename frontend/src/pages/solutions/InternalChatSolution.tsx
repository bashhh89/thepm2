import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Brain,
  Settings,
  Bot,
  Database,
  Globe,
  Zap,
  Bell,
  Search,
  RefreshCw,
  ArrowRight,
  Users
} from 'lucide-react';
import { Button } from '../../components/Button';

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Chat Interface",
    description: "Seamless integration with your data for comprehensive insights and real-time responses."
  },
  {
    icon: Settings,
    title: "System Prompts",
    description: "Customizable prompts to tailor AI responses to your specific needs and workflows."
  },
  {
    icon: Bot,
    title: "Fine-Tuned Agents",
    description: "Create and manage AI agents trained on your data for accurate, context-aware responses."
  },
  {
    icon: Globe,
    title: "Enhanced User Experience",
    description: "Responsive design with mobile optimization and multi-language support."
  }
];

const workflowSteps = [
  {
    icon: Search,
    title: "Query Initiation",
    description: "Users start queries with immediate AI assistance and context gathering."
  },
  {
    icon: Brain,
    title: "Response Generation",
    description: "AI processes queries using fine-tuned models and system prompts."
  },
  {
    icon: Database,
    title: "Interaction Management",
    description: "Track history and provide data-driven support and insights."
  },
  {
    icon: RefreshCw,
    title: "Continuous Learning",
    description: "Regular updates and improvements based on usage patterns."
  }
];

const stats = [
  { value: "90%", label: "Faster Query Resolution" },
  { value: "24/7", label: "AI Availability" },
  { value: "15+", label: "Supported Languages" },
  { value: "98%", label: "Response Accuracy" }
];

export default function InternalChatSolution() {
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
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Internal Chat
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Access your recruitment data through an intelligent chat interface. Get instant insights about clients, candidates, and business metrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
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
              Our internal chat solution combines AI power with ease of use to provide instant access to your recruitment data.
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
            <h2 className="text-3xl font-bold mb-4">Internal Chat Workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined process for accessing and utilizing your recruitment data through natural language queries.
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
              Connect your data sources and start chatting with your recruitment data in minutes.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <pre className="text-sm overflow-x-auto p-4 bg-muted rounded-lg">
              {`// Example query
const response = await qanduChat.query({
  question: "Show me top candidates for client XYZ's latest job posting",
  context: {
    clientId: "xyz123",
    jobId: "job456"
  }
});`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data Access?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join leading recruitment agencies using QanDu's intelligent internal chat solution.
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