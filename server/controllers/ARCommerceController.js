// Controlador para manejar transacciones geolocalizadas y publicidad de RA (Realidad Aumentada)

const Transaction = require('../models/Transaction'); // Modelo simple para pagos



// Simulación de la base de datos de "Drops" de RA (ej. marcas de comida)

const AR_DROPS_DB = [

    { id: 'd001', location: { lat: 40.7, lng: -74.0 }, brand: 'PetCo', reward: '5% off coupon', maxClaim: 100 },

    // ... más drops

];



// 1. Obtener drops cercanos al usuario

exports.getNearbyARDrops = async (req, res) => {

    const { userLat, userLng, radiusKm = 1 } = req.query; 



    // En una implementación real, se usaría geolocalización de MongoDB ($geoNear o 2dsphere index)

    const nearbyDrops = AR_DROPS_DB.filter(drop => {

        // Lógica de distancia simple (MOCK)

        const distance = Math.sqrt(

            Math.pow(drop.location.lat - userLat, 2) + Math.pow(drop.location.lng - userLng, 2)

        ) * 111; // 111 km por grado de latitud (muy simple)

        return distance <= radiusKm;

    });



    res.json({ drops: nearbyDrops, message: "Drops de RA Patrocinada encontrados." });

};



// 2. Procesar el reclamo de una recompensa por el usuario

exports.claimAReward = async (req, res) => {

    const { dropId, userId } = req.body;

    

    // Lógica para verificar si el usuario ya ha reclamado, si el límite no se ha excedido, etc.



    // Simulación: registrar la transacción

    // await Transaction.create({ userId, type: 'AR_CLAIM', amount: 0, metadata: { dropId } });



    res.json({ 

        success: true, 

        reward: "Cupón de 5% de descuento activado en su Wallet.",

        message: "Recompensa reclamada con éxito. ¡Comercio de Realidad Aumentada completado!" 

    });

};

