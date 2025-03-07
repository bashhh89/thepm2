import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface JobApplicationFlowProps {
  jobId: string;
  jobTitle: string;
  onSuccess: () => void;
}

export function JobApplicationFlow({ jobId, jobTitle, onSuccess }: JobApplicationFlowProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<{
    skills: string[];
    experience: string[];
    education: string[];
    match_score: number;
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');
      const data = await response.json();

      // Immediately start analysis after upload
      setIsAnalyzing(true);
      toast.info('Analyzing your resume...', { duration: 2000 });

      const aiResponse = await window.puter.ai.chat(
        `Analyze this resume for the ${jobTitle} position. Resume URL: ${data.fileUrl}`,
        false,
        { model: 'gpt-4', stream: false }
      );

      // Parse the AI response and update state
      const analysis = {
        skills: aiResponse.skills || [],
        experience: aiResponse.experience || [],
        education: aiResponse.education || [],
        match_score: aiResponse.match_score || 0
      };

      setResumeAnalysis(analysis);
      toast.success('Resume analyzed successfully!', { duration: 3000 });

      // Automatically submit if analysis looks good
      if (analysis.match_score > 70) {
        await submitApplication(data.fileUrl, analysis);
      } else {
        toast.info('Your resume has been analyzed. Would you like to proceed with your application?', {
          duration: 5000,
          action: {
            label: 'Submit Application',
            onClick: () => submitApplication(data.fileUrl, analysis)
          }
        });
      }

    } catch (error) {
      console.error('Upload/analysis error:', error);
      toast.error('Failed to process resume. Please try again.');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const submitApplication = async (resumeUrl: string, analysis: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('applications').insert([{
        job_id: jobId,
        resume_url: resumeUrl,
        analysis: analysis,
        status: 'pending',
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      toast.success('Application submitted successfully!');
      onSuccess();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        id="resume-upload"
        className="hidden"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileUpload}
      />
      <Button
        onClick={() => document.getElementById('resume-upload')?.click()}
        disabled={isUploading || isAnalyzing || isSubmitting}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading Resume...
          </>
        ) : isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Resume...
          </>
        ) : isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting Application...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </>
        )}
      </Button>

      {resumeAnalysis && (
        <div className="mt-4 space-y-2 text-sm">
          <p className="font-medium">Resume Analysis:</p>
          <div className="pl-4 border-l-2 border-primary/30">
            <p>Match Score: {resumeAnalysis.match_score}%</p>
            {resumeAnalysis.skills.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Key Skills:</p>
                <ul className="list-disc pl-4">
                  {resumeAnalysis.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}