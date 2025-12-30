/**
 * Sistema de Autenticación Universal Backend
 * Valida tokens de múltiples proveedores (Clerk, Google, etc.)
 */

class UniversalAuth {
    constructor() {
        this.providers = ['clerk', 'google', 'apple', 'microsoft'];
    }

    async validateToken(token, provider = 'clerk') {
        switch (provider) {
            case 'clerk':
                return this.validateClerkToken(token);
            case 'google':
                return this.validateGoogleToken(token);
            default: // Default JWT validation logic
                // Aquí iría tu lógica de validación JWT genérica (jsonwebtoken verify)
                return { valid: true, decoded: { /* mock */ } };
        }
    }

    async validateClerkToken(token) {
        // En producción usarías @clerk/clerk-sdk-node
        // Mock para desarrollo local si no hay SDK backend
        return {
            valid: true,
            provider: 'clerk',
            uid: 'user_mock_123'
        };
    }

    async validateGoogleToken(token) {
        // Mock validation
        return {
            valid: true,
            provider: 'google',
            email: 'user@gmail.com'
        };
    }
}

module.exports = UniversalAuth;
