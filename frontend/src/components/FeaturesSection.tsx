import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Video, 
  Globe, 
  Target,
  MessageSquare,
  BarChart3,
  Zap,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Smart candidate screening and matching powered by advanced AI technology.",
    color: "from-blue-500/20 to-blue-500/0"
  },
  {
    icon: Video,
    title: "Video Interviews",
    description: "Conduct and analyze video interviews with AI-powered insights and sentiment analysis.",
    color: "from-purple-500/20 to-purple-500/0"
  },
  {
    icon: Globe,
    title: "Branded Career Portal",
    description: "Your own fully customized career portal with your branding and domain name.",
    color: "from-green-500/20 to-green-500/0"
  },
  {
    icon: Target,
    title: "Complete ATS",
    description: "Powerful applicant tracking system with customizable workflows and automation.",
    color: "from-orange-500/20 to-orange-500/0"
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Centralized communication with candidates and clients across all channels.",
    color: "from-pink-500/20 to-pink-500/0"
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Data-driven insights and reporting to optimize your recruitment process.",
    color: "from-cyan-500/20 to-cyan-500/0"
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline your recruitment process.",
    color: "from-yellow-500/20 to-yellow-500/0"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with data encryption and GDPR compliance built-in.",
    color: "from-red-500/20 to-red-500/0"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FeaturesSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Everything You Need to Scale Your Agency
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            A complete suite of modern recruitment tools, powered by AI and designed for growth
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                className="group relative p-6 bg-background border rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${feature.color})`
                  }}
                />
                <div className="mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;
