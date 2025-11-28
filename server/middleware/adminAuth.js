// Middleware para verificar que el usuario es administrador
// Debe usarse DESPUÉS del middleware auth

const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Verificar que el usuario existe (viene del middleware auth)
        if (!req.userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        // Buscar usuario en BD para verificar rol
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar que el usuario es admin
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.status(403).json({
                error: 'Acceso denegado. Se requieren permisos de administrador.',
                code: '403-ADMIN-REQUIRED'
            });
        }

        // Adjuntar usuario completo a la request por si se necesita
        req.user = user;

        next();
    } catch (error) {
        console.error('Error en adminAuth:', error);
        res.status(500).json({ error: 'Error de servidor en autorización' });
    }
};
