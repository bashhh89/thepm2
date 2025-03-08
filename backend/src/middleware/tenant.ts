import { Request, Response, NextFunction } from 'express';

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract tenant ID from request headers, query parameters, or cookies
  const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || req.cookies.tenantId || 'default-tenant';

  // Attach tenant ID to the request object
  (req as any).tenantId = tenantId;

  next();
};