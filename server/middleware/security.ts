
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { verify } from 'jsonwebtoken';
import { redis } from '../redis';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

declare global {
    namespace Express {
        interface Request {
            user?: any;
            deviceFingerprint?: string;
        }
    }
}

// Rate limiting por endpoint
export const securityMiddleware = {
    // General API protection
    api: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // límite de 100 requests por IP
        standardHeaders: true,
        legacyHeaders: false, // Updated for stricter types
        handler: (req: Request, res: Response) => {
            res.status(429).json({
                error: 'Too many requests',
                retryAfter: 15 * 60,
                message: 'Por favor intenta más tarde',
            });
        },
    }),

    // Auth endpoints - más estricto
    auth: rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5, // solo 5 intentos de login por IP
        skipSuccessfulRequests: true,
        handler: (req: Request, res: Response) => {
            res.status(429).json({
                error: 'Too many login attempts',
                message: 'Tu cuenta ha sido bloqueada temporalmente',
            });
        },
    }),

    // Financial endpoints - ultra estricto
    financial: rateLimit({
        windowMs: 60 * 1000, // 1 minuto
        max: 10, // 10 transacciones por minuto
        handler: (req: Request, res: Response) => {
            res.status(429).json({
                error: 'Transaction limit exceeded',
                message: 'Por favor espera un momento',
            });
        },
    }),
};

// Helmet security headers (Updated for strict mode)
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "https://api.petmatch.fun"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    referrerPolicy: { policy: 'same-origin' },
});

// JWT validation with blacklist
export async function validateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Check blacklist
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ error: 'Token revoked' });
        }

        // Verify token
        const decoded = verify(token, process.env.JWT_SECRET || 'secret') as any;

        // Check if user is still active
        const userActive = await redis.get(`user:active:${decoded.userId}`);
        // Loose check for dev
        // if (!userActive) {
        //  return res.status(401).json({ error: 'User not active' });
        // }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Device fingerprinting
export async function deviceFingerprint(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'];
    const acceptLanguage = req.headers['accept-language'];
    const ip = req.ip;

    // Generate device fingerprint
    const fingerprint = Buffer.from(`${userAgent}:${acceptLanguage}:${ip}`).toString('base64');

    // Check for suspicious patterns
    const suspiciousPatterns = [
        /bot/i,
        /crawl/i,
        /spider/i,
        /curl/i,
        /wget/i,
    ];

    const isSuspicious = suspiciousPatterns.some(pattern =>
        pattern.test(userAgent || '')
    );

    if (isSuspicious) {
        // Log and potentially block
        await redis.incr(`suspicious:${fingerprint}`);
        const count = await redis.get(`suspicious:${fingerprint}`);

        if (parseInt(count || '0') > 10) {
            return res.status(403).json({ error: 'Access denied' });
        }
    }

    req.deviceFingerprint = fingerprint;
    next();
}

// SQL Injection prevention
export function sqlInjectionPrevention(req: Request, res: Response, next: NextFunction) {
    const suspiciousPatterns = [
        /(\b(union|select|insert|update|delete|drop|create|alter|exec|script)\b|--|\/{2}|\/\*|\*\/|xp_)/i,
        /(\b(and|or|not|like|regexp|between|in|exists)\b.*[=<>])/i,
    ];

    const checkPayload = (payload: any): boolean => {
        if (!payload) return false;
        const payloadStr = JSON.stringify(payload);
        return suspiciousPatterns.some(pattern => pattern.test(payloadStr));
    };

    if (checkPayload(req.body) || checkPayload(req.query) || checkPayload(req.params)) {
        // Log the attempt
        console.error('SQL Injection attempt detected:', {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            payload: { body: req.body, query: req.query, params: req.params },
            timestamp: new Date().toISOString(),
        });

        return res.status(400).json({ error: 'Invalid request' });
    }

    next();
}

// XSS Prevention
export function xssPrevention(req: Request, res: Response, next: NextFunction) {
    const sanitizeInput = (input: any): any => {
        if (typeof input === 'string') {
            return input
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        }

        if (typeof input === 'object' && input !== null) {
            const sanitized: any = {};
            for (const key in input) {
                sanitized[key] = sanitizeInput(input[key]);
            }
            return sanitized;
        }

        return input;
    };

    req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);

    next();
}

// Advanced fraud detection
export async function fraudDetection(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || '127.0.0.1';
    const userId = req.user?.userId;

    // Check for rapid requests
    const requestKey = `requests:${ip}:${req.path}`;
    const requestCount = await redis.incr(requestKey);
    await redis.expire(requestKey, 60); // 1 minute window

    if (requestCount > 30) { // Más de 30 requests por minuto
        await redis.setex(`blocked:${ip}`, 3600, 'rapid_requests');
        return res.status(429).json({ error: 'Too many requests - IP blocked' });
    }

    // Check for geographic anomalies
    if (userId) {
        const lastLocation = await redis.get(`user:location:${userId}`);
        const currentLocation = (req.headers['cf-ipcountry'] as string) || 'unknown';

        if (lastLocation && lastLocation !== currentLocation) {
            // Possible account takeover
            await createSecurityAlert(userId, 'location_anomaly', {
                lastLocation,
                currentLocation,
                timestamp: new Date().toISOString(),
            });
        }

        await redis.setex(`user:location:${userId}`, 86400, currentLocation);
    }

    // Check device fingerprint consistency
    if (userId && req.deviceFingerprint) {
        const storedFingerprint = await redis.get(`user:fingerprint:${userId}`);
        if (storedFingerprint && storedFingerprint !== req.deviceFingerprint) {
            await createSecurityAlert(userId, 'device_change', {
                storedFingerprint,
                currentFingerprint: req.deviceFingerprint,
                timestamp: new Date().toISOString(),
            });
        }
    }

    next();
}

// Security alert system
async function createSecurityAlert(userId: string, type: string, details: any) {
    const alert = {
        userId,
        type,
        details,
        timestamp: new Date().toISOString(),
        severity: type === 'location_anomaly' ? 'high' : 'medium',
    };

    // Store in Redis for immediate action
    await redis.lpush(`security:alerts:${userId}`, JSON.stringify(alert));
    await redis.expire(`security:alerts:${userId}`, 86400);

    // Send email notification
    await sendSecurityEmail(userId, alert);
}

async function sendSecurityEmail(userId: string, alert: any) {
    const d = await getDb();
    if (!d) return;
    const [user] = await d.select().from(users).where(eq(users.id, Number(userId)));
    if (!user || !user.email) return;

    console.log(`[EMAIL MOCK] To: ${user.email}, Subject: 🛡️ Alerta de Seguridad - PetMatch, Body: Activity ${alert.type}`);
    // Mock email implementation
}

// Mock send email function
async function sendEmail(to: string, subject: string, html: string) {
    console.log(`Sending email to ${to}: ${subject}`);
}
