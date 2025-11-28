const User = require('../models/User');
const LoveStory = require('../models/LoveStory');
const Transaction = require('../models/Transaction'); // Asumiendo que existe
const fs = require('fs');
const path = require('path');

// @desc    Obtener estadísticas generales del Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Usuarios
        const totalUsers = await User.countDocuments();
        const premiumUsers = await User.countDocuments({ isPremium: true });
        const newUsers24h = await User.countDocuments({
            createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        // 2. Ingresos (Simulado si no hay modelo Transaction completo)
        // Idealmente: const revenue = await Transaction.aggregate(...)
        const revenue = {
            total: 15420.50, // Placeholder
            today: 320.00,
            growth: '+12.5%'
        };

        // 3. Contenido
        const pendingStories = await LoveStory.countDocuments({ status: 'pending' });
        const totalStories = await LoveStory.countDocuments();

        // 4. Sistema
        const systemHealth = {
            cpu: process.cpuUsage(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        };

        res.json({
            users: {
                total: totalUsers,
                premium: premiumUsers,
                new24h: newUsers24h
            },
            revenue,
            content: {
                pendingStories,
                totalStories
            },
            system: systemHealth
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

// @desc    Obtener logs de seguridad (Fort Knox)
// @route   GET /api/admin/security-logs
// @access  Private/Admin
exports.getSecurityLogs = async (req, res) => {
    try {
        // Leer las últimas líneas del archivo de log
        const logPath = path.join(__dirname, '../security_audit.log');

        if (!fs.existsSync(logPath)) {
            return res.json({ logs: [] });
        }

        const logs = fs.readFileSync(logPath, 'utf8')
            .split('\n')
            .filter(line => line.trim())
            .slice(-50) // Últimos 50 eventos
            .reverse()
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return { message: line };
                }
            });

        res.json({ logs });
    } catch (error) {
        res.status(500).json({ error: 'Error al leer logs de seguridad' });
    }
};

// @desc    Obtener lista de usuarios paginada
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Actualizar rol de usuario
// @route   PUT /api/admin/users/:id/role
// @access  Private/SuperAdmin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        user.role = role;
        await user.save();

        res.json({ message: `Rol actualizado a ${role}`, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
