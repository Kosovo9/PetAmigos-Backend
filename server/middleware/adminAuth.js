// Middleware para verificar que el usuario es administrador
// Debe usarse DESPUÉS del middleware auth

module.exports = (req, res, next) => {
    // Verificar que el usuario existe (viene del middleware auth)
    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    // Verificar que el usuario es admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({
            error: 'Acceso denegado. Se requieren permisos de administrador.',
            code: '403-ADMIN-REQUIRED'
        });
    }

    next();
};
