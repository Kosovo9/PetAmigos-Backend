
import { Request, Response, NextFunction } from 'express';

const rateLimitStore = new Map();

export const rateLimit = (maxRequests = 10, windowMs = 60000) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const now = Date.now();
        const requests = rateLimitStore.get(key) || [];

        // Limpiar peticiones antiguas
        const recentRequests = requests.filter((time: number) => now - time < windowMs);

        if (recentRequests.length >= maxRequests) {
            rateLimitStore.set(key, recentRequests);
            return res.status(429).json({ error: "Too many requests" });
        }

        recentRequests.push(now);
        rateLimitStore.set(key, recentRequests);
        next();
    };
};
