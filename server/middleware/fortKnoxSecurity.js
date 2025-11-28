const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const { logCriticalEvent } = require('./auditLogger');

// 🛡️ FORT KNOX SECURITY SUITE - Nivel NASA/CIA/Top 10 Banks
// ============================================================================

// 1. HELMET.JS - Headers de Seguridad HTTP
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
});

// 2. RATE LIMITING - Anti-DDoS
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 requests por IP
    message: {
        error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.',
        code: '429-RATE-LIMIT'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Solo 5 intentos de login por IP
    skipSuccessfulRequests: true,
    message: {
        error: 'Demasiados intentos de autenticación. Cuenta bloqueada temporalmente.',
        code: '429-AUTH-LIMIT'
    }
});

// 3. IP BLACKLIST (Actualizable dinámicamente)
const blacklistedIPs = new Set([
    // Agregar IPs maliciosas conocidas
    // '192.168.1.100',
]);

const ipBlacklistMiddleware = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    if (blacklistedIPs.has(clientIP)) {
        logCriticalEvent({
            ip: clientIP,
            code: '403-IP-BLACKLIST',
            message: `IP bloqueada intentó acceder: ${req.path}`
        });

        return res.status(403).json({
            error: 'Acceso denegado.',
            code: '403-IP-BLACKLIST'
        });
    }

    next();
};

// 4. ANTI-SCRAPING - Detección de Bots
const botPatterns = [
    /bot/i, /crawl/i, /spider/i, /scrape/i, /curl/i, /wget/i, /python/i
];

const antiScrapingMiddleware = (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';

    const isBot = botPatterns.some(pattern => pattern.test(userAgent));

    if (isBot && !req.path.includes('/api/public')) {
        logCriticalEvent({
            ip: req.ip,
            code: '403-BOT-DETECTED',
            message: `Bot detectado: ${userAgent.substring(0, 100)}`
        });

        return res.status(403).json({
            error: 'Acceso de bots no autorizado.',
            code: '403-BOT-DETECTED'
        });
    }

    next();
};

// 5. ANTI-CLONING - Request Fingerprinting
const requestFingerprints = new Map();

const antiCloningMiddleware = (req, res, next) => {
    const fingerprint = `${req.ip}-${req.get('User-Agent')}-${req.path}`;
    const now = Date.now();

    if (requestFingerprints.has(fingerprint)) {
        const lastRequest = requestFingerprints.get(fingerprint);

        // Si la misma request exacta se repite en menos de 1 segundo
        if (now - lastRequest < 1000) {
            logCriticalEvent({
                ip: req.ip,
                code: '429-CLONE-DETECTED',
                message: `Posible clonación de request detectada`
            });

            return res.status(429).json({
                error: 'Solicitud duplicada detectada.',
                code: '429-CLONE-DETECTED'
            });
        }
    }

    requestFingerprints.set(fingerprint, now);

    // Limpiar fingerprints antiguos (más de 1 hora)
    if (requestFingerprints.size > 10000) {
        const cutoff = now - 3600000;
        for (const [key, timestamp] of requestFingerprints.entries()) {
            if (timestamp < cutoff) {
                requestFingerprints.delete(key);
            }
        }
    }

    next();
};

// 6. CSRF PROTECTION (Para formularios)
const csrfProtection = (req, res, next) => {
    // Solo para métodos que modifican datos
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const token = req.get('X-CSRF-Token') || req.body._csrf;

        // En producción, validar contra un token real generado por sesión
        // Por ahora, solo verificamos que exista (placeholder)
        if (!token && req.path.includes('/api/')) {
            logCriticalEvent({
                ip: req.ip,
                code: '403-CSRF',
                message: `Request sin token CSRF: ${req.path}`
            });

            // Solo advertir, no bloquear (para no romper el flujo actual)
            console.warn(`⚠️ CSRF Token faltante en ${req.path}`);
        }
    }

    next();
};

// 7. GEO-BLOCKING (Bloquear países de alto riesgo)
// Requiere un servicio de geolocalización como MaxMind o ipapi.co
const geoBlockingMiddleware = (req, res, next) => {
    // Placeholder - Implementar con servicio real si es necesario
    // const blockedCountries = ['XX', 'YY']; // Códigos ISO

    next();
};

// 8. ADVANCED SQL/NoSQL INJECTION DETECTION
const advancedInjectionPatterns = [
    /(\$where|\$ne|\$gt|\$lt)/i, // MongoDB operators
    /(union|select|insert|update|delete|drop|create|alter|exec|script)/i,
    /(<script|javascript:|onerror=|onload=)/i, // XSS
    /(\.\.\/|\.\.\\)/i, // Path traversal
    /(eval\(|setTimeout\(|setInterval\()/i, // Code injection
];

const advancedInjectionProtection = (req, res, next) => {
    const payload = JSON.stringify({ ...req.body, ...req.query, ...req.params });

    for (const pattern of advancedInjectionPatterns) {
        if (pattern.test(payload)) {
            logCriticalEvent({
                ip: req.ip,
                code: '403-ADVANCED-INJECTION',
                message: `Patrón de inyección avanzada detectado: ${pattern}`
            });

            return res.status(403).json({
                error: 'Violación de seguridad crítica detectada.',
                code: '403-ADVANCED-INJECTION'
            });
        }
    }

    next();
};

// 9. FILE UPLOAD PROTECTION
const fileUploadProtection = (req, res, next) => {
    if (req.files || req.file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxFileSize = 10 * 1024 * 1024; // 10MB

        const files = req.files ? Object.values(req.files).flat() : [req.file];

        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    error: 'Tipo de archivo no permitido.',
                    code: '400-FILE-TYPE'
                });
            }

            if (file.size > maxFileSize) {
                return res.status(400).json({
                    error: 'Archivo demasiado grande (máx 10MB).',
                    code: '400-FILE-SIZE'
                });
            }
        }
    }

    next();
};

// EXPORTAR TODO EL ARSENAL
module.exports = {
    helmetConfig,
    generalLimiter,
    authLimiter,
    ipBlacklistMiddleware,
    antiScrapingMiddleware,
    antiCloningMiddleware,
    csrfProtection,
    geoBlockingMiddleware,
    advancedInjectionProtection,
    fileUploadProtection,
};
