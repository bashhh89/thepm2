import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  DollarSign,
  Award,
  Smile,
  Heart
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Placements",
    description: "AI matching helps you place candidates 60% faster with better fit accuracy.",
    stats: "60% Faster",
    color: "from-green-500/20 via-green-500/5 to-transparent"
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Automated workflows reduce administrative tasks by up to 40%.",
    stats: "40% Less Admin",
    color: "from-blue-500/20 via-blue-500/5 to-transparent"
  },
  {
    icon: DollarSign,
    title: "Boost Revenue",
    description: "Agencies report an average of 45% increase in revenue after 6 months.",
    stats: "45% Growth",
    color: "from-purple-500/20 via-purple-500/5 to-transparent"
  }
];

const testimonials = [
  {
    quote: "We've doubled our placements since switching to this platform.",
    author: "Sarah Johnson",
    role: "CEO, TechRecruit",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "The AI matching is incredibly accurate. Game changer for us.",
    author: "Michael Chen",
    role: "Director, GlobalHire",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  }
];

export function BenefitsSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(var(--primary-rgb),0.1),transparent_70%)]" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Why Agencies Love Us</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Transform Your Recruitment Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground"
          >
            Experience the benefits that hundreds of agencies are already enjoying
          </motion.p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${benefit.color})`
                  }}
                />
                <div className="relative p-8 rounded-3xl border bg-background/50 backdrop-blur-sm">
                  <div className="mb-4">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary">{benefit.stats}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="relative p-6 rounded-2xl border bg-background/50 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-lg mb-2">"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection; 