import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  Brain,
  Users,
  ClipboardCheck,
  Send,
  CheckCircle,
  Bot,
  Search,
  Target,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '../../components/Button';

const features = [
  {
    icon: Briefcase,
    title: "Job Posting Management",
    description: "Create and manage job postings with AI-powered suggestions and optimization."
  },
  {
    icon: FileText,
    title: "Smart Application Process",
    description: "User-friendly forms with AI-assisted cover letter suggestions and tracking."
  },
  {
    icon: Users,
    title: "Candidate Management",
    description: "Real-time updates, automated scoring, and team collaboration tools."
  },
  {
    icon: Brain,
    title: "AI Integration",
    description: "Intelligent matching and automated follow-up communications."
  }
];

const workflowSteps = [
  {
    icon: Briefcase,
    title: "Job Posting",
    description: "Create optimized job listings with AI assistance for titles and descriptions."
  },
  {
    icon: FileText,
    title: "Application Submission",
    description: "Streamlined application process with AI-assisted form filling."
  },
  {
    icon: Search,
    title: "Candidate Review",
    description: "Automated scoring and team-based application review process."
  },
  {
    icon: CheckCircle,
    title: "Hiring Decision",
    description: "Collaborative decision-making with automated candidate communication."
  }
];

const stats = [
  { value: "60%", label: "Time Saved in Job Posting" },
  { value: "2x", label: "More Qualified Applicants" },
  { value: "40%", label: "Faster Time-to-Hire" },
  { value: "90%", label: "Application Completion Rate" }
];

export default function JobPortalSolution() {
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
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Job Portal Solution
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Streamline your job posting and application process with intelligent automation and candidate matching.
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
              Our comprehensive job portal combines powerful features with AI assistance to optimize your hiring process.
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
            <h2 className="text-3xl font-bold mb-4">Job Application Workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined process from job posting to hiring decision, enhanced by AI at every step.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Hiring Process?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join leading recruitment agencies using QanDu's intelligent job portal solution.
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