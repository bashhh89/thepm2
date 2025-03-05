import express from 'express';
import cors from 'cors';
import path from 'path';
import brandingRouter from './routes/branding';
import uploadRouter from './routes/upload';
import applicationsRouter from './routes/applications';
import jobsRouter from './routes/jobs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use(brandingRouter);
app.use(uploadRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/jobs', jobsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error occurred:', err.message);
  console.error('Request details:', req.method, req.url, req.body);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;