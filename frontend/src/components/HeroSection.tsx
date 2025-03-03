import React from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                QanDu Intelligence Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Transform your business with AI-powered insights. Featuring advanced analytics, 
                intelligent content creation, and seamless integration with state-of-the-art AI models.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="px-8 bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
              <Link to="/blog">
                <Button size="lg" variant="outline" className="px-8">
                  Read Our Blog
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                AI-Powered
              </div>
              <div className="flex items-center">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Blog Creation
              </div>
              <div className="flex items-center">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Analytics
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden border shadow-xl bg-background/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10"></div>
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-lg animate-pulse"></div>
                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-secondary/10 rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 bg-accent/10 rounded-md animate-pulse" style={{ animationDelay: '1000ms' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">QanDu AI</span>
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
