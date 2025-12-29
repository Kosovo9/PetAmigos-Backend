
// server/middleware/securityLogger.js
import SecurityLog from '../models/SecurityLog.js';

export const logSecurityEvent = async ({ action, userId, details, req }) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        // Use setImmediate to not block the event loop
        setImmediate(async () => {
            try {
                await SecurityLog.create({ action, userId, details, ip });
            } catch (e) { console.error("Log error", e); }
        });
    } catch (err) {
        console.error('Error al iniciar log de seguridad:', err);
    }
};
