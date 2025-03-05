import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { toast } from 'sonner';
import {
  Upload,
  Loader2,
  Send,
  HelpCircle,
  Paperclip,
  Clock,
  X
} from 'lucide-react';
import { Card } from './Card';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface ApplicationData {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  portfolioUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  expectedSalary?: number;
  noticePeriod?: number;
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'expert';
  }>;
  source?: string;
}

export function JobApplicationForm({ jobId, jobTitle, onSuccess, onCancel, initialData }: JobApplicationFormProps) {
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    jobId,
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    resumeUrl: '',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const steps = [
    { title: 'Basic Information', fields: ['name', 'email', 'phone'] },
    { title: 'Resume & Portfolio', fields: ['resume', 'portfolioUrl'] },
    { title: 'Additional Details', fields: ['coverLetter', 'expectedSalary', 'noticePeriod'] },
    { title: 'Professional Links', fields: ['socialLinks'] },
    { title: 'Review & Submit', fields: [] }
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field?: string
  ) => {
    const { name, value } = e.target;
    if (field === 'socialLinks') {
      setApplicationData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value
        }
      }));
    } else {
      setApplicationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume file size must be less than 5MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    setResume(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload resume');

      const { fileUrl } = await response.json();
      setApplicationData(prev => ({ ...prev, resumeUrl: fileUrl }));
      toast.success('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const validateStep = (): boolean => {
    const currentFields = steps[currentStep].fields;
    
    for (const field of currentFields) {
      if (field === 'resume' && !applicationData.resumeUrl) {
        toast.error('Please upload your resume');
        return false;
      }
      if (field === 'email' && !applicationData.email) {
        toast.error('Please enter your email');
        return false;
      }
      if (field === 'name' && !applicationData.name) {
        toast.error('Please enter your name');
        return false;
      }
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) throw new Error('Failed to submit application');

      onSuccess?.();
      toast.success('Application submitted successfully');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{jobTitle}</h2>
          <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toast.message('Application Help', {
            description: 'Fill out each section of the application form. You can move between sections using the Previous and Next buttons.'
          })}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <Input
                name="name"
                value={applicationData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <Input
                name="email"
                type="email"
                value={applicationData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                name="phone"
                type="tel"
                value={applicationData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* Step 2: Resume & Portfolio */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Resume (PDF or Word) *</label>
              <div className="mt-1">
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('resume')?.click()}
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {applicationData.resumeUrl ? 'Change Resume' : 'Upload Resume'}
                </Button>
              </div>
              {applicationData.resumeUrl && (
                <p className="text-sm text-success mt-2">✓ Resume uploaded successfully</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Portfolio URL</label>
              <Input
                name="portfolioUrl"
                type="url"
                placeholder="https://your-portfolio.com"
                value={applicationData.portfolioUrl || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* Step 3: Additional Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cover Letter</label>
              <Textarea
                name="coverLetter"
                value={applicationData.coverLetter || ''}
                onChange={handleInputChange}
                placeholder="Tell us why you're interested in this position..."
                className="min-h-[200px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expected Salary</label>
                <Input
                  name="expectedSalary"
                  type="number"
                  placeholder="Annual salary expectation"
                  value={applicationData.expectedSalary || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notice Period (days)</label>
                <Input
                  name="noticePeriod"
                  type="number"
                  placeholder="How soon can you start?"
                  value={applicationData.noticePeriod || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Professional Links */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
              <Input
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={applicationData.socialLinks?.linkedin || ''}
                onChange={(e) => handleInputChange(e, 'socialLinks')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub Profile</label>
              <Input
                name="github"
                type="url"
                placeholder="https://github.com/your-username"
                value={applicationData.socialLinks?.github || ''}
                onChange={(e) => handleInputChange(e, 'socialLinks')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Personal Website</label>
              <Input
                name="website"
                type="url"
                placeholder="https://your-website.com"
                value={applicationData.socialLinks?.website || ''}
                onChange={(e) => handleInputChange(e, 'socialLinks')}
              />
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Personal Information</h3>
                <dl className="space-y-1 text-sm">
                  <div>
                    <dt className="inline text-muted-foreground">Name: </dt>
                    <dd className="inline ml-1">{applicationData.name}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Email: </dt>
                    <dd className="inline ml-1">{applicationData.email}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Phone: </dt>
                    <dd className="inline ml-1">{applicationData.phone || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="font-medium mb-2">Application Details</h3>
                <dl className="space-y-1 text-sm">
                  <div>
                    <dt className="inline text-muted-foreground">Resume: </dt>
                    <dd className="inline ml-1">✓ Uploaded</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Expected Salary: </dt>
                    <dd className="inline ml-1">
                      {applicationData.expectedSalary 
                        ? `$${applicationData.expectedSalary.toLocaleString()}`
                        : 'Not specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Notice Period: </dt>
                    <dd className="inline ml-1">
                      {applicationData.noticePeriod 
                        ? `${applicationData.noticePeriod} days`
                        : 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground p-4">
              <p className="text-sm text-muted-foreground">
                By submitting this application, you confirm that all information provided is accurate
                and complete. We'll review your application and contact you regarding next steps.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 0 ? onCancel : handlePrevStep}
          >
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>
          <Button
            type={currentStep === steps.length - 1 ? 'submit' : 'button'}
            onClick={currentStep === steps.length - 1 ? undefined : handleNextStep}
            disabled={isSubmitting}
          >
            {currentStep === steps.length - 1 ? (
              isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}