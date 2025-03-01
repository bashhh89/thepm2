import React from "react";
import { Button } from "./Button";

export default function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 bg-primary/5">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-[800px]">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Transform Your Business?</h2>
            <p className="text-muted-foreground md:text-xl">
              Join hundreds of businesses already using Nexus Suite to streamline operations, 
              enhance customer interactions, and drive growth.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="px-8">Get Started</Button>
            <Button size="lg" variant="outline" className="px-8">Schedule a Demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
