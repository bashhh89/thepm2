import React from "react";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Palette, 
  Users, 
  Sparkles,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    icon: Rocket,
    title: "Quick Setup",
    description: "Get your branded recruitment platform up and running in minutes, not weeks.",
    color: "from-blue-500 to-purple-500"
  },
  {
    icon: Palette,
    title: "Brand & Customize",
    description: "Customize every aspect to match your agency's brand identity perfectly.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Users,
    title: "Start Recruiting",
    description: "Begin posting jobs and matching candidates with AI-powered tools.",
    color: "from-pink-500 to-orange-500"
  },
  {
    icon: Sparkles,
    title: "Scale & Grow",
    description: "Expand your agency with automated workflows and powerful analytics.",
    color: "from-orange-500 to-yellow-500"
  }
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] opacity-30">
          <div className="absolute inset-0 rotate-45 scale-[0.7] transform-gpu">
            <div className="absolute inset-0 bg-gradient-conic from-primary via-secondary to-primary rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Launch Your Platform in Minutes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            Four simple steps to transform your recruitment agency
          </motion.p>
        </div>

        {/* Timeline Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute top-[45%] left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform-gpu origin-left"
          />

          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step Number */}
                  <div className="mb-8 relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + 0.5, type: "spring" }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5"
                    >
                      <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </motion.div>
                    {i < steps.length - 1 && (
                      <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                    )}
                  </div>

                  {/* Step Content */}
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection; 