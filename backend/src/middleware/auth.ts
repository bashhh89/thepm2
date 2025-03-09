import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// TODO: Move to environment variables
const JWT_SECRET = 'your-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // For development, bypass authentication
  return next();
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    (req as any).user = user;
    next();
  });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // For development, allow all requests
  return next();
  
  const user = (req as any).user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}; 