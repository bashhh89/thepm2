import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TenantConfig, TenantBranding } from '../types/tenant';
import { Button } from './Button';
import { Input } from './Input';
import { Switch } from './Switch';
import { Select } from './Select';
import { Card } from './Card';
import { FileUpload } from './FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import { ColorPicker } from './ColorPicker';
import { timezones, currencies } from '../lib/constants';

const agencySettingsSchema = z.object({
  name: z.string().min(1, 'Agency name is required'),
  domain: z.string().min(1, 'Domain is required'),
  logo: z.string().optional(),
  features: z.object({
    jobPosting: z.boolean(),
    candidateTracking: z.boolean(),
    interviews: z.boolean(),
    analytics: z.boolean()
  }),
  settings: z.object({
    allowGuestApplications: z.boolean(),
    requireCoverLetter: z.boolean(),
    enableAIScreening: z.boolean(),
    customEmailDomain: z.string().optional(),
    defaultCurrency: z.string(),
    timezone: z.string()
  }),
  branding: z.object({
    logo: z.string().optional(),
    favicon: z.string().optional(),
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string().optional(),
      background: z.string().optional(),
      text: z.string().optional()
    }),
    typography: z.object({
      headingFont: z.string().optional(),
      bodyFont: z.string().optional()
    }).optional(),
    layout: z.object({
      navStyle: z.enum(['default', 'minimal', 'centered']),
      footerStyle: z.enum(['default', 'minimal', 'expanded'])
    }).optional()
  })
});

interface AgencySettingsProps {
  config: TenantConfig & { branding: TenantBranding };
  onSave: (config: Partial<TenantConfig & { branding: TenantBranding }>) => Promise<void>;
}

export function AgencySettings({ config, onSave }: AgencySettingsProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(agencySettingsSchema),
    defaultValues: config
  });

  const onSubmit = async (data: any) => {
    await onSave(data);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Agency Information</h3>
              <div className="space-y-4">
                <Input
                  label="Agency Name"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Domain"
                  {...register('domain')}
                  error={errors.domain?.message}
                  helperText="Your branded career portal domain"
                />
                <FileUpload
                  label="Agency Logo"
                  {...register('logo')}
                  error={errors.logo?.message}
                  accept="image/*"
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Regional Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Default Currency"
                  {...register('settings.defaultCurrency')}
                  error={errors.settings?.defaultCurrency?.message}
                  options={currencies}
                />
                <Select
                  label="Timezone"
                  {...register('settings.timezone')}
                  error={errors.settings?.timezone?.message}
                  options={timezones}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Feature Configuration</h3>
              <div className="space-y-6">
                <Switch
                  label="Job Posting"
                  description="Enable job posting and management"
                  {...register('features.jobPosting')}
                />
                <Switch
                  label="Candidate Tracking"
                  description="Enable candidate database and tracking"
                  {...register('features.candidateTracking')}
                />
                <Switch
                  label="Interview Management"
                  description="Enable interview scheduling and feedback"
                  {...register('features.interviews')}
                />
                <Switch
                  label="Analytics & Reporting"
                  description="Enable recruitment analytics and reports"
                  {...register('features.analytics')}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Application Settings</h3>
              <div className="space-y-6">
                <Switch
                  label="Guest Applications"
                  description="Allow candidates to apply without creating an account"
                  {...register('settings.allowGuestApplications')}
                />
                <Switch
                  label="Cover Letter Required"
                  description="Require cover letter for all applications"
                  {...register('settings.requireCoverLetter')}
                />
                <Switch
                  label="AI Screening"
                  description="Enable AI-powered candidate screening"
                  {...register('settings.enableAIScreening')}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Visual Branding</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    label="Primary Color"
                    {...register('branding.colors.primary')}
                    error={errors.branding?.colors?.primary?.message}
                  />
                  <ColorPicker
                    label="Secondary Color"
                    {...register('branding.colors.secondary')}
                    error={errors.branding?.colors?.secondary?.message}
                  />
                  <ColorPicker
                    label="Accent Color"
                    {...register('branding.colors.accent')}
                    error={errors.branding?.colors?.accent?.message}
                  />
                  <ColorPicker
                    label="Background Color"
                    {...register('branding.colors.background')}
                    error={errors.branding?.colors?.background?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FileUpload
                    label="Logo"
                    {...register('branding.logo')}
                    error={errors.branding?.logo?.message}
                    accept="image/*"
                  />
                  <FileUpload
                    label="Favicon"
                    {...register('branding.favicon')}
                    error={errors.branding?.favicon?.message}
                    accept="image/*"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Layout & Typography</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Navigation Style"
                  {...register('branding.layout.navStyle')}
                  error={errors.branding?.layout?.navStyle?.message}
                  options={[
                    { value: 'default', label: 'Default' },
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'centered', label: 'Centered' }
                  ]}
                />
                <Select
                  label="Footer Style"
                  {...register('branding.layout.footerStyle')}
                  error={errors.branding?.layout?.footerStyle?.message}
                  options={[
                    { value: 'default', label: 'Default' },
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'expanded', label: 'Expanded' }
                  ]}
                />
                <Input
                  label="Heading Font"
                  {...register('branding.typography.headingFont')}
                  error={errors.branding?.typography?.headingFont?.message}
                />
                <Input
                  label="Body Font"
                  {...register('branding.typography.bodyFont')}
                  error={errors.branding?.typography?.bodyFont?.message}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
              <div className="space-y-4">
                <Input
                  label="Custom Email Domain"
                  {...register('settings.customEmailDomain')}
                  error={errors.settings?.customEmailDomain?.message}
                  helperText="Domain for sending branded emails (requires verification)"
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}