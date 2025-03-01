import React from "react";
import { Button } from "./Button";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                QanDu Business Intelligence Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Transform your business with AI-powered insights. Featuring advanced analytics, 
                intelligent automation, and seamless integration with Puter.ai.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="px-8">Start Free Trial</Button>
              <Button size="lg" variant="outline" className="px-8">Watch Demo</Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden border shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10"></div>
              <div className="absolute inset-0 bg-card/50 backdrop-blur-sm z-0">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-lg"></div>
                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-secondary/10 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 bg-accent/10 rounded-md"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-foreground/70">QanDu AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
