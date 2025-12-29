// Rate limiting middleware con Redis
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { Request, Response } from 'express';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Rate limit global por IP
export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests por ventana
    message: {
        error: 'Too many requests from this IP',
        message: 'Please try again later',
        retryAfter: 900 // 15 minutos en segundos
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        client: redis,
        prefix: 'rl:global:',
    }),
    skip: (req) => {
        // Whitelist para health checks
        return req.path === '/health' || req.path === '/api/health';
    },
    keyGenerator: (req) => {
        // Usar IP real detrás de proxies
        return req.ip ||
            req.headers['x-forwarded-for']?.toString() ||
            req.headers['x-real-ip']?.toString() ||
            'unknown';
    },
});

// Rate limit estricto para autenticación
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Solo 5 intentos de login
    message: {
        error: 'Too many login attempts',
        message: 'Account temporarily locked. Try again in 15 minutes.',
        retryAfter: 900
    },
    skipSuccessfulRequests: true, // No contar logins exitosos
    store: new RedisStore({
        client: redis,
        prefix: 'rl:auth:',
    }),
    handler: (req: Request, res: Response) => {
        // Log de intentos sospechosos
        console.warn('Auth rate limit exceeded:', {
            ip: req.ip,
            email: req.body?.email,
            timestamp: new Date().toISOString(),
            userAgent: req.headers['user-agent']
        });

        res.status(429).json({
            error: 'Too many login attempts',
            message: 'Your account has been temporarily locked due to multiple failed login attempts.',
            retryAfter: 900,
            lockUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        });
    },
});

// Rate limit por usuario autenticado (más permisivo)
export const authenticatedRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300, // 300 requests para usuarios autenticados
    message: {
        error: 'Rate limit exceeded',
        message: 'You have made too many requests',
        retryAfter: 900
    },
    store: new RedisStore({
        client: redis,
        prefix: 'rl:user:',
    }),
    skip: (req) => !req.user, // Solo aplicar a usuarios autenticados
    keyGenerator: (req) => {
        return `user:${req.user?.id || 'anonymous'}`;
    },
});

// Rate limit específico para APIs externas (webhooks, etc)
export const webhookRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10, // 10 webhooks por minuto
    message: {
        error: 'Webhook rate limit exceeded',
        message: 'Too many webhook requests',
        retryAfter: 60
    },
    store: new RedisStore({
        client: redis,
        prefix: 'rl:webhook:',
    }),
    keyGenerator: (req) => {
        // Rate limit por gateway (MercadoPago, PayPal, etc)
        const signature = req.headers['x-signature'] ||
            req.headers['paypal-transmission-sig'] ||
            'unknown';
        return `webhook:${signature.toString().substring(0, 20)}`;
    },
});

// Rate limit para APIs computacionalmente costosas
export const heavyOperationRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 50, // 50 operaciones pesadas por hora
    message: {
        error: 'Operation rate limit exceeded',
        message: 'You have exceeded the limit for this operation',
        retryAfter: 3600
    },
    store: new RedisStore({
        client: redis,
        prefix: 'rl:heavy:',
    }),
    keyGenerator: (req) => {
        return `heavy:${req.user?.id || req.ip}`;
    },
});

// Rate limit dinámico basado en comportamiento
export const adaptiveRateLimit = (baseMax: number = 100) => {
    return async (req: Request, res: Response, next: Function) => {
        const key = `adaptive:${req.user?.id || req.ip}`;

        try {
            // Obtener score de comportamiento del usuario
            const behaviorScore = await redis.get(`behavior:${key}`);
            const score = behaviorScore ? parseInt(behaviorScore) : 100;

            // Ajustar límite basado en comportamiento
            // Score alto = más permisivo, Score bajo = más restrictivo
            const adjustedMax = Math.floor(baseMax * (score / 100));
            const finalMax = Math.max(10, Math.min(adjustedMax, baseMax * 2));

            // Aplicar rate limit ajustado
            const limiter = rateLimit({
                windowMs: 15 * 60 * 1000,
                max: finalMax,
                store: new RedisStore({
                    client: redis,
                    prefix: 'rl:adaptive:',
                }),
                message: {
                    error: 'Rate limit exceeded',
                    message: `Your current rate limit is ${finalMax} requests per 15 minutes`,
                    retryAfter: 900
                }
            });

            return limiter(req, res, next);
        } catch (error) {
            console.error('Adaptive rate limit error:', error);
            next(); // Continuar si hay error
        }
    };
};

// Función para incrementar/decrementar behavior score
export const updateBehaviorScore = async (
    userId: string | undefined,
    ip: string,
    delta: number
) => {
    const key = `behavior:adaptive:${userId || ip}`;

    try {
        const current = await redis.get(key);
        const currentScore = current ? parseInt(current) : 100;
        const newScore = Math.max(0, Math.min(200, currentScore + delta));

        await redis.setex(key, 24 * 60 * 60, newScore.toString()); // TTL 24h

        return newScore;
    } catch (error) {
        console.error('Error updating behavior score:', error);
        return 100;
    }
};

// Eventos que afectan el behavior score
export const BEHAVIOR_EVENTS = {
    SUCCESSFUL_LOGIN: 5,
    FAILED_LOGIN: -10,
    SUCCESSFUL_PAYMENT: 10,
    FAILED_PAYMENT: -5,
    REPORT_RECEIVED: -20,
    ACCOUNT_VERIFIED: 15,
    SUSPICIOUS_ACTIVITY: -30,
    VALID_MATCH: 2,
    SPAM_DETECTED: -15
};

export default {
    globalRateLimit,
    authRateLimit,
    authenticatedRateLimit,
    webhookRateLimit,
    heavyOperationRateLimit,
    adaptiveRateLimit,
    updateBehaviorScore,
    BEHAVIOR_EVENTS
};
