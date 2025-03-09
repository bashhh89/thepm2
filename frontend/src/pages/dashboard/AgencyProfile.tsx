import React from 'react';
import { AgencySettings } from '../../components/AgencySettings';
import { TenantConfig, TenantBranding } from '../../types/tenant';

const defaultConfig: TenantConfig & { branding: TenantBranding } = {
  name: 'Your Agency',
  domain: '',
  features: {
    jobPosting: true,
    candidateTracking: true,
    interviews: true,
    analytics: true
  },
  settings: {
    allowGuestApplications: true,
    requireCoverLetter: false,
    enableAIScreening: true,
    defaultCurrency: 'USD',
    timezone: 'UTC'
  },
  careerPage: {
    title: 'Join Our Talent Network',
    description: 'Find your next career opportunity with us'
  },
  branding: {
    colors: {
      primary: '#4f46e5',
      secondary: '#0ea5e9',
      accent: '#f43f5e'
    },
    layout: {
      navStyle: 'default',
      footerStyle: 'default'
    }
  }
};

export default function AgencyProfile() {
  const handleSave = async (config: Partial<TenantConfig & { branding: TenantBranding }>) => {
    // TODO: Implement save functionality
    console.log('Saving config:', config);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agency Profile</h1>
      <p className="text-muted-foreground">Manage your agency settings and branding.</p>

      <AgencySettings 
        config={defaultConfig}
        onSave={handleSave}
      />
    </div>
  );
}