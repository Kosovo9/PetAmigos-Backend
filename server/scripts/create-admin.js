
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
    // Conectar a DB
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }

    const args = process.argv.slice(2);
    const email = args[0] || 'admin@petamigos.org';
    const password = args[1] || crypto.randomBytes(8).toString('hex') + 'A1!'; // Default random strong pass

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`⚠️ El usuario ${email} ya existe. Actualizando a ADMIN...`);
            existingUser.role = 'admin';
            if (args[1]) {
                const salt = await bcrypt.genSalt(10);
                existingUser.password = await bcrypt.hash(password, salt);
            }
            await existingUser.save();
            console.log(`✅ Usuario ${email} actualizado a ADMIN.`);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                name: 'Admin Principal',
                email,
                password: hashedPassword,
                role: 'admin',
                credits: 999999,
                isPremium: true
            });
            console.log(`✅ Usuario ADMIN creado: ${email}`);
        }

        if (!args[1]) {
            console.log(`🔐 Password generado (guárdalo bien): ${password}`);
        }

    } catch (err) {
        console.error('❌ Error creando admin:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createAdmin();
