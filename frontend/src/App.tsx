import React from "react";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import BenefitsSection from "./components/BenefitsSection";
import SuccessStoriesSection from "./components/SuccessStoriesSection";
import DemoSection from "./components/DemoSection";
import CTASection from "./components/CTASection";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <SuccessStoriesSection />
      <DemoSection />
      <CTASection />
    </div>
  );
}

export default App; 