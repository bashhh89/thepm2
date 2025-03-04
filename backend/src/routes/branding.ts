import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticateToken, isAdmin } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Branding content schema validation
const brandingContentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['image', 'video', 'text']),
  content: z.string().min(1),
  category: z.enum(['team', 'about', 'vision', 'perks', 'stories']),
  order: z.number().int().min(0),
});

// Get all branding content
router.get('/api/branding-content', async (req, res) => {
  try {
    const content = await prisma.brandingContent.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(content);
  } catch (error) {
    console.error('Error fetching branding content:', error);
    res.status(500).json({ error: 'Failed to fetch branding content' });
  }
});

// Create new branding content (admin only)
router.post('/api/branding-content', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, type, content, category, order, subtitle, description } = req.body;
    let contentUrl = content;

    // If a file was uploaded, use its path as the content
    if (req.file) {
      contentUrl = `/uploads/${req.file.filename}`;
    }

    const contentData = brandingContentSchema.parse({
      title,
      subtitle,
      description,
      type,
      content: contentUrl,
      category,
      order: parseInt(order),
    });

    const brandingContent = await prisma.brandingContent.create({
      data: contentData,
    });

    res.status(201).json(brandingContent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating branding content:', error);
      res.status(500).json({ error: 'Failed to create branding content' });
    }
  }
});

// Update branding content (admin only)
router.put('/api/branding-content/:id', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, content, order } = req.body;
    let contentUrl = content;

    // If a file was uploaded, use its path as the content
    if (req.file) {
      contentUrl = `/uploads/${req.file.filename}`;
      // TODO: Delete old file if it exists
    }

    const contentData = brandingContentSchema.parse({
      title,
      type,
      content: contentUrl,
      order: parseInt(order),
    });

    const brandingContent = await prisma.brandingContent.update({
      where: { id },
      data: contentData,
    });

    res.json(brandingContent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error updating branding content:', error);
      res.status(500).json({ error: 'Failed to update branding content' });
    }
  }
});

// Delete branding content (admin only)
router.delete('/api/branding-content/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Get the content to delete the file if it exists
    const content = await prisma.brandingContent.findUnique({
      where: { id },
    });

    if (content && (content.type === 'image' || content.type === 'video')) {
      // TODO: Delete the file from the uploads directory
    }

    await prisma.brandingContent.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting branding content:', error);
    res.status(500).json({ error: 'Failed to delete branding content' });
  }
});

export default router; 