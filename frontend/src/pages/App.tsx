import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        
        {/* White-Label Capabilities Section */}
        <section className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">White-Label Capabilities</h2>
                <ul className="space-y-4">
                  <li className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                    <span><strong>Custom Domain Support</strong> — Deploy with your own domain name</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                    <span><strong>Branding Customization</strong> — Match your company's visual identity</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                    <span><strong>Language Adaptation</strong> — Bilingual support for English and Arabic</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                    <span><strong>Industry-Specific Training</strong> — Tailored AI responses for your sector</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center rounded-xl overflow-hidden border shadow-lg">
                <div className="relative aspect-video w-full max-w-[500px] bg-gradient-to-br from-background to-muted/50 p-6">
                  <div className="absolute top-6 left-6 right-6 h-8 bg-background/80 backdrop-blur rounded flex items-center px-3 gap-2">
                    <div className="w-3 h-3 bg-destructive/60 rounded-full"></div>
                    <div className="w-3 h-3 bg-warning/60 rounded-full"></div>
                    <div className="w-3 h-3 bg-success/60 rounded-full"></div>
                    <div className="flex-1"></div>
                  </div>
                  <div className="mt-12 grid grid-cols-6 gap-4">
                    <div className="col-span-1 bg-muted/30 h-[120px] rounded"></div>
                    <div className="col-span-5 grid gap-4">
                      <div className="bg-muted/30 h-12 rounded"></div>
                      <div className="bg-muted/30 h-[90px] rounded"></div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-primary/10 rounded h-24"></div>
                    <div className="bg-primary/10 rounded h-24"></div>
                    <div className="bg-primary/10 rounded h-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technical Features Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Technical Excellence</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Built with cutting-edge technology for maximum performance and reliability
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col p-6 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold mb-2">AI Integration</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Multiple AI provider support</li>
                  <li>Contextual response system</li>
                  <li>Knowledge base training</li>
                  <li>Smart fallback mechanisms</li>
                </ul>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold mb-2">Development Process</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Modern tech stack</li>
                  <li>Continuous integration</li>
                  <li>Automatic updates</li>
                  <li>Comprehensive documentation</li>
                </ul>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold mb-2">Future Enhancements</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Communication tools</li>
                  <li>Advanced analytics</li>
                  <li>Third-party integrations</li>
                  <li>Custom AI model fine-tuning</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
