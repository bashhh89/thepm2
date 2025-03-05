import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Input } from './Input';
import { Label } from './Label';
import { Loader2, Sparkles, RefreshCcw, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIToolsProps {
  onGenerateContent?: (content: any) => void;
  onRefine?: (content: any) => void;
}

export function AITools({ onGenerateContent, onRefine }: AIToolsProps) {
  const [prompt, setPrompt] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateJobDescription = async () => {
    if (!prompt) {
      toast.error('Please provide job details first');
      return;
    }
    
    setIsGenerating(true);
    try {
      const aiPrompt = `Create a professional job description for the following position. Include these sections:
      1. Overview
      2. Responsibilities
      3. Requirements
      4. Benefits and perks
      
      Job Context: ${prompt}
      Department: ${department || 'Not specified'}
      Location: ${location || 'Remote'}
      Experience Level: ${experience || 'All levels'}
      
      Format the response as a JSON object with:
      {
        "title": "Job title",
        "department": "Department name",
        "location": "Location",
        "type": "Full-time/Part-time",
        "experience": "Experience level",
        "description": "Overview text",
        "requirements": ["array", "of", "requirements"],
        "benefits": ["array", "of", "benefits"]
      }

      Make it engaging, inclusive, and highlight growth opportunities.`;

      const response = await window.puter.ai.chat(aiPrompt, false, {
        model: 'gpt-4o-mini',
        stream: false
      });

      const generatedContent = JSON.parse(response.message.content);
      onGenerateContent?.(generatedContent);
      toast.success('Job description generated successfully!');
    } catch (error) {
      console.error('Error generating job description:', error);
      toast.error('Failed to generate job description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const refineJobDescription = async (existingContent: string) => {
    setIsGenerating(true);
    try {
      const aiPrompt = `Refine and enhance this job description while maintaining accuracy:

      ${existingContent}

      Make it:
      1. More engaging and conversational
      2. More inclusive and welcoming
      3. Clearer about growth opportunities
      4. More specific about day-to-day responsibilities
      5. More compelling in terms of benefits and culture

      Keep the JSON structure but improve the content.`;

      const response = await window.puter.ai.chat(aiPrompt, false, {
        model: 'gpt-4o-mini',
        stream: false
      });

      const refinedContent = JSON.parse(response.message.content);
      onRefine?.(refinedContent);
      toast.success('Job description refined successfully!');
    } catch (error) {
      console.error('Error refining job description:', error);
      toast.error('Failed to refine job description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">AI Job Description Generator</h3>
          <p className="text-sm text-muted-foreground">
            Create engaging job descriptions with AI assistance
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={department}
                onValueChange={setDepartment}
                options={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Design', label: 'Design' },
                  { value: 'Product', label: 'Product' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Sales', label: 'Sales' },
                  { value: 'Customer Support', label: 'Customer Support' },
                  { value: 'HR', label: 'HR' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'Operations', label: 'Operations' },
                ]}
                placeholder="Select department"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Remote, New York, London"
              />
            </div>

            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select
                value={experience}
                onValueChange={setExperience}
                options={[
                  { value: 'Entry Level', label: 'Entry Level' },
                  { value: 'Mid Level', label: 'Mid Level' },
                  { value: 'Senior', label: 'Senior' },
                  { value: 'Lead', label: 'Lead' },
                  { value: 'Manager', label: 'Manager' },
                  { value: 'Director', label: 'Director' },
                  { value: 'Executive', label: 'Executive' },
                ]}
                placeholder="Select experience level"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Details</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the role, key responsibilities, and ideal candidate..."
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={generateJobDescription}
              disabled={isGenerating || !prompt}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Description
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => refineJobDescription(prompt)}
              disabled={isGenerating || !prompt}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refine
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI will help you create professional and engaging job descriptions
          </p>
        </div>
      </div>
    </Card>
  );
}