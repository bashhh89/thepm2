import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { PuterAI } from '../lib/puter';

const router = Router();

interface ResumeAnalysisRequest {
  resumeUrl: string;
  jobId: string;
  jobRequirements: {
    requiredSkills: string[];
    preferredSkills: string[];
    minimumExperience: number;
  };
}

router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeUrl, jobId, jobRequirements }: ResumeAnalysisRequest = req.body;

    // Fetch resume content
    const { data: resumeData, error: resumeError } = await supabase
      .storage
      .from('resumes')
      .download(resumeUrl);

    if (resumeError) throw resumeError;

    // Convert resume to text
    const resumeText = await resumeData.text();

    // Analyze with AI
    const analysis = await PuterAI.chat([
      {
        role: 'system',
        content: `You are an expert resume analyzer. Analyze the following resume for a position with these requirements:
        Required Skills: ${jobRequirements.requiredSkills.join(', ')}
        Preferred Skills: ${jobRequirements.preferredSkills.join(', ')}
        Minimum Experience: ${jobRequirements.minimumExperience} years

        Provide a detailed analysis including:
        1. Skills match percentage
        2. Experience match percentage
        3. Overall score
        4. Key strengths
        5. Areas for development
        6. Role alignment
        7. Suggested improvements

        Format your response as JSON matching the ResumeAnalysis interface.`
      },
      {
        role: 'user',
        content: resumeText
      }
    ]);

    // Parse AI response
    const analysisResult = JSON.parse(analysis.message.content);

    // Store analysis in database
    await supabase
      .from('resume_analyses')
      .insert({
        job_id: jobId,
        resume_url: resumeUrl,
        analysis: analysisResult,
        created_at: new Date().toISOString()
      });

    res.json(analysisResult);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

export default router; 