import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  Target,
  Users,
  Brain,
  ArrowRight,
  Clock,
  CheckCircle,
  Database,
  Search
} from 'lucide-react';
import { Button } from '../../components/Button';

const features = [
  {
    icon: BarChart,
    title: "Performance Metrics",
    description: "Track key recruitment metrics including time-to-hire, cost-per-hire, and source effectiveness."
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get intelligent recommendations and predictions based on your recruitment data."
  },
  {
    icon: LineChart,
    title: "Real-time Tracking",
    description: "Monitor recruitment performance and team productivity in real-time."
  },
  {
    icon: PieChart,
    title: "Custom Reports",
    description: "Create and schedule custom reports for different stakeholders and metrics."
  }
];

const metrics = [
  {
    icon: Clock,
    title: "Time-based Metrics",
    points: [
      "Time-to-hire tracking",
      "Source time efficiency",
      "Interview scheduling metrics",
      "Response time analysis"
    ]
  },
  {
    icon: Target,
    title: "Performance Metrics",
    points: [
      "Conversion rates",
      "Cost per hire",
      "Quality of hire",
      "Source effectiveness"
    ]
  },
  {
    icon: Users,
    title: "Team Metrics",
    points: [
      "Recruiter performance",
      "Team productivity",
      "Collaboration efficiency",
      "Task completion rates"
    ]
  }
];

const dashboards = [
  {
    icon: BarChart,
    title: "Recruitment Overview",
    description: "High-level metrics and KPIs for recruitment performance."
  },
  {
    icon: LineChart,
    title: "Trend Analysis",
    description: "Historical data and future predictions for recruitment metrics."
  },
  {
    icon: PieChart,
    title: "Source Analytics",
    description: "Detailed analysis of candidate sources and their effectiveness."
  }
];

const stats = [
  { value: "40%", label: "Improved Decision Making" },
  { value: "2x", label: "Faster Reporting" },
  { value: "85%", label: "Data Accuracy" },
  { value: "30%", label: "Cost Reduction" }
];

export default function AnalyticsSolution() {
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
              <BarChart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Recruitment Analytics Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Make data-driven decisions with our comprehensive analytics platform. Track, analyze, and optimize your recruitment process.
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
              Our analytics platform provides comprehensive insights into your recruitment process.
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

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Metrics</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track and analyze every aspect of your recruitment process with our detailed metrics.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((category, index) => (
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

      {/* Dashboards Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Interactive Dashboards</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualize your recruitment data with our customizable dashboards.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {dashboards.map((dashboard, index) => (
              <motion.div
                key={dashboard.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border bg-card text-center"
              >
                <dashboard.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{dashboard.title}</h3>
                <p className="text-muted-foreground">{dashboard.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make Data-Driven Decisions?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join leading recruitment agencies using QanDu's analytics platform to optimize their recruitment process.
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