import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

// Job schema validation
const jobSchema = z.object({
  title: z.string().min(1),
  department: z.string().min(1),
  location: z.string().min(1),
  type: z.string().min(1),
  experience: z.string().min(1),
  description: z.string().min(1),
  bannerImage: z.string().nullable(),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()),
});

// Get all jobs
router.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create a new job (admin only)
router.post('/api/jobs', authenticateToken, isAdmin, async (req, res) => {
  try {
    const jobData = jobSchema.parse(req.body);
    const job = await prisma.job.create({
      data: jobData,
    });
    res.status(201).json(job);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating job:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  }
});

// Update a job (admin only)
router.put('/api/jobs/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = jobSchema.parse(req.body);
    
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = await prisma.job.update({
      where: { id },
      data: jobData,
    });
    
    res.json(job);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Failed to update job' });
    }
  }
});

// Delete a job (admin only)
router.delete('/api/jobs/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.job.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router; 