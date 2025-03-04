import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ArrowUpRight, Building2, MapPin, Clock } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface BrandingContent {
  id: string;
  type: 'image' | 'video' | 'text';
  title: string;
  content: string;
  order: number;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [brandingContent, setBrandingContent] = useState<BrandingContent[]>([]);

  // TODO: Replace with actual API calls
  useEffect(() => {
    // Fetch jobs from your API
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    // Fetch branding content from your API
    const fetchBrandingContent = async () => {
      try {
        const response = await fetch('/api/branding-content');
        const data = await response.json();
        setBrandingContent(data.sort((a: BrandingContent, b: BrandingContent) => a.order - b.order));
      } catch (error) {
        console.error('Error fetching branding content:', error);
      }
    };

    fetchJobs();
    fetchBrandingContent();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary/5 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Be part of something special. We're looking for talented individuals who want to make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Branding Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brandingContent.map((content) => (
              <Card key={content.id} className="p-6">
                {content.type === 'image' && (
                  <img
                    src={content.content}
                    alt={content.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                {content.type === 'video' && (
                  <video
                    src={content.content}
                    controls
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
                {content.type === 'text' && (
                  <p className="text-muted-foreground">{content.content}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Open Positions</h2>
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.experience}
                        </span>
                      </div>
                    </div>
                    <Button className="flex items-center gap-2 whitespace-nowrap">
                      Apply Now
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground">{job.description}</p>
                    
                    {job.requirements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-base font-semibold mb-2">Requirements</h4>
                        <ul className="list-disc pl-4 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-muted-foreground">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {job.benefits.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-base font-semibold mb-2">Benefits</h4>
                        <ul className="list-disc pl-4 space-y-1">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="text-muted-foreground">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {jobs.length === 0 && (
              <Card className="p-6 text-center text-muted-foreground">
                No open positions at the moment. Please check back later.
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-muted-foreground">
                We embrace new ideas and technologies to solve complex challenges.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Collaboration</h3>
              <p className="text-muted-foreground">
                We work together across teams to achieve extraordinary results.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Growth</h3>
              <p className="text-muted-foreground">
                We invest in our people and provide opportunities for development.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 