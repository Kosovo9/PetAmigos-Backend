const PetProfile = require('../models/PetProfile');

const DataLicenseLog = require('../models/DataLicenseLog');

const { logCriticalEvent } = require('../middleware/auditLogger');



// ============================================

// DATA EXCHANGE CONTROLLER - PILAR J1

// Intercambio de Datos Científicos (IP Global)

// Monetización pasiva de Propiedad Intelectual

// ============================================



/**

 * Licenciar datos anonimizados a farmacéuticas y centros de investigación

 * Protección IP con logs de auditoría (Pilar 3)

 */

exports.licenseData = async (req, res) => {

    try {

        const { licenseeId, dataType, purpose, licenseDuration } = req.body;

        const ip = req.ip || 'unknown';



        // 1. Validar tipo de datos solicitados

        const allowedDataTypes = ['biologicalAge', 'healthScore', 'moodScore', 'breedRiskFactor'];

        if (!allowedDataTypes.includes(dataType)) {

            return res.status(400).json({ error: "Tipo de datos no autorizado para licenciamiento." });

        }



        // 2. Obtener datos anonimizados (sin información personal)

        const anonymizedData = await getAnonymizedData(dataType);



        // 3. Registrar licenciamiento (Protección IP - CIA Protocol)

        const license = await DataLicenseLog.create({

            licenseeId,

            dataType,

            purpose,

            licenseDuration: licenseDuration || 365, // días

            dataPoints: anonymizedData.length,

            ipAddress: ip,

            timestamp: new Date()

        });



        // 4. Log de auditoría (Blindaje Legal)

        logCriticalEvent({

            ip,

            code: 'DATA_LICENSE_ISSUED',

            message: `Licencia de datos emitida: ${dataType} a ${licenseeId} para ${purpose}`

        });



        res.status(200).json({

            success: true,

            message: "Datos licenciados exitosamente.",

            license: {

                id: license._id,

                dataType,

                dataPoints: anonymizedData.length,

                licenseDuration: license.licenseDuration,

                expiresAt: new Date(Date.now() + license.licenseDuration * 24 * 60 * 60 * 1000)

            },

            data: anonymizedData

        });

    } catch (error) {

        console.error("Error en licenseData:", error);

        res.status(500).json({ error: "Error al licenciar datos." });

    }

};



/**

 * Obtener datos anonimizados (sin información personal)

 */

async function getAnonymizedData(dataType) {

    const projection = {};

    projection[dataType] = 1;

    projection.breed = 1;

    projection.dateOfBirth = 1; // Para calcular edad cronológica

    // NO incluir: owner, name, email, etc.



    const pets = await PetProfile.find({})

        .select(projection)

        .limit(10000) // Límite para evitar sobrecarga

        .lean();



    // Anonimizar datos

    return pets.map(pet => ({

        [dataType]: pet[dataType],

        breed: pet.breed,

        chronologicalAge: calculateAge(pet.dateOfBirth),

        // Remover cualquier dato identificable

        _id: undefined,

        owner: undefined

    }));

}



function calculateAge(dateOfBirth) {

    if (!dateOfBirth) return 0;

    const birthDate = new Date(dateOfBirth);

    const today = new Date();

    return (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000);

}



/**

 * Obtener estadísticas de licenciamiento (para dashboard)

 */

exports.getLicenseStats = async (req, res) => {

    try {

        const stats = await DataLicenseLog.aggregate([

            {

                $group: {

                    _id: '$dataType',

                    totalLicenses: { $sum: 1 },

                    totalDataPoints: { $sum: '$dataPoints' },

                    revenue: { $sum: '$licenseFee' || 0 }

                }

            }

        ]);



        res.status(200).json({

            success: true,

            stats

        });

    } catch (error) {

        console.error("Error en getLicenseStats:", error);

        res.status(500).json({ error: "Error al obtener estadísticas." });

    }

};


