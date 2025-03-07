import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const router = express.Router();

// Enable CORS
router.use(cors());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word documents, text files, and images (JPEG/PNG) are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handling middleware
const handleError = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Upload error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size must be less than 5MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Failed to upload file' });
};

// File upload endpoint
router.post('/api/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return handleError(err, req, res, next);
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Return the file URL
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        fileUrl,
        message: 'File uploaded successfully',
        fileName: req.file.originalname,
        fileType: req.file.mimetype
      });
    } catch (error) {
      next(error);
    }
  });
});

// Serve uploaded files statically
router.use('/uploads', express.static(uploadsDir));

export default router;