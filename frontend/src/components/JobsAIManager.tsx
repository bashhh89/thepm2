import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Label } from './ui/Label';
import { Card } from './Card';
import { toast } from 'sonner';
import { Wand2, Loader2, Sparkles, PlusCircle, Save, Eye, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface JobsAIManagerProps {
  onGenerateContent?: (content: any) => void;
}

interface JobFormData {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface AIResponse {
  message: {
    content: string;
    tool_calls?: any[];
  };
  text?: string;
}

export function JobsAIManager({ onGenerateContent }: JobsAIManagerProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancingTitle, setIsEnhancingTitle] = useState(false);
  const [enhancedTitles, setEnhancedTitles] = useState<string[]>([]);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    type: '',
    experience: '',
    description: '',
    requirements: [],
    benefits: []
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const enhanceTitle = async () => {
    if (!jobTitle) {
      toast.error('Please enter a job title');
      return;
    }

    setIsEnhancingTitle(true);
    try {
      const prompt = `Enhance and provide 3 alternative versions of this job title: "${jobTitle}"
      Consider these factors:
      - Modern industry standards
      - SEO optimization
      - Career progression clarity
      - Market competitiveness
      Return as a JSON array of strings, ordered by seniority.
      Example: ["Senior Sales Director", "Head of Sales Operations", "Regional Sales Leadership Manager"]`;

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o-mini'
      }) as AIResponse;

      let titles;
      try {
        // Parse the response content
        const content = response.message.content;
        if (typeof content === 'string') {
          try {
            titles = JSON.parse(content.trim());
          } catch {
            // If parsing fails, split by newlines and clean up
            titles = content.split('\n')
              .map(t => t.trim())
              .filter(t => t && !t.startsWith('[') && !t.endsWith(']'));
          }
        } else if (Array.isArray(content)) {
          titles = content;
        } else if (typeof content === 'object' && content !== null) {
          // Handle case where content is already an object
          titles = [String(content)];
        } else {
          throw new Error('Unexpected response format');
        }

        // Ensure titles are valid strings
        titles = titles.map(title => {
          if (typeof title === 'object' && title !== null) {
            return String(title.title || title.name || JSON.stringify(title));
          }
          return String(title).trim();
        }).filter(title => title.length > 0);

        if (titles.length === 0) {
          throw new Error('No valid titles generated');
        }

        setEnhancedTitles(titles);

        // Auto-populate form data with selected title
        if (titles.length > 0) {
          setFormData(prev => ({
            ...prev,
            title: titles[0]
          }));
          onGenerateContent?.({ ...formData, title: titles[0] });
        }
      } catch (error) {
        console.error('Error parsing titles:', error);
        toast.error('Failed to parse title suggestions');
      }
    } catch (error) {
      console.error('Error enhancing title:', error);
      toast.error('Failed to enhance title');
    } finally {
      setIsEnhancingTitle(false);
    }
  };

  const generateFromPrompt = async () => {
    if (!quickPrompt) {
      toast.error('Please enter a job description prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // Enhanced pattern matching for better context extraction
      const experienceMatch = quickPrompt.match(/(d+)\s*(?:year|yr|years|\+)\s*(?:of)?\s*(?:experience)?/i);
      const locationMatch = quickPrompt.match(/\b(?:remote|hybrid|on[- ]?site|in\s+([A-Za-z\s,]+))\b/i);
      const titleMatch = quickPrompt.match(/(?:create|looking for|hiring|need|want)\s+(?:a|an)?\s+([^.,]+?)(?=\s+(?:position|role|job|with|requiring|\.|$))/i);
      const departmentMatch = quickPrompt.match(/\b(engineering|sales|marketing|design|product|support|hr|finance|operations)\b/i);
      const typeMatch = quickPrompt.match(/\b(full[- ]time|part[- ]time|contract|freelance|temporary)\b/i);

      const prompt = `Create a detailed job posting based on this context: "${quickPrompt}"
      Key details extracted:
      - Title: ${titleMatch ? titleMatch[1].trim() : 'Not specified'}
      - Experience: ${experienceMatch ? experienceMatch[1] + ' years' : 'Not specified'}
      - Location: ${locationMatch ? locationMatch[0] : 'Not specified'}
      - Department: ${departmentMatch ? departmentMatch[1] : 'Not specified'}
      - Type: ${typeMatch ? typeMatch[1] : 'Not specified'}
      
      Return as a JSON object with:
      {
        "title": "Professional job title",
        "department": "Most appropriate department based on title and context",
        "location": "Location mentioned or Remote",
        "type": "Full-time/Part-time/Contract based on context",
        "experience": "Required experience level with years",
        "description": "Detailed job description focusing on key responsibilities",
        "requirements": ["Array of 5-7 specific, measurable requirements"],
        "benefits": ["Array of 4-6 competitive benefits"]
      }
      
      Ensure:
      1. Requirements are specific and measurable
      2. Benefits are competitive and industry-standard
      3. Description includes role overview, responsibilities, and impact
      4. All fields match the extracted context
      5. Department aligns with organizational structure";

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o-mini'
      }) as AIResponse;

      let jobData;
      try {
        // Enhanced response parsing with fallback handling
        const content = response.message.content;
        if (typeof content === 'string') {
          // Clean up the response and attempt to parse JSON
          const cleanedContent = content.replace(/```json\n?|```/g, '').trim();
          jobData = JSON.parse(cleanedContent);
        } else if (typeof content === 'object' && content !== null) {
          jobData = content;
        } else {
          throw new Error('Invalid response format');
        }

        // Validate and sanitize the job data
        jobData = {
          title: String(jobData.title || '').trim(),
          department: String(jobData.department || '').trim(),
          location: String(jobData.location || '').trim(),
          type: String(jobData.type || '').trim(),
          experience: String(jobData.experience || '').trim(),
          description: String(jobData.description || '').trim(),
          requirements: Array.isArray(jobData.requirements) ? 
            jobData.requirements.map(String).filter(Boolean) : [],
          benefits: Array.isArray(jobData.benefits) ? 
            jobData.benefits.map(String).filter(Boolean) : []
        };

        setFormData(jobData);
        onGenerateContent?.(jobData);
        setIsDraftSaved(false);
        toast.success('Job details generated successfully!');
      } catch (parseError) {
        console.error('Error parsing job data:', parseError);
        toast.error('Failed to parse AI response');
      }
    } catch (error) {
      console.error('Error generating job:', error);
      toast.error('Failed to generate job details');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRequirement = async () => {
    if (!formData.title) {
      toast.error('Please generate or enter job details first');
      return;
    }

    try {
      const prompt = `Generate a single, specific requirement for a ${formData.title} position.
      Context:
      - Department: ${formData.department}
      - Experience Level: ${formData.experience}
      - Existing Requirements: ${JSON.stringify(formData.requirements)}
      
      Rules:
      1. Must be specific and measurable
      2. Should not duplicate existing requirements
      3. Include relevant technical skills or certifications
      4. Focus on key competencies for the role
      
      Return a single string without quotes.`;

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o-mini'
      }) as AIResponse;

      const newRequirement = response.message.content.replace(/^["']|["']$/g, '');
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement]
      }));
      setIsDraftSaved(false);
    } catch (error) {
      console.error('Error generating requirement:', error);
      toast.error('Failed to generate requirement');
    }
  };

  const generateBenefit = async () => {
    if (!formData.title) {
      toast.error('Please generate or enter job details first');
      return;
    }

    try {
      const prompt = `Generate a single, attractive benefit for a ${formData.title} position.
      Context:
      - Department: ${formData.department}
      - Experience Level: ${formData.experience}
      - Existing Benefits: ${JSON.stringify(formData.benefits)}
      
      Rules:
      1. Must be specific and valuable
      2. Should not duplicate existing benefits
      3. Consider industry standards
      4. Make it compelling and competitive
      
      Return a single string without quotes.`;

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o-mini'
      }) as AIResponse;

      const newBenefit = response.message.content.replace(/^["']|["']$/g, '');
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit]
      }));
      setIsDraftSaved(false);
    } catch (error) {
      console.error('Error generating benefit:', error);
      toast.error('Failed to generate benefit');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
    setIsDraftSaved(false);
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
    setIsDraftSaved(false);
  };

  const saveDraft = () => {
    localStorage.setItem('jobDraft', JSON.stringify(formData));
    setIsDraftSaved(true);
    toast.success('Draft saved successfully');
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">AI Job Creation Assistant</h3>
          <p className="text-sm text-muted-foreground">
            Use AI to create professional and engaging job postings
          </p>
        </div>

        {/* Quick Generation Section with Enhanced UI */}
        <div className="p-4 bg-primary/5 rounded-lg border">
          <Label className="mb-2 block">Quick Job Generation</Label>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe the job naturally, e.g.: 'Create a Senior Sales Manager position requiring 5 years of experience in B2B sales, remote position, focusing on team leadership and revenue growth'"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button 
                onClick={generateFromPrompt} 
                className="flex-1"
                disabled={isGenerating || !quickPrompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Full Job Posting
                  </>
                )}
              </Button>
              {formData.title && (
                <>
                  <Button
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isDraftSaved}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={togglePreviewMode}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {isPreviewMode ? 'Edit' : 'Preview'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Job Title</Label>
            <div className="flex gap-2">
              <Input
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                }}
                placeholder="Enter job title to enhance"
              />
              <Button
                variant="outline"
                onClick={enhanceTitle}
                disabled={isEnhancingTitle}
              >
                {isEnhancingTitle ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {enhancedTitles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Enhanced Titles</Label>
              <div className="grid gap-2">
                {enhancedTitles.map((title, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start font-normal"
                    onClick={() => {
                      setJobTitle(title);
                      setFormData(prev => ({ ...prev, title }));
                    }}
                  >
                    {title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Rest of the form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="">Select department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Customer Support">Customer Support</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Remote, New York, London"
              />
            </div>

            <div className="space-y-2">
              <Label>Job Type</Label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Experience Level</Label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="">Select experience level</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Details</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, key responsibilities, and ideal candidate..."
              rows={4}
            />
          </div>

          <Button
            onClick={generateRequirement}
            className="w-full"
          >
            Generate Requirement
          </Button>

          <Button
            onClick={generateBenefit}
            className="w-full"
          >
            Generate Benefit
          </Button>
        </div>
      </div>

      {/* Job Details Form */}
      <div className={cn("space-y-6 mt-6", isPreviewMode && "hidden")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Job Description</Label>
            {formData.description && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingDescription(!isEditingDescription)}
              >
                {isEditingDescription ? 'Save' : 'Edit'}
              </Button>
            )}
          </div>
          <Textarea
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              setIsDraftSaved(false);
            }}
            placeholder="Describe the role, key responsibilities, and ideal candidate..."
            rows={6}
            disabled={!isEditingDescription}
          />
        </div>

        {/* Requirements Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Requirements</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={generateRequirement}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Requirement
            </Button>
          </div>
          <div className="space-y-2">
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-2 group">
                <div className="flex-1 p-2 bg-muted/30 rounded-md">
                  {req}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeRequirement(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Benefits</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={generateBenefit}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Benefit
            </Button>
          </div>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 group">
                <div className="flex-1 p-2 bg-muted/30 rounded-md">
                  {benefit}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeBenefit(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Mode */}
      {isPreviewMode && formData.title && (
        <div className="mt-6 space-y-6">
          <div className="prose max-w-none">
            <h1 className="text-2xl font-bold">{formData.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              <span>{formData.department}</span>
              <span>•</span>
              <span>{formData.location}</span>
              <span>•</span>
              <span>{formData.type}</span>
              <span>•</span>
              <span>{formData.experience}</span>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">About the Role</h2>
              <p className="whitespace-pre-wrap">{formData.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="list-disc pl-6 space-y-2">
                {formData.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Benefits</h2>
              <ul className="list-disc pl-6 space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}