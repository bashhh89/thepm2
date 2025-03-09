import React from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full min-h-[90vh] flex items-center bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[100rem] h-[100rem] opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[100rem] h-[100rem] opacity-30">
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 via-secondary/5 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium">Now offering AI-powered recruitment tools</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-5xl space-y-4"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Your Own{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                AI-Powered
              </span>
              <br />
              Recruitment Platform
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Transform your recruitment agency with a fully branded platform featuring AI matching, 
              video interviews, and automated workflows.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
          >
            <Button size="lg" className="w-full sm:w-auto group">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold text-primary">50+</span>
              <span className="text-sm text-muted-foreground">Active Agencies</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold text-primary">10k+</span>
              <span className="text-sm text-muted-foreground">Placements Made</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold text-primary">60%</span>
              <span className="text-sm text-muted-foreground">Time Saved</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold text-primary">98%</span>
              <span className="text-sm text-muted-foreground">Client Satisfaction</span>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-12 flex flex-col items-center space-y-4"
          >
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                <span>Free 14-day trial</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
