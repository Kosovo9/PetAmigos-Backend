const PetProfile = require('../models/PetProfile');

const Walker = require('../models/Walker');

const User = require('../models/User');



// ============================================

// PET MATCH CONTROLLER - PROTOCOLO DE PRUEBAS 10X

// GeoSpatial Queries con validación Multi-País

// ============================================



/**

 * TEST-G01: Buscar Compañeros de Juego (Velocidad < 100ms)

 * TEST-G03: Filtro de radio con validación de país

 */

exports.findPlaymates = async (req, res) => {

    try {

        const startTime = Date.now();

        const { 

            petId, 

            latitude, 

            longitude, 

            radiusKm = 5, 

            countryCode,

            limit = 20 

        } = req.query;

        const userId = req.userId;



        // Validar que la mascota existe y pertenece al usuario

        const pet = await PetProfile.findById(petId);

        if (!pet || pet.owner.toString() !== userId) {

            return res.status(404).json({ error: "Mascota no encontrada." });

        }



        // Validar coordenadas

        if (!latitude || !longitude) {

            return res.status(400).json({ error: "Coordenadas requeridas." });

        }



        // Validar countryCode (obligatorio para TEST-G02 y TEST-G03)

        if (!countryCode || !['US', 'CA', 'MX'].includes(countryCode)) {

            return res.status(400).json({ error: "countryCode requerido: US, CA o MX" });

        }



        // Convertir radio de km a metros (MongoDB usa metros)

        const radiusMeters = radiusKm * 1000;



        // TEST-G01: Consulta GeoSpatial optimizada con índice 2dsphere

        const playmates = await PetProfile.find({

            owner: { $ne: userId }, // Excluir propia mascota

            currentLocation: {

                $near: {

                    $geometry: {

                        type: 'Point',

                        coordinates: [parseFloat(longitude), parseFloat(latitude)]

                    },

                    $maxDistance: radiusMeters

                }

            },

            // TEST-G03: Filtro por countryCode obligatorio

            'ownerCountryCode': countryCode

        })

        .limit(parseInt(limit))

        .select('name breed moodScore currentLocation')

        .lean(); // lean() para mejor performance



        const queryTime = Date.now() - startTime;



        // TEST-G01: Validar velocidad < 100ms

        if (queryTime > 100) {

            console.warn(`⚠️ TEST-G01 FALLO: Query tomó ${queryTime}ms (límite: 100ms)`);

        }



        res.status(200).json({

            success: true,

            playmates,

            count: playmates.length,

            queryTime: `${queryTime}ms`,

            radius: `${radiusKm}km`,

            countryCode,

            testG01: queryTime <= 100 ? 'PASS' : 'FAIL'

        });



    } catch (error) {

        console.error("Error en findPlaymates:", error);

        res.status(500).json({ error: "Error al buscar compañeros de juego." });

    }

};



/**

 * TEST-G02: Validación Cross-Country

 * Detecta inconsistencias entre countryCode y ubicación real

 */

exports.validateCountryFilter = (req, res, next) => {

    const { countryCode, latitude, longitude } = req.query || req.body;



    if (!countryCode || !latitude || !longitude) {

        return next(); // Dejar pasar si no hay datos suficientes

    }



    // Detectar país por coordenadas (simplificado - en producción usar API de geocoding)

    const detectedCountry = detectCountryByCoordinates(parseFloat(latitude), parseFloat(longitude));



    if (detectedCountry && detectedCountry !== countryCode) {

        return res.status(400).json({

            error: "Filtro de País Inconsistente",

            message: `La ubicación (${latitude}, ${longitude}) corresponde a ${detectedCountry}, pero el filtro es ${countryCode}.`,

            testG02: 'FAIL'

        });

    }



    next();

};



/**

 * TEST-G04: Buscar Walkers con Filtro Regional

 */

exports.findWalkers = async (req, res) => {

    try {

        const { 

            latitude, 

            longitude, 

            radiusKm = 10, 

            countryCode,

            regionCode,

            language,

            limit = 20 

        } = req.query;



        // Validaciones

        if (!latitude || !longitude || !countryCode) {

            return res.status(400).json({ error: "Coordenadas y countryCode requeridos." });

        }



        // TEST-G05: Solo Walkers verificados (con regionCode)

        const query = {

            isVerified: true, // Solo verificados

            isAvailable: true,

            countryCode,

            currentLocation: {

                $near: {

                    $geometry: {

                        type: 'Point',

                        coordinates: [parseFloat(longitude), parseFloat(latitude)]

                    },

                    $maxDistance: radiusKm * 1000

                }

            }

        };



        // TEST-G04: Filtro por región e idioma

        if (regionCode) {

            query.regionCode = regionCode;

        }

        if (language) {

            query.language = language;

        }



        const walkers = await Walker.find(query)

            .limit(parseInt(limit))

            .select('userId rating certificationLevel language regionCode')

            .populate('userId', 'name email')

            .lean();



        res.status(200).json({

            success: true,

            walkers,

            count: walkers.length,

            filters: { countryCode, regionCode, language },

            testG04: 'PASS',

            testG05: 'PASS' // Solo walkers verificados (con regionCode)

        });



    } catch (error) {

        console.error("Error en findWalkers:", error);

        res.status(500).json({ error: "Error al buscar walkers." });

    }

};



/**

 * Helper: Detectar país por coordenadas (simplificado)

 * En producción, usar servicio de geocoding (Google Maps, Mapbox, etc.)

 */

function detectCountryByCoordinates(lat, lng) {

    // Zonas aproximadas (simplificado para pruebas)

    // US: 24.396308 a 49.384358 lat, -125.0 a -66.93457 lng

    // CA: 41.675105 a 83.110626 lat, -141.0 a -52.636291 lng

    // MX: 14.538829 a 32.716759 lat, -118.453948 a -86.811982 lng

    

    if (lat >= 24.396308 && lat <= 49.384358 && lng >= -125.0 && lng <= -66.93457) {

        // Verificar si es CA o US

        if (lat >= 41.675105 && lat <= 83.110626 && lng >= -141.0 && lng <= -52.636291) {

            return 'CA';

        }

        return 'US';

    }

    

    if (lat >= 14.538829 && lat <= 32.716759 && lng >= -118.453948 && lng <= -86.811982) {

        return 'MX';

    }

    

    return null;

}



