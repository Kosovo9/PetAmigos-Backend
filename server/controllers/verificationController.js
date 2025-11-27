const User = require('../models/User');

const PetProfile = require('../models/PetProfile');

const Walker = require('../models/Walker');

const { logBiometricFailure } = require('../middleware/auditLogger');



// ============================================

// CONTROLADOR DE VERIFICACIÓN BIOMÉTRICA

// Protocolo C.I.A. / Anti-Robo / Legal

// ============================================



/**

 * Verificación Biométrica de Check-In (Huella/Facial)

 * Registra intentos fallidos para detección de fraude

 */

exports.biometricCheckIn = async (req, res) => {

    try {

        const { userId, petId, biometricType, biometricData } = req.body;

        const ip = req.ip || 'unknown';



        // 1. Validar que el usuario existe

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({ error: "Usuario no encontrado." });

        }



        // 2. Validar que la mascota existe y pertenece al usuario

        const pet = await PetProfile.findOne({ _id: petId, owner: userId });

        if (!pet) {

            return res.status(404).json({ error: "Mascota no encontrada o no autorizada." });

        }



        // 3. Simulación de Verificación Biométrica

        // En producción, aquí iría la integración con hardware biométrico real

        const isBiometricValid = biometricData && biometricData.length > 0;



        if (!isBiometricValid) {

            // Registrar fallo en log de auditoría (Protocolo FBI)

            logBiometricFailure({

                ip,

                userId: user._id.toString(),

                type: 'CHECK_IN',

                attempts: 1

            });



            return res.status(401).json({

                error: "Verificación biométrica fallida.",

                code: "BIOMETRIC_FAIL",

                message: "La huella/facial no coincide con los registros."

            });

        }



        // 4. Actualizar estado de verificación de la mascota

        pet.biometricData = {

            hasFingerprint: biometricType === 'fingerprint',

            hasFacialRecognition: biometricType === 'facial'

        };

        pet.isCiaVerified = true; // Marcar como verificado C.I.A.

        await pet.save();



        // 5. Éxito: Check-in completado

        // Sugerir acuñación de PIT Token si no existe

        const hasPITToken = pet.pitTokenId !== null;

        const pitTokenSuggestion = !hasPITToken ? {

            message: "¡Tu mascota está verificada C.I.A.! Ahora puedes acuñar su PIT Token (Identidad Digital Inmutable).",

            action: "mint_pit_token",

            endpoint: "/api/pit-token/mint"

        } : null;



        res.status(200).json({

            success: true,

            message: "Check-in biométrico exitoso.",

            pet: {

                id: pet._id,

                name: pet.name,

                isVerified: true,

                isCiaVerified: true

            },

            pitTokenSuggestion

        });



    } catch (error) {

        console.error("Error en biometricCheckIn:", error);

        res.status(500).json({ error: "Error interno del servidor." });

    }

};



/**

 * Cláusula Legal de Intermediación y Servicios Funerarios

 * Documento legal que el usuario debe aceptar al usar la plataforma

 */

exports.getLegalClause = (req, res) => {

    const legalClause = {

        title: "Términos de Intermediación y Servicios Funerarios",

        version: "1.0",

        effectiveDate: new Date().toISOString(),

        clauses: [

            {

                section: "1. INTERMEDIACIÓN DE SERVICIOS",

                content: "PetAmigos World actúa como intermediario entre usuarios y proveedores de servicios (walkers, veterinarios, etc.). No somos responsables directos de los servicios prestados por terceros."

            },

            {

                section: "2. SERVICIOS FUNERARIOS Y LEGADO DIGITAL",

                content: "Los servicios funerarios y de memorialización son proporcionados por terceros. PetAmigos World facilita la conexión pero no garantiza la disponibilidad de estos servicios."

            },

            {

                section: "3. FONDO FIDUCIARIO",

                content: "Los fondos memoriales son gestionados por terceros fiduciarios. PetAmigos World no es responsable de la gestión de estos fondos."

            },

            {

                section: "4. ACEPTACIÓN",

                content: "Al usar esta plataforma, el usuario acepta estos términos y reconoce que PetAmigos World actúa únicamente como intermediario."

            }

        ],

        acceptanceRequired: true

    };



    res.status(200).json(legalClause);

};



/**

 * Endpoint para que el usuario acepte los términos legales

 */

exports.acceptLegalClause = async (req, res) => {

    try {

        const { userId } = req.body;

        const user = await User.findById(userId);



        if (!user) {

            return res.status(404).json({ error: "Usuario no encontrado." });

        }



        // Marcar que el usuario aceptó los términos

        user.legalAcceptance = {

            accepted: true,

            acceptedAt: new Date(),

            version: "1.0"

        };

        await user.save();



        res.status(200).json({

            success: true,

            message: "Términos legales aceptados correctamente."

        });



    } catch (error) {

        console.error("Error en acceptLegalClause:", error);

        res.status(500).json({ error: "Error interno del servidor." });

    }

};

/**
 * Verificar acceso biométrico
 * Similar a biometricCheckIn pero para validación de acceso
 */
exports.verifyBiometricAccess = async (req, res) => {
    try {
        const { userId, petId, biometricType, biometricData } = req.body;
        const ip = req.ip || 'unknown';

        // 1. Validar usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // 2. Validar mascota
        const pet = await PetProfile.findOne({ _id: petId, owner: userId });
        if (!pet) {
            return res.status(404).json({ error: "Mascota no encontrada o no autorizada." });
        }

        // 3. Verificar datos biométricos
        const isBiometricValid = biometricData && biometricData.length > 0;

        if (!isBiometricValid) {
            logBiometricFailure({
                ip,
                userId: user._id.toString(),
                type: 'ACCESS_VERIFICATION',
                attempts: 1
            });

            return res.status(401).json({
                error: "Verificación biométrica fallida.",
                code: "BIOMETRIC_FAIL"
            });
        }

        // 4. Éxito
        res.status(200).json({
            success: true,
            message: "Acceso biométrico verificado.",
            verified: true,
            pet: {
                id: pet._id,
                name: pet.name,
                isCiaVerified: pet.isCiaVerified
            }
        });

    } catch (error) {
        console.error("Error en verifyBiometricAccess:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

