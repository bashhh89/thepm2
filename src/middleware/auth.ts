import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authHeader = (req: Request) => req.headers['authorization'];

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const header = authHeader(req);
    const token = header ? header.split(' ')[1] : undefined;

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};
