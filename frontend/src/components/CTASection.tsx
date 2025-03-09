import React from "react";
import { Button } from "./Button";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export function CTASection() {
  return (
    <section className="w-full py-20 md:py-32 bg-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-4 py-2"
          >
            <div className="flex -space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/79.jpg"
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-background"
              />
              <img
                src="https://randomuser.me/api/portraits/men/82.jpg"
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-background"
              />
              <img
                src="https://randomuser.me/api/portraits/women/76.jpg"
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-background"
              />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-medium">from 100+ agencies</span>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Transform Your Agency with AI-Powered Recruitment
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the growing number of agencies using our platform to streamline their recruitment process and place candidates faster.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
          >
            <Button size="lg" className="w-full sm:w-auto group">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold">14 Days</span>
              <span className="text-sm text-muted-foreground">Free Trial</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold">24/7</span>
              <span className="text-sm text-muted-foreground">Support</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold">1-Click</span>
              <span className="text-sm text-muted-foreground">Setup</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold">100%</span>
              <span className="text-sm text-muted-foreground">Satisfaction</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
