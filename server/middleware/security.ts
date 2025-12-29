// Middleware de seguridad completo para Express
import helmet from 'helmet';
import hpp from 'hpp';
import { Request, Response, NextFunction } from 'express';
import { sanitizeObject } from '../lib/validation';

// Headers de seguridad completos con Helmet
export const securityHeaders = helmet({
    // Content Security Policy estricto
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Necesario para Next.js en dev
                "'unsafe-eval'",   // Necesario para hot reload
                "https://www.mercadopago.com",
                "https://www.paypal.com",
                "https://cdn.jsdelivr.net"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https://res.cloudinary.com",
                "https://*.huggingface.co",
                "https://www.paypalobjects.com"
            ],
            connectSrc: [
                "'self'",
                "https://api.mercadopago.com",
                "https://api.paypal.com",
                "https://api-inference.huggingface.co",
                "wss://" + (process.env.WS_DOMAIN || 'localhost:5000')
            ],
            frameSrc: [
                "'self'",
                "https://www.mercadopago.com",
                "https://www.paypal.com"
            ],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
        }
    },

    // HSTS con preload
    hsts: {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true
    },

    // Otras protecciones
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true,

    // Permisos restrictivos
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    dnsPrefetchControl: { allow: false },
    ieNoOpen: true
});

// Prevenir HTTP Parameter Pollution
export const preventHPP = hpp({
    whitelist: [
        'page',
        'limit',
        'sort',
        'filter',
        'search',
        'pet_type',
        'breed',
        'age',
        'location'
    ]
});

// Sanitización de inputs en body y query
export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Sanitizar query params
        if (req.query) {
            req.query = sanitizeObject(req.query);
        }

        // Sanitizar body
        if (req.body) {
            req.body = sanitizeObject(req.body);
        }

        // Sanitizar params
        if (req.params) {
            req.params = sanitizeObject(req.params);
        }

        next();
    } catch (error) {
        console.error('Error sanitizing inputs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Validar tamaño de payload
export const validatePayloadSize = (maxSize: number = 10 * 1024 * 1024) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const contentLength = parseInt(req.headers['content-length'] || '0');

        if (contentLength > maxSize) {
            return res.status(413).json({
                error: 'Payload too large',
                maxSize: `${maxSize / (1024 * 1024)}MB`,
                received: `${(contentLength / (1024 * 1024)).toFixed(2)}MB`
            });
        }

        next();
    };
};

// Detección de patrones sospechosos
export const detectSuspiciousPatterns = (req: Request, res: Response, next: NextFunction) => {
    const suspiciousPatterns = [
        // SQL Injection
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
        /(-{2}|\/\*|\*\/)/g,

        // XSS
        /(<script|<iframe|<object|<embed|on\w+\s*=)/gi,
        /javascript:/gi,

        // Path traversal
        /(\.\.\/|\.\.\\)/g,

        // Command injection
        /(\||;|&|`|\$\(|\$\{)/g,
    ];

    const checkString = (str: string): boolean => {
        return suspiciousPatterns.some(pattern => pattern.test(str));
    };

    const checkObject = (obj: any): boolean => {
        if (typeof obj === 'string') {
            return checkString(obj);
        }

        if (typeof obj === 'object' && obj !== null) {
            return Object.values(obj).some(value => checkObject(value));
        }

        return false;
    };

    // Verificar body, query y params
    const isSuspicious =
        checkObject(req.body) ||
        checkObject(req.query) ||
        checkObject(req.params);

    if (isSuspicious) {
        console.warn('Suspicious pattern detected:', {
            ip: req.ip,
            path: req.path,
            method: req.method,
            body: req.body,
            query: req.query,
            userAgent: req.headers['user-agent']
        });

        return res.status(400).json({
            error: 'Invalid request',
            message: 'Suspicious pattern detected in request'
        });
    }

    next();
};

// CORS seguro con whitelist
export const secureCORS = (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'https://petmatch-global.netlify.app',
        'https://amigospet.netlify.app'
    ];

    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
        res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
    }

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    next();
};

// Protección CSRF simple
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
    // Excluir GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    // Excluir webhooks (tienen su propia validación)
    if (req.path.includes('/webhook')) {
        return next();
    }

    const csrfToken = req.headers['x-csrf-token'] || req.body?._csrf;
    const sessionToken = req.session?.csrfToken;

    if (!sessionToken) {
        // Generar nuevo token si no existe
        req.session = req.session || {};
        req.session.csrfToken = generateCSRFToken();
        return next();
    }

    if (csrfToken !== sessionToken) {
        console.warn('CSRF token mismatch:', {
            ip: req.ip,
            path: req.path,
            method: req.method
        });

        return res.status(403).json({
            error: 'Invalid CSRF token',
            message: 'Request rejected for security reasons'
        });
    }

    next();
};

// Generar token CSRF aleatorio
function generateCSRFToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
}

// Headers de seguridad adicionales
export const additionalSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
    // Prevenir clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Prevenir MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // XSS Protection (legacy pero útil)
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Cross-Origin policies
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');

    next();
};

// Exportar middleware stack completo
export const securityMiddlewareStack = [
    securityHeaders,
    preventHPP,
    secureCORS,
    additionalSecurityHeaders,
    validatePayloadSize(),
    sanitizeInputs,
    detectSuspiciousPatterns,
    csrfProtection
];

export default securityMiddlewareStack;
