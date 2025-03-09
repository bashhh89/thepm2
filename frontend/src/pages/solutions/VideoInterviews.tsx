import React from 'react';
import { motion } from 'framer-motion';
import { Video, Sparkles, Calendar, MessageSquare, Clock, Globe, Shield, Play, Bot, ChartBar, CheckCircle, Brain } from 'lucide-react';
import { Button } from '../../components/Button';

export default function VideoInterviews() {
  const features = [
    {
      icon: Bot,
      title: "AI Interview Assistant",
      description: "Our AI avatar conducts natural, engaging interviews with candidates, adapting questions based on responses."
    },
    {
      icon: Brain,
      title: "Smart Analysis",
      description: "Real-time analysis of candidate responses, body language, and communication skills using advanced AI."
    },
    {
      icon: ChartBar,
      title: "Instant Evaluation",
      description: "Get immediate feedback on candidate performance and automated qualification assessment."
    },
    {
      icon: Shield,
      title: "Fair Assessment",
      description: "Standardized interview process ensures all candidates are evaluated equally and objectively."
    }
  ];

  const benefits = [
    "24/7 interview availability",
    "90% reduction in scheduling time",
    "Instant candidate feedback",
    "Multilingual support",
    "Behavioral analysis",
    "Automated shortlisting"
  ];

  const stats = [
    { value: "500K+", label: "Interviews Conducted" },
    { value: "85%", label: "Time Saved" },
    { value: "93%", label: "Candidate Satisfaction" },
    { value: "40+", label: "Supported Languages" }
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
              <Video className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Video Interviews
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform your interview process with our AI avatar interviewer. Get instant insights and make faster hiring decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Try Free Demo
                <Play className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
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
            <h2 className="text-3xl font-bold mb-4">AI Interview Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI interviewer provides a natural, engaging experience while gathering deep insights about candidates.
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

      {/* Process Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A seamless interview experience for both recruiters and candidates.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center p-6"
            >
              <div className="mb-4">
                <Calendar className="w-10 h-10 text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Interview</h3>
              <p className="text-muted-foreground">
                Candidates choose their preferred time for the AI interview, available 24/7.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="mb-4">
                <Bot className="w-10 h-10 text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Interview</h3>
              <p className="text-muted-foreground">
                Our AI avatar conducts the interview, adapting questions based on responses.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-6"
            >
              <div className="mb-4">
                <ChartBar className="w-10 h-10 text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-muted-foreground">
                Get immediate analysis and insights about candidate performance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Save time and make better hiring decisions with AI-powered video interviews.
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
            <h2 className="text-3xl font-bold mb-4">Experience AI Interviews Today</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join leading companies using QanDu's AI video interviews to transform their hiring process.
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