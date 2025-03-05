import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Label } from './Label';
import { Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

export function JobsAIManager() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobPrompt, setJobPrompt] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');

  const generateJob = async () => {
    if (!jobPrompt) {
      toast.error('Please describe the job position');
      return;
    }

    setIsGenerating(true);
    try {
      const aiPrompt = `Create a professional job description for the following position. Include these sections:
      1. Overview
      2. Responsibilities
      3. Requirements
      4. Benefits and perks
      
      Job Context: ${jobPrompt}
      Department: ${department}
      Location: ${location || 'Remote'}
      Type: ${jobType || 'Full-time'}
      Experience Level: ${experience}
      
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
      }`;

      const response = await window.puter.ai.chat(aiPrompt, false, {
        model: 'gpt-4-mini',
        stream: false
      });

      const generatedJob = JSON.parse(response.message.content);

      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedJob,
          requirements: JSON.stringify(generatedJob.requirements),
          benefits: JSON.stringify(generatedJob.benefits)
        })
      });

      toast.success('Job created successfully!');
      setJobPrompt('');
      setDepartment('');
      setLocation('');
      setJobType('');
      setExperience('');
    } catch (error) {
      console.error('Error generating job:', error);
      toast.error('Failed to generate job');
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Remote, New York, London"
            />
          </div>

          <div className="space-y-2">
            <Label>Job Type</Label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
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
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
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
            value={jobPrompt}
            onChange={(e) => setJobPrompt(e.target.value)}
            placeholder="Describe the role, key responsibilities, and ideal candidate..."
            rows={4}
          />
        </div>

        <Button
          onClick={generateJob}
          disabled={isGenerating || !jobPrompt}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Job Description...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Job Description
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}