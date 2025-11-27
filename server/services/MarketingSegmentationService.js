const axios = require('axios');

// ============================================
// MARKETING SEGMENTATION SERVICE - PILAR 2
// Segmentación de Marketing 10X para ForkAds.com
// Clave para el 40% de reinversión
// ============================================

/**
 * Segmenta usuarios para campañas de Ads de alta conversión.
 * Utiliza datos 10X (biologicalAge y moodScore) para identificar usuarios valiosos.
 * 
 * @param {Object} userData - Perfil del usuario y la mascota
 * @returns {string} SegmentName - El grupo de alto valor
 */
exports.segmentMarketingTarget = (userData) => {
    const { biologicalAge, moodScore, isLifetimeMember, chronologicalAge } = userData.petProfile;
    const financialScore = userData.financialScore || userData.userProfile?.financialScore || 0;

    // 1. TIER 1: Usuarios con Riesgo de Salud Extremo (Monetización Máxima)
    if (biologicalAge > chronologicalAge * 1.5 && !isLifetimeMember) {
        return "HIGH_RISK_HEALTH_UPSELL"; // Target para Ad: "Compra el Pasaporte AHORA."
    }
    
    // 2. TIER 2: Ansiedad de Dueño (Venta Inmediata de Servicio)
    if (moodScore < 40) {
        return "ANXIETY_SERVICE_TRIGGER"; // Target para Ad: "Walkers de Emergencia."
    }

    // 3. TIER 3: Legado Digital (Alto Valor)
    if (financialScore > 800 && biologicalAge >= 10) {
        return "HIGH_VALUE_LEGACY_WILL"; // Target para Ad: "Asegura el futuro de tu mascota."
    }

    return "STANDARD_ENGAGEMENT";
};

/**
 * Versión extendida que devuelve objeto completo (para uso interno)
 */
exports.segmentMarketingTargetExtended = (userData) => {
    const segment = exports.segmentMarketingTarget(userData);
    
    const segmentMap = {
        "HIGH_RISK_HEALTH_UPSELL": {
            segment: "HIGH_RISK_HEALTH_UPSELL",
            priority: 1,
            adMessage: "Tu mascota envejece más rápido de lo normal. Compra el Pasaporte de Longevidad AHORA.",
            cta: "Proteger Ahora",
            value: "HIGH"
        },
        "ANXIETY_SERVICE_TRIGGER": {
            segment: "ANXIETY_SERVICE_TRIGGER",
            priority: 2,
            adMessage: "Tu mascota parece triste. Walkers de Emergencia disponibles ahora.",
            cta: "Reservar Walker",
            value: "MEDIUM"
        },
        "HIGH_VALUE_LEGACY_WILL": {
            segment: "HIGH_VALUE_LEGACY_WILL",
            priority: 3,
            adMessage: "Asegura el futuro de tu mascota. Crea tu Testamento Digital hoy.",
            cta: "Crear Testamento",
            value: "HIGH"
        },
        "STANDARD_ENGAGEMENT": {
            segment: "STANDARD_ENGAGEMENT",
            priority: 5,
            adMessage: "Descubre todas las funciones de PetAmigos World.",
            cta: "Explorar",
            value: "LOW"
        }
    };

    return segmentMap[segment] || segmentMap["STANDARD_ENGAGEMENT"];
};

/**
 * Enviar segmentación a ForkAds.com API
 * Alimenta la estrategia de marketing con datos 10X
 */
exports.sendToForkAds = async (userId, segmentName) => {
    const forkAdsApiKey = process.env.FORKADS_API_KEY;
    const forkAdsEndpoint = process.env.FORKADS_ENDPOINT || 'https://api.forkads.com/v1/segments';

    if (!forkAdsApiKey) {
        console.warn("ForkAds API Key no configurada. Segmentación no enviada.");
        return null;
    }

    try {
        const response = await axios.post(
            forkAdsEndpoint,
            {
                userId,
                segment: segmentName,
                timestamp: new Date().toISOString()
            },
            {
                headers: {
                    'Authorization': `Bearer ${forkAdsApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error enviando a ForkAds:", error.response?.data || error.message);
        // No lanzar error, solo loggear (no crítico)
        return null;
    }
};

/**
 * Obtener todos los segmentos de un usuario para dashboard
 */
exports.getUserSegments = async (userData) => {
    const primarySegment = exports.segmentMarketingTarget(userData);
    
    // Segmentos secundarios (múltiples targets posibles)
    const secondarySegments = [];

    if (userData.petProfile.moodScore < 50) {
        secondarySegments.push("MOOD_MONITORING");
    }

    if (userData.petProfile.biologicalAge > userData.petProfile.chronologicalAge) {
        secondarySegments.push("HEALTH_ALERT");
    }

    if (!userData.petProfile.isLifetimeMember) {
        secondarySegments.push("UPSELL_OPPORTUNITY");
    }

    return {
        primary: primarySegment,
        secondary: secondarySegments,
        timestamp: new Date().toISOString()
    };
};

