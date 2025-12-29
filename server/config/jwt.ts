
import crypto from 'crypto';

export const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (secret && secret !== 'mysecret123' && secret.length >= 32) {
        return secret;
    }

    // En desarrollo, advertir pero permitir funcionar
    if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ Warning: Using insecure or default JWT secret. This is fine for development but DANGEROUS for production.");
        return secret || 'dev-secret-do-not-use-in-prod';
    }

    // En producción, fallar si no es seguro
    throw new Error("❌ FATAL: JWT_SECRET invalid or too week for production. Must be 32+ chars.");
};
