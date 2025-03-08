import express from 'express';
import cors from 'cors';
import path from 'path';
import brandingRouter from './routes/branding';
import uploadRouter from './routes/upload';
import applicationsRouter from './routes/applications';
import jobsRouter from './routes/jobs';
import extractRouter from './routes/extract';

const app = express();

// Configure CORS with more specific options
app.use(cors({
  origin: '*', // Configure this appropriately for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files with appropriate headers
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
  }
}));

// Routes
app.use('/api/branding', brandingRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/routes/extract-text', extractRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error occurred:', err);
  console.error('Stack trace:', err.stack);
  console.error('Request details:', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers
  });
  
  res.status(500).json({ 
    error: 'An unexpected error occurred',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

export default app;
