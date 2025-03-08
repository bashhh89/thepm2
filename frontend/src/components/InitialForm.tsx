import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface InitialFormProps {
  jobTitle: string;
  jobId: string;
  department: string;
  onSuccess: (data: { name: string; email: string; leadId: string }) => void;
}

interface FormData {
  name: string;
  email: string;
}

export function InitialForm({ jobTitle, jobId, department, onSuccess }: InitialFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setFormErrors({});
      
      // Validate form
      const errors: Partial<FormData> = {};
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      }
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      console.log('Creating lead...', {
        name: formData.name,
        email: formData.email,
        jobId,
        jobTitle,
        department
      });

      // Create lead in CRM
      const response = await fetch('/api/create-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          jobId,
          jobTitle,
          department
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create lead');
      }

      console.log('Lead created successfully:', data);
      onSuccess({ ...formData, leadId: data.leadId });

    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to start application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">Apply for {jobTitle}</h2>
          <p className="text-center text-muted-foreground">
            Please provide your details to start the application process
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              className={cn(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                formErrors.name ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className={cn(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                formErrors.email ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting Application...
            </>
          ) : (
            'Start Application'
          )}
        </Button>
      </form>
    </Card>
  );
} 