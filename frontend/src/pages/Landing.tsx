import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2">
              <h1 className="text-5xl font-bold mb-6">
                Power Your Recruitment Agency with AI
              </h1>
              <p className="text-xl mb-8">
                Launch your branded recruitment platform with powerful AI features, 
                candidate management, and automated workflows.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/demo"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Request Demo
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <img
                src="/assets/platform-preview.png"
                alt="Platform Preview"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Scale Your Agency
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Leading Recruitment Agencies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Add partner logos here */}
          </div>
          <div className="mt-16">
            <div className="max-w-3xl mx-auto text-center">
              <blockquote className="text-2xl font-medium mb-8">
                "This platform has transformed how we manage our recruitment process. 
                The AI features have saved us countless hours in candidate screening."
              </blockquote>
              <div className="flex items-center justify-center">
                <img
                  src="/assets/testimonial-avatar.png"
                  alt="Testimonial"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="text-left">
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-gray-600">CEO, TalentFirst Recruitment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`p-8 rounded-lg border ${
                  plan.popular ? 'border-blue-500 shadow-lg' : ''
                }`}
              >
                {plan.popular && (
                  <div className="text-blue-500 text-sm font-semibold mb-2">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  ${plan.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Transform Your Recruitment Agency?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of agencies already using our platform to scale their 
            business and provide better service to their clients.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/demo"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Schedule Demo
            </Link>
            <Link
              to="/signup"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    title: 'AI-Powered Recruitment',
    description: 'Automate candidate screening and matching with advanced AI technology.',
    icon: '🤖',
  },
  {
    title: 'Custom Branding',
    description: 'Your platform, your brand. Full white-label customization.',
    icon: '🎨',
  },
  {
    title: 'Video Interviews',
    description: 'Conduct and analyze video interviews with AI assistance.',
    icon: '🎥',
  },
  {
    title: 'Smart Analytics',
    description: 'Track performance and make data-driven decisions.',
    icon: '📊',
  },
  {
    title: 'Multi-channel Communication',
    description: 'Email, chat, and SMS integration for seamless communication.',
    icon: '💬',
  },
  {
    title: 'Automated Workflows',
    description: 'Streamline your recruitment process with custom workflows.',
    icon: '⚡',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 99,
    features: [
      'Up to 5 team members',
      'Basic AI features',
      'Job board',
      'Candidate management',
      'Email support',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: 199,
    features: [
      'Up to 15 team members',
      'Advanced AI features',
      'Video interviews',
      'Custom workflows',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 399,
    features: [
      'Unlimited team members',
      'Full AI suite',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 support',
    ],
    popular: false,
  },
];

export default Landing; 