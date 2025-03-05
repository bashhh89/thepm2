import express, { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

// Application schema validation
const applicationSchema = z.object({
  jobId: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  resumeUrl: z.string().url(),
  coverLetter: z.string().optional(),
  status: z.enum(['pending', 'reviewed', 'shortlisted', 'rejected']).default('pending'),
  notes: z.string().optional(),
});

// Get all applications (admin only)
router.get('/api/applications', authenticateToken, isAdmin, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
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

// Create a new application
router.post('/api/applications', async (req, res) => {
  try {
    const applicationData = applicationSchema.parse(req.body);
    
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: applicationData.jobId },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const application = await prisma.application.create({
      data: applicationData,
      include: {
        job: true,
      },
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

// Update application status (admin only)
router.put('/api/applications/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = z.object({ status: applicationSchema.shape.status }).parse(req.body);

    const application = await prisma.application.update({
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
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: {
        job: {
          select: {
            title: true,
            department: true
          }
        }
      }
    });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create new application
router.post('/', async (req: Request, res: Response) => {
  try {
    const { jobId, applicationData, conversationHistory } = req.body;
    
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userName: applicationData.name,
        applicationData,
        conversationHistory,
        adminDashboardViewed: false
      }
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
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