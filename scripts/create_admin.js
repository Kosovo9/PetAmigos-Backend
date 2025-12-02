require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../server/models/User');
const { connectWithRetry } = require('../server/config/database');

const createAdmin = async () => {
    console.log('🚀 CREANDO SUPER ADMIN...');

    const connected = await connectWithRetry();
    if (!connected) {
        console.error('❌ Error de conexión DB');
        process.exit(1);
    }

    try {
        const adminEmail = 'admin@petmatch.fun';
        const adminPassword = 'AdminPower2025!Secure';

        // Check if exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️ El admin ya existe.');
            // Update role just in case
            existingAdmin.role = 'superadmin';
            await existingAdmin.save();
            console.log('✅ Rol actualizado a superadmin.');
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            const newAdmin = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'superadmin',
                isPremium: true,
                subscriptionTier: 'pro',
                credits: 999999
            });
            console.log('✅ SUPER ADMIN CREADO EXITOSAMENTE.');
        }

        console.log('\n🔑 CREDENCIALES DE ACCESO:');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔒 Password: ${adminPassword}`);
        console.log(`🔗 Login URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}/login`);

    } catch (error) {
        console.error('❌ Error creando admin:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

createAdmin();
