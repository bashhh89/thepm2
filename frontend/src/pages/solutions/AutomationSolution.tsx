import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Workflow,
  Bot,
  Settings,
  Clock,
  CheckCircle,
  MessageSquare,
  Mail,
  Calendar,
  ArrowRight,
  Users,
  Target,
  Brain
} from 'lucide-react';
import { Button } from '../../components/Button';

const features = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline your recruitment process with customizable workflows."
  },
  {
    icon: Bot,
    title: "AI-Powered Automation",
    description: "Leverage AI to automate candidate screening, scheduling, and follow-ups."
  },
  {
    icon: MessageSquare,
    title: "Communication Automation",
    description: "Automate candidate and client communications while maintaining a personal touch."
  },
  {
    icon: Settings,
    title: "Custom Triggers",
    description: "Set up custom triggers and conditions for automated actions based on your needs."
  }
];

const automationTypes = [
  {
    icon: Calendar,
    title: "Interview Scheduling",
    points: [
      "Automated calendar coordination",
      "Smart availability detection",
      "Reminder system",
      "Follow-up scheduling"
    ]
  },
  {
    icon: Mail,
    title: "Communication",
    points: [
      "Email campaigns",
      "SMS notifications",
      "Status updates",
      "Personalized messages"
    ]
  },
  {
    icon: Brain,
    title: "AI Processing",
    points: [
      "Resume parsing",
      "Candidate scoring",
      "Skill matching",
      "Sentiment analysis"
    ]
  }
];

const workflows = [
  {
    icon: Users,
    title: "Candidate Pipeline",
    description: "Automate candidate sourcing, screening, and engagement processes."
  },
  {
    icon: Target,
    title: "Job Distribution",
    description: "Automatically post and manage job listings across multiple platforms."
  },
  {
    icon: Clock,
    title: "Time Management",
    description: "Streamline scheduling, reminders, and follow-up tasks."
  }
];

const stats = [
  { value: "70%", label: "Time Saved" },
  { value: "3x", label: "Faster Processing" },
  { value: "50%", label: "Reduced Admin Work" },
  { value: "90%", label: "Task Automation" }
];

export default function AutomationSolution() {
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
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Recruitment Process Automation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Streamline your recruitment workflow with intelligent automation. Save time, reduce errors, and focus on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
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
              Our automation platform streamlines your recruitment process with powerful features.
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

      {/* Automation Types Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Automation Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the different types of automation available in our platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {automationTypes.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border bg-card"
              >
                <div className="mb-4">
                  <category.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflows Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Automated Workflows</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Streamline your recruitment process with our pre-built and customizable workflows.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border bg-card text-center"
              >
                <workflow.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{workflow.title}</h3>
                <p className="text-muted-foreground">{workflow.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Recruitment?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join leading recruitment agencies using QanDu's automation platform to streamline their processes.
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