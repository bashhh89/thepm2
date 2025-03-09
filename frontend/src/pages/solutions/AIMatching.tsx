import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Sparkles, Users, ChartBar, Bot, Zap, CheckCircle, Clock, Target, 
  Shield, Code, Database, LineChart, Network, Layers, Settings, Search
} from 'lucide-react';
import { Button } from '../../components/Button';

export default function AIMatching() {
  const features = [
    {
      icon: Bot,
      title: "Smart Candidate Screening",
      description: "Our AI analyzes resumes and job requirements to find the perfect match, considering skills, experience, and cultural fit."
    },
    {
      icon: Clock,
      title: "Instant Matching",
      description: "Get immediate results and candidate rankings, reducing time-to-hire from weeks to minutes."
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Advanced algorithms ensure 95% matching accuracy by analyzing both explicit and implicit job requirements."
    },
    {
      icon: Shield,
      title: "Bias-Free Hiring",
      description: "Our AI removes unconscious bias from the screening process, promoting diversity and equal opportunity."
    }
  ];

  const benefits = [
    "80% reduction in screening time",
    "95% matching accuracy",
    "60% lower cost-per-hire",
    "Increased diversity in hiring",
    "Better candidate experience",
    "Data-driven decisions"
  ];

  const stats = [
    { value: "1M+", label: "Candidates Matched" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "80%", label: "Time Saved" },
    { value: "60%", label: "Cost Reduction" }
  ];

  const matchingProcess = [
    {
      icon: Database,
      title: "Data Collection",
      description: "AI processes resumes, job descriptions, and historical hiring data to build comprehensive profiles."
    },
    {
      icon: Brain,
      title: "Deep Learning Analysis",
      description: "Advanced neural networks analyze both explicit skills and implicit qualities."
    },
    {
      icon: Network,
      title: "Pattern Recognition",
      description: "AI identifies successful hiring patterns and applies them to new candidates."
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Candidates are matched with roles using multiple criteria and success predictors."
    }
  ];

  const skillAnalysis = [
    {
      icon: Layers,
      title: "Multi-Layer Analysis",
      points: [
        "Technical skills assessment",
        "Soft skills evaluation",
        "Experience level matching",
        "Cultural fit prediction"
      ]
    },
    {
      icon: ChartBar,
      title: "Performance Metrics",
      points: [
        "Skills gap analysis",
        "Competency scoring",
        "Growth potential assessment",
        "Role compatibility index"
      ]
    },
    {
      icon: Search,
      title: "Intelligent Screening",
      points: [
        "Keyword context understanding",
        "Industry-specific terminology",
        "Qualification verification",
        "Experience validation"
      ]
    }
  ];

  const integrationFeatures = [
    {
      icon: Code,
      title: "API Integration",
      description: "Seamlessly integrate with your existing ATS and HRIS systems"
    },
    {
      icon: Settings,
      title: "Custom Workflows",
      description: "Configure matching parameters and automation rules"
    },
    {
      icon: LineChart,
      title: "Analytics Dashboard",
      description: "Track matching effectiveness and hiring metrics"
    }
  ];

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
              AI-Powered Candidate Matching
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform your recruitment process with intelligent candidate screening and matching powered by advanced AI algorithms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Get Started
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
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
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered matching system uses advanced algorithms to analyze and match candidates with job requirements.
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

      {/* AI Matching Process Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI Matching Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our sophisticated AI matching process ensures the highest quality candidate-job fit through multiple layers of analysis.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {matchingProcess.map((step, index) => (
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

      {/* Skill Analysis Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Skill Analysis</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI performs deep analysis of candidate skills and qualifications across multiple dimensions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {skillAnalysis.map((category, index) => (
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

      {/* Integration Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Easily integrate our AI matching system with your existing recruitment tools and workflows.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {integrationFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl border bg-card"
              >
                <div className="mb-4">
                  <feature.icon className="w-10 h-10 text-primary mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transform your recruitment process with our AI-powered matching system.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 p-4"
              >
                <CheckCircle className="w-5 h-5 text-primary mt-1" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of companies using QanDu's AI-powered recruitment solutions.
            </p>
            <Button size="lg" className="group">
              Start Free Trial
              <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 