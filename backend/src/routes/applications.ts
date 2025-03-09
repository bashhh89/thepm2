import express, { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

// Application schema validation
const applicationSchema = z.object({
  job_id: z.string(),
  user_name: z.string(),
  status: z.enum(['pending', 'reviewing', 'approved', 'rejected']).default('pending'),
  application_data: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    resumeUrl: z.string().url(),
    resumeContent: z.string(),
    coverLetter: z.string().optional(),
    analysis: z.object({
      score: z.number(),
      totalApplicants: z.number(),
      matchScore: z.number(),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      matchingJobs: z.array(z.object({
        title: z.string(),
        department: z.string(),
        matchScore: z.number()
      })),
      keyQualifications: z.array(z.string()),
      suggestedActions: z.array(z.object({
        type: z.enum(['cover_letter', 'skills', 'portfolio', 'certification']),
        title: z.string(),
        description: z.string()
      }))
    }).optional()
  }),
  conversation_history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.string()
  }))
});

// Schema for application status update
const updateStatusSchema = z.object({
  status: z.enum(['pending', 'reviewing', 'approved', 'rejected'])
});

// Get all applications (admin only)
router.get('/api/applications', authenticateToken, isAdmin, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        job: { // @ts-ignore
          tenantId: (req as any).tenantId,
        },
      },
      include: {
        job: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create a new application with resume analysis
router.post('/api/applications', async (req, res) => {
  try {
    const validatedData = applicationSchema.parse(req.body);
    
    // Analyze resume content and generate insights
    const analysis = await analyzeResume(validatedData.application_data.resumeContent, validatedData.job_id);
    
    const application = await prisma.application.create({
      data: {
        ...validatedData,
        application_data: {
          ...validatedData.application_data,
          analysis
        },
        admin_dashboard_viewed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    res.status(201).json(application);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating application:', error);
      res.status(500).json({ error: 'Failed to create application' });
    }
  }
});

// Generate cover letter based on resume and job
router.post('/api/applications/:id/generate-cover-letter', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.application.findUnique({
      where: {
        id: id,
        job: { // @ts-ignore
          tenantId: (req as any).tenantId,
        },
      },
      where: { id },
      include: { job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const coverLetter = await generateCoverLetter(
      application.application_data.resumeContent,
      application.job
    );

    res.json({ coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

// Update application status (admin only)
router.put('/api/applications/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = z.object({ status: applicationSchema.shape.status }).parse(req.body);

    const application = await prisma.application.update({
      where: {
        id: id,
        job: { // @ts-ignore
          tenantId: (req as any).tenantId,
        },
      },
      where: { id },
      data: { status },
      include: {
        job: true,
      },
    });

    res.json(application);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error updating application status:', error);
      res.status(500).json({ error: 'Failed to update application status' });
    }
  }
});

// Update application notes (admin only)
router.put('/api/applications/:id/notes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = z.object({ notes: applicationSchema.shape.notes }).parse(req.body);

    const application = await prisma.application.update({
      where: {
        id: id,
        job: { // @ts-ignore
          tenantId: (req as any).tenantId,
        },
      },
      where: { id },
      data: { notes },
      include: {
        job: true,
      },
    });

    res.json(application);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error updating application notes:', error);
      res.status(500).json({ error: 'Failed to update application notes' });
    }
  }
});

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: {
        job: { // @ts-ignore
          tenantId: (req as any).tenantId,
        },
      },
      include: {
        job: { // @ts-ignore
          select: {
            title: true,
            department: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create new application
router.post('/', async (req, res) => {
  try {
    const application = await prisma.jobApplication.create({
      data: {
        jobId: req.body.jobId,
        applicationData: req.body,
        status: 'pending'
      }
    });
    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// Update application status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = updateStatusSchema.parse(req.body);

    const application = await prisma.jobApplication.update({
      where: { id },
      data: { status }
    });
    
    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Update application status
router.patch('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const application = await prisma.jobApplication.update({
      where: { id },
      data: updates
    });

    res.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

export default router;