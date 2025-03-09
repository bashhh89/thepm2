import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Clock, 
  TrendingUp,
  Building,
  Star,
  CheckCircle
} from "lucide-react";

const successStories = [
  {
    company: "TechStaff Solutions",
    logo: "https://randomuser.me/api/portraits/women/1.jpg",
    stats: {
      placements: "250+ placements",
      timeReduction: "60% faster hiring",
      satisfaction: "98% client satisfaction"
    },
    quote: "We've transformed from a local agency to a national player. The AI-powered matching has revolutionized how we connect talent with opportunities.",
    author: "Emma Thompson",
    role: "Head of Recruitment"
  },
  {
    company: "Global Talent Hub",
    logo: "https://randomuser.me/api/portraits/men/2.jpg",
    stats: {
      placements: "1000+ candidates",
      timeReduction: "45% time saved",
      satisfaction: "95% candidate match"
    },
    quote: "The platform's automation has allowed us to scale our operations across three continents while maintaining personal touch with every candidate.",
    author: "James Chen",
    role: "Managing Director"
  }
];

const impactMetrics = [
  {
    icon: Users,
    label: "Happy Clients",
    value: "500+",
    description: "Recruitment agencies worldwide"
  },
  {
    icon: Clock,
    label: "Time Saved",
    value: "1.5M+",
    description: "Hours automated annually"
  },
  {
    icon: TrendingUp,
    label: "Success Rate",
    value: "96%",
    description: "Candidate placement rate"
  }
];

export function SuccessStoriesSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-black/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Success Stories</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Real Results from Real Agencies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            See how agencies are transforming their recruitment process and achieving remarkable growth
          </motion.p>
        </div>

        {/* Success Stories */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {successStories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group"
            >
              <div className="relative p-8 rounded-3xl border bg-background/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                {/* Company Info */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={story.logo}
                    alt={story.company}
                    className="w-16 h-16 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{story.company}</h3>
                    <p className="text-muted-foreground">{story.author}, {story.role}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.values(story.stats).map((stat, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{stat}</span>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg italic text-muted-foreground">
                  "{story.quote}"
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {impactMetrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{metric.value}</h3>
                <p className="text-lg font-semibold mb-1">{metric.label}</p>
                <p className="text-muted-foreground">{metric.description}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default SuccessStoriesSection; 