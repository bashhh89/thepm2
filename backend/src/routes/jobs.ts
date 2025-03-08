import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import cors from 'cors';

const prisma = new PrismaClient();
const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Add cache control middleware
router.use((req: Request, res: Response, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

/**
 * @route POST /jobs
 * @desc Create a new job posting
 * @access Private
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, description, requirements, trainingData, department, location, type, experience, benefits } = req.body;

    const newJob = await prisma.job.create({
      data: {
        // @ts-ignore
tenantId: (req as any).tenantId,
        // TODO: Remove 'as any' and use proper type definition

        title,
        description,
        requirements,
        department,
        location,
        type,
        experience,
        benefits,
        // @ts-ignore
trainingData: trainingData,
      },
    });

    res.status(201).json(newJob);
  } catch (error: any) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

/**
 * @route GET /jobs
 * @desc Get all job postings
 * @access Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { // @ts-ignore
tenantId: (req as any).tenantId, },
      // TODO: Remove 'as any' and use proper type definition
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch job postings' });
  }
});

/**
 * @route GET /jobs/:id
 * @desc Get job posting by ID
 * @access Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const job = await prisma.job.findUnique({
      where: { id: jobId, // @ts-ignore
tenantId: (req as any).tenantId, },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    res.json(job);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch job posting' });
  }
});

/**
 * @route PUT /jobs/:id
 * @desc Update job posting by ID
 * @access Private
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const { title, description, requirements, trainingData } = req.body;

    const updatedJob = await prisma.job.update({
      where: { id: jobId, // @ts-ignore
tenantId: (req as any).tenantId, },
      data: {
        title,
        description,
        requirements,
        // @ts-ignore
trainingData: trainingData,
      },
    });

    res.json(updatedJob);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update job posting' });
  }
});

/**
 * @route DELETE /jobs/:id
 * @desc Delete job posting by ID
 * @access Private
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    await prisma.job.delete({
      where: { id: jobId, // @ts-ignore
tenantId: (req as any).tenantId, },
    });
    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete job posting' });
  }
});

export default router;
