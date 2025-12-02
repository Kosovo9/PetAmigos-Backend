const User = require('../models/User');

const PetProfile = require('../models/PetProfile');



// ============================================

// RATE LIMITER - MONETIZACIÓN SILENCIOSA

// Controla costos y fuerza upsell (5 llamadas/día para NO Lifetime)

// ============================================



// Almacenamiento en memoria (en producción usar Redis)

const dailyUsage = new Map();



const rateLimiter = async (req, res, next) => {

    try {

        const userId = req.userId;

        if (!userId) {

            return res.status(401).json({ error: "Usuario no autenticado." });

        }



        // Verificar si es usuario Premium (Lifetime)

        const user = await User.findById(userId);

        const pet = await PetProfile.findOne({ owner: userId });

        const isPremium = pet?.isLifetimeMember || false;



        // Usuarios Premium: Sin límite

        if (isPremium) {

            return next();

        }



        // Usuarios NO Premium: Límite de 5 llamadas/día

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const key = `${userId}_${today}`;

        const currentCount = dailyUsage.get(key) || 0;

        const limit = 5;



        if (currentCount >= limit) {

            return res.status(429).json({

                error: "Límite diario alcanzado",

                message: `Has alcanzado el límite de ${limit} generaciones diarias. ¡Actualiza a Premium para generaciones ilimitadas!`,

                limit: limit,

                used: currentCount,

                upgradeUrl: "/upgrade-to-premium"

            });

        }



        // Incrementar contador

        dailyUsage.set(key, currentCount + 1);



        // Limpiar entradas antiguas (cada 24 horas)

        if (dailyUsage.size > 1000) {

            const yesterday = new Date();

            yesterday.setDate(yesterday.getDate() - 1);

            const yesterdayStr = yesterday.toISOString().split('T')[0];

            for (const [k] of dailyUsage) {

                if (k.endsWith(yesterdayStr)) {

                    dailyUsage.delete(k);

                }

            }

        }



        // Agregar headers de rate limit

        res.setHeader('X-RateLimit-Limit', limit);

        res.setHeader('X-RateLimit-Remaining', limit - currentCount - 1);

        res.setHeader('X-RateLimit-Reset', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());



        next();

    } catch (error) {

        console.error("Error en rateLimiter:", error);

        // En caso de error, permitir la solicitud (fail open)

        next();

    }

};



module.exports = rateLimiter;



