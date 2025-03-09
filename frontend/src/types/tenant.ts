export interface TenantConfig {
  name: string;
  domain: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  features: {
    jobPosting: boolean;
    candidateTracking: boolean;
    interviews: boolean;
    analytics: boolean;
  };
  settings: {
    allowGuestApplications: boolean;
    requireCoverLetter: boolean;
    enableAIScreening: boolean;
    customEmailDomain?: string;
    defaultCurrency: string;
    timezone: string;
  };
  careerPage: {
    title: string;
    subtitle?: string;
    description?: string;
    metaDescription?: string;
    features?: {
      title: string;
      description: string;
      icon?: string;
    }[];
    testimonials?: {
      name: string;
      role: string;
      company: string;
      content: string;
      image?: string;
    }[];
    teamSection?: {
      title: string;
      description?: string;
      members: {
        name: string;
        role: string;
        image?: string;
        bio?: string;
      }[];
    };
  };
}

export interface TenantBranding {
  logo?: string;
  favicon?: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
  };
  layout?: {
    navStyle?: 'default' | 'minimal' | 'centered';
    footerStyle?: 'default' | 'minimal' | 'expanded';
  };
}

export interface TenantEmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  type: 'candidate' | 'client' | 'internal';
  active: boolean;
}

export interface TenantStats {
  activeJobs: number;
  totalCandidates: number;
  activeApplications: number;
  upcomingInterviews: number;
  placements: number;
  revenue?: number;
}