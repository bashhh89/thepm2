import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { 
  ArrowUpRight, 
  Building2, 
  MapPin, 
  Clock, 
  X, 
  Briefcase,
  DollarSign,
  Users,
  Globe,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import { ChatApplicationAssistant } from '../../components/ChatApplicationAssistant';
import { supabase, handleSupabaseError, initializeStorage } from '../../lib/supabase';
import { ChatApplicationForm } from '../../components/ChatApplicationForm';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  created_at: string;
  updated_at: string;
  status: 'active' | 'filled' | 'draft' | 'archived';
  remote_policy?: string;
  work_schedule?: string;
  employment_type?: string;
  team_size?: number;
  reports_to?: string;
  company?: {
    name: string;
    logo?: string;
    industry?: string;
  };
}

interface BrandingContent {
  id: string;
  type: 'image' | 'video' | 'text';
  title: string;
  content: string;
  subtitle?: string;
  description?: string;
  category: string;
  order: number;
  generatedImageUrl?: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [brandingContent, setBrandingContent] = useState<BrandingContent[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    department: '',
    location: '',
    type: '',
    remotePolicy: '',
    search: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, filters]);

  const fetchContent = async () => {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Transform the data to match the expected format
      const transformedJobs = (jobsData || []).map(job => ({
        ...job,
        requirements: Array.isArray(job.requirements) ? job.requirements : [],
        benefits: Array.isArray(job.benefits) ? job.benefits : []
      }));
      
      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error(handleSupabaseError(error).error);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.department.toLowerCase().includes(searchLower)
      );
    }

    if (filters.department) {
      filtered = filtered.filter(job => job.department === filters.department);
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.location === filters.location);
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.employment_type === filters.type);
    }

    if (filters.remotePolicy) {
      filtered = filtered.filter(job => job.remote_policy === filters.remotePolicy);
    }

    setFilteredJobs(filtered);
  };

  const renderBrandingSection = (content: BrandingContent) => {
    switch (content.type) {
      case 'image':
        return (
          <img 
            src={content.generatedImageUrl || content.content} 
            alt={content.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        );
      case 'video':
        return (
          <video 
            src={content.content} 
            controls 
            className="w-full rounded-lg"
          />
        );
      default:
        return (
          <div className="prose prose-sm max-w-none">
            {content.subtitle && (
              <p className="text-muted-foreground">{content.subtitle}</p>
            )}
            {typeof content.content === 'string' ? (
              <p>{content.content}</p>
            ) : (
              <p>{JSON.stringify(content.content)}</p>
            )}
          </div>
        );
    }
  };

  const formatSalary = (salary?: Job['salary']) => {
    if (!salary) return 'Competitive';
    const { min, max, currency } = salary;
    if (!min && !max) return 'Competitive';
    if (min && max) return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
    if (min) return `From ${currency}${min.toLocaleString()}`;
    return `Up to ${currency}${max!.toLocaleString()}`;
  };

  return (
    <div>
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

      {/* Life at QanDu Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Life at QanDu</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a culture of innovation, collaboration, and growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="h-40 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Environment</h3>
              <p className="text-muted-foreground">
                Work alongside talented individuals in a supportive and inclusive workspace.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="h-40 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth & Learning</h3>
              <p className="text-muted-foreground">
                Continuous learning opportunities and career development programs.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="h-40 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Work-Life Balance</h3>
              <p className="text-muted-foreground">
                Flexible schedules and policies that support your well-being.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits & Perks Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Benefits & Perks</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We take care of our team with competitive benefits and meaningful perks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🏥",
                title: "Health & Wellness",
                items: ["Comprehensive health insurance", "Dental & vision coverage", "Mental health support"]
              },
              {
                icon: "💰",
                title: "Financial Benefits",
                items: ["Competitive salary", "401(k) matching", "Stock options"]
              },
              {
                icon: "🌴",
                title: "Time Off",
                items: ["Unlimited PTO", "Paid parental leave", "Paid holidays"]
              },
              {
                icon: "🎓",
                title: "Learning & Development",
                items: ["Learning stipend", "Conference budget", "Career coaching"]
              },
              {
                icon: "🏠",
                title: "Remote Work",
                items: ["Flexible work location", "Home office setup", "Internet stipend"]
              },
              {
                icon: "🎉",
                title: "Company Events",
                items: ["Team retreats", "Social activities", "Wellness programs"]
              },
              {
                icon: "📱",
                title: "Equipment",
                items: ["Latest tech setup", "Choice of equipment", "Regular upgrades"]
              },
              {
                icon: "🎯",
                title: "Career Growth",
                items: ["Mentorship program", "Leadership training", "Skill workshops"]
              }
            ].map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Search and Filters */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your next opportunity and join our growing team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Input
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="lg:col-span-2"
            />
            <select
              className="rounded-md border bg-background px-3 py-2"
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            >
              <option value="">All Departments</option>
              {[...new Set(jobs.map(job => job.department))].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              className="rounded-md border bg-background px-3 py-2"
              value={filters.remotePolicy}
              onChange={(e) => setFilters(prev => ({ ...prev, remotePolicy: e.target.value }))}
            >
              <option value="">Work Location</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
            <select
              className="rounded-md border bg-background px-3 py-2"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">Employment Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        {job.remote_policy && (
                          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            {job.remote_policy}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      className="shrink-0"
                      onClick={() => setSelectedJob(job)}
                    >
                      View & Apply
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredJobs.length === 0 && (
              <Card className="p-6 text-center text-muted-foreground">
                {jobs.length === 0 ? 
                  'No open positions at the moment. Please check back later.' :
                  'No positions match your search criteria. Try adjusting your filters.'}
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setSelectedJob(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {selectedJob.department}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedJob.type}
                    </span>
                  </div>
                </div>
              </div>

              <ChatApplicationForm
                jobId={selectedJob.id}
                jobTitle={selectedJob.title}
                department={selectedJob.department}
                onSuccess={() => {
                  setSelectedJob(null);
                  toast.success('Application submitted successfully! We will review your application and get back to you soon.');
                }}
                onCancel={() => setSelectedJob(null)}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}