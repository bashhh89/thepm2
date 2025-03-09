import React from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { Play, ChevronRight } from "lucide-react";

export function DemoSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-black/5 relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary rounded-full blur-3xl animate-slow-spin" />
        </div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] opacity-20">
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary via-primary to-secondary rounded-full blur-3xl animate-reverse-slow-spin" />
        </div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start space-y-8"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              Watch Demo
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold"
            >
              See the Platform in Action
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-lg"
            >
              Watch how our AI-powered platform streamlines your recruitment process, from job posting to candidate placement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="group">
                <Play className="w-4 h-4 mr-2" />
                Watch Full Demo
              </Button>
              <Button size="lg" variant="outline" className="group">
                Book Live Demo
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 pt-8"
            >
              {[
                "AI-Powered Matching",
                "Video Interviews",
                "Smart Analytics",
                "Automated Workflows"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-xl overflow-hidden"
          >
            {/* Platform Preview */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/30 backdrop-blur-sm border rounded-xl">
              {/* Mock Interface */}
              <div className="absolute inset-0 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-32 h-8 bg-primary/10 rounded-md animate-pulse" />
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
                  </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-3 gap-4 h-full">
                  <div className="col-span-1 space-y-4">
                    <div className="w-full h-12 bg-primary/5 rounded-md" />
                    <div className="w-full h-12 bg-primary/5 rounded-md" />
                    <div className="w-full h-12 bg-primary/5 rounded-md" />
                  </div>
                  <div className="col-span-2 bg-primary/5 rounded-lg p-4">
                    <div className="w-full h-full rounded-md bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-primary/20 rounded-lg blur-xl animate-float" />
              <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-float-delayed" />
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center"
              >
                <Play className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default DemoSection; 