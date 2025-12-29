// Audit logging system para todas las acciones críticas
import winston from 'winston';
import { Request } from 'express';
import { db } from '../db';
import { auditLogs } from '../db/schema';

// Configurar logger específico para auditoría
const auditLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/audit.log',
            maxsize: 10485760, // 10MB
            maxFiles: 100,
            tailable: true
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [AUDIT] [${level}]: ${message} ${JSON.stringify(meta)}`;
                })
            )
        })
    ]
});

// Tipos de eventos auditables
export enum AuditEventType {
    // Autenticación
    USER_LOGIN = 'user.login',
    USER_LOGOUT = 'user.logout',
    USER_REGISTER = 'user.register',
    PASSWORD_CHANGE = 'user.password_change',
    PASSWORD_RESET = 'user.password_reset',
    EMAIL_VERIFIED = 'user.email_verified',
    MFA_ENABLED = 'user.mfa_enabled',
    MFA_DISABLED = 'user.mfa_disabled',

    // Usuarios
    USER_UPDATE = 'user.update',
    USER_DELETE = 'user.delete',
    USER_SUSPEND = 'user.suspend',
    USER_UNSUSPEND = 'user.unsuspend',

    // Mascotas
    PET_CREATE = 'pet.create',
    PET_UPDATE = 'pet.update',
    PET_DELETE = 'pet.delete',
    PET_VERIFY = 'pet.verify',

    // Matching
    MATCH_LIKE = 'match.like',
    MATCH_DISLIKE = 'match.dislike',
    MATCH_CREATED = 'match.created',
    MATCH_DELETED = 'match.deleted',

    // Pagos
    PAYMENT_CREATED = 'payment.created',
    PAYMENT_COMPLETED = 'payment.completed',
    PAYMENT_FAILED = 'payment.failed',
    PAYMENT_REFUNDED = 'payment.refunded',

    // Donaciones
    DONATION_CALCULATED = 'donation.calculated',
    DONATION_DISTRIBUTED = 'donation.distributed',

    // Anunciantes
    ADVERTISER_REGISTERED = 'advertiser.registered',
    CAMPAIGN_CREATED = 'campaign.created',
    CAMPAIGN_UPDATED = 'campaign.updated',
    CAMPAIGN_DELETED = 'campaign.deleted',
    AD_CLICKED = 'ad.clicked',

    // Refugios
    SHELTER_REGISTERED = 'shelter.registered',
    SHELTER_VERIFIED = 'shelter.verified',
    PROJECT_CREATED = 'project.created',
    IMPACT_UPLOADED = 'impact.uploaded',

    // Admin
    ADMIN_ACTION = 'admin.action',
    SETTINGS_CHANGED = 'settings.changed',
    USER_ROLE_CHANGED = 'user.role_changed',

    // Seguridad
    SUSPICIOUS_ACTIVITY = 'security.suspicious',
    RATE_LIMIT_EXCEEDED = 'security.rate_limit',
    UNAUTHORIZED_ACCESS = 'security.unauthorized',
    DATA_EXPORT = 'security.data_export',
    GDPR_REQUEST = 'security.gdpr_request',
}

// Niveles de severidad
export enum AuditSeverity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    CRITICAL = 'critical'
}

interface AuditLogData {
    eventType: AuditEventType;
    userId?: string;
    targetUserId?: string;
    targetEntityId?: string;
    targetEntityType?: string;
    severity: AuditSeverity;
    description: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
}

// Función principal para crear logs de auditoría
export async function createAuditLog(data: AuditLogData): Promise<void> {
    try {
        // Log a archivo
        auditLogger.log(data.severity, data.description, {
            eventType: data.eventType,
            userId: data.userId,
            targetUserId: data.targetUserId,
            targetEntityId: data.targetEntityId,
            targetEntityType: data.targetEntityType,
            metadata: data.metadata,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            requestId: data.requestId,
            timestamp: new Date().toISOString()
        });

        // Guardar en base de datos para consultas
        await db.insert(auditLogs).values({
            event_type: data.eventType,
            user_id: data.userId,
            target_user_id: data.targetUserId,
            target_entity_id: data.targetEntityId,
            target_entity_type: data.targetEntityType,
            severity: data.severity,
            description: data.description,
            metadata: data.metadata,
            ip_address: data.ipAddress,
            user_agent: data.userAgent,
            request_id: data.requestId,
            created_at: new Date()
        });

        // Alertar si es crítico
        if (data.severity === AuditSeverity.CRITICAL) {
            await sendCriticalAlert(data);
        }
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // No throw para no interrumpir flujo principal
    }
}

// Middleware para auditar requests automáticamente
export function auditMiddleware(eventType: AuditEventType, severity: AuditSeverity = AuditSeverity.INFO) {
    return async (req: Request, res: any, next: Function) => {
        // Interceptar response para auditar después de completar
        const originalJson = res.json.bind(res);

        res.json = function (body: any) {
            // Solo auditar si la operación fue exitosa
            if (res.statusCode >= 200 && res.statusCode < 300) {
                createAuditLog({
                    eventType,
                    userId: req.user?.id,
                    targetEntityId: body?.id,
                    targetEntityType: body?.type,
                    severity,
                    description: `${eventType} completed successfully`,
                    metadata: {
                        method: req.method,
                        path: req.path,
                        statusCode: res.statusCode,
                        body: sanitizeForAudit(body)
                    },
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                    requestId: req.id
                }).catch(console.error);
            }

            return originalJson(body);
        };

        next();
    };
}

// Helpers para eventos comunes
export const auditHelpers = {
    userLogin: (userId: string, req: Request, success: boolean) => {
        return createAuditLog({
            eventType: success ? AuditEventType.USER_LOGIN : AuditEventType.UNAUTHORIZED_ACCESS,
            userId,
            severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING,
            description: success ? 'User logged in successfully' : 'Failed login attempt',
            metadata: { success },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.id
        });
    },

    userLogout: (userId: string, req: Request) => {
        return createAuditLog({
            eventType: AuditEventType.USER_LOGOUT,
            userId,
            severity: AuditSeverity.INFO,
            description: 'User logged out',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.id
        });
    },

    paymentProcessed: (userId: string, paymentId: string, amount: number, status: string) => {
        return createAuditLog({
            eventType: status === 'completed' ? AuditEventType.PAYMENT_COMPLETED : AuditEventType.PAYMENT_FAILED,
            userId,
            targetEntityId: paymentId,
            targetEntityType: 'payment',
            severity: status === 'completed' ? AuditSeverity.INFO : AuditSeverity.WARNING,
            description: `Payment ${status}`,
            metadata: { amount, currency: 'USD', status }
        });
    },

    donationDistributed: (donationId: string, amount: number, shelterCount: number) => {
        return createAuditLog({
            eventType: AuditEventType.DONATION_DISTRIBUTED,
            targetEntityId: donationId,
            targetEntityType: 'donation',
            severity: AuditSeverity.INFO,
            description: `Donation distributed to ${shelterCount} shelters`,
            metadata: { amount, shelterCount, timestamp: new Date() }
        });
    },

    suspiciousActivity: (userId: string | undefined, req: Request, reason: string) => {
        return createAuditLog({
            eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
            userId,
            severity: AuditSeverity.CRITICAL,
            description: `Suspicious activity detected: ${reason}`,
            metadata: { reason, path: req.path, method: req.method },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.id
        });
    },

    adminAction: (adminId: string, action: string, targetUserId?: string, metadata?: any) => {
        return createAuditLog({
            eventType: AuditEventType.ADMIN_ACTION,
            userId: adminId,
            targetUserId,
            severity: AuditSeverity.WARNING,
            description: `Admin performed action: ${action}`,
            metadata
        });
    },

    dataExport: (userId: string, req: Request, dataType: string) => {
        return createAuditLog({
            eventType: AuditEventType.DATA_EXPORT,
            userId,
            severity: AuditSeverity.WARNING,
            description: `User exported data: ${dataType}`,
            metadata: { dataType },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.id
        });
    }
};

// Sanitizar datos sensibles antes de auditar
function sanitizeForAudit(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = [
        'password', 'token', 'secret', 'key', 'credit_card',
        'cvv', 'ssn', 'api_key', 'private_key'
    ];

    const sanitized = { ...data };

    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    }

    // Recursivo para objetos anidados
    for (const key in sanitized) {
        if (typeof sanitized[key] === 'object') {
            sanitized[key] = sanitizeForAudit(sanitized[key]);
        }
    }

    return sanitized;
}

// Enviar alertas críticas
async function sendCriticalAlert(data: AuditLogData): Promise<void> {
    try {
        // TODO: Integrar con servicio de alertas (Telegram, Slack, email)
        console.error('CRITICAL AUDIT EVENT:', data);

        // Ejemplo: enviar a Telegram
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            const message = `🚨 CRITICAL SECURITY ALERT\n\n` +
                `Event: ${data.eventType}\n` +
                `User: ${data.userId || 'Unknown'}\n` +
                `Description: ${data.description}\n` +
                `IP: ${data.ipAddress}\n` +
                `Time: ${new Date().toISOString()}`;

            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
        }
    } catch (error) {
        console.error('Failed to send critical alert:', error);
    }
}

export default {
    createAuditLog,
    auditMiddleware,
    auditHelpers,
    AuditEventType,
    AuditSeverity
};
