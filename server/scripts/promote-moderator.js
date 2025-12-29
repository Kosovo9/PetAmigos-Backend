
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const email = process.argv[2];

if (!email) {
    console.error('❌ Uso: npm run promote -- user@email.com');
    process.exit(1);
}

const promoteModerator = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`❌ Usuario no encontrado: ${email}`);
            process.exit(1);
        }

        user.role = 'moderator';
        await user.save();
        console.log(`✅ ¡Éxito! ${user.name} (${email}) ahora es MODERADOR.`);

    } catch (error) {
        console.error("Error promoting user:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

promoteModerator();
