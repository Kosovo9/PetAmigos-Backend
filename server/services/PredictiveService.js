// ============================================
// PREDICTIVE SERVICE - PILAR 1
// Pet Aging Clock - Cálculo de Edad Biológica
// ============================================

/**
 * Calcula la Edad Biológica Real (Biological Age) de la mascota.
 * Indicador de salud más valioso del mundo.
 * 
 * @param {Object} petData - Datos del perfil de la mascota
 * @returns {number} biologicalAge - La edad real ajustada
 */
exports.calculateBiologicalAge = (petData) => {
    // Coeficientes 10X: Factores de riesgo de longevidad y salud
    const CHRONO_FACTOR = 1.0; 
    const BREED_RISK_FACTOR = petData.breedRiskFactor || 0.1; // Ejemplo: 0.1 (Bajo) a 0.8 (Alto)
    const ACTIVITY_BONUS = petData.activityScore > 50 ? -0.05 : 0.05; // Si está activo, resta edad

    // Usar chronologicalAge del petData o calcularlo
    const chronologicalAge = petData.chronologicalAge || calculateChronologicalAge(petData.dateOfBirth);

    // Lógica Predictiva (Simplificada para inicio):
    let biologicalAge = chronologicalAge * CHRONO_FACTOR;
    
    // Ajuste por Raza (Riesgo aumenta la edad biológica):
    biologicalAge += biologicalAge * BREED_RISK_FACTOR;
    
    // Ajuste por Actividad (Longevidad):
    biologicalAge += biologicalAge * ACTIVITY_BONUS;

    // Ajuste por Mood Score (Salud mental afecta salud física)
    if (petData.moodScore < 40) {
        biologicalAge += biologicalAge * 0.1; // +10% si está triste
    } else if (petData.moodScore > 70) {
        biologicalAge -= biologicalAge * 0.05; // -5% si está muy feliz
    }

    // Ajuste por Health Score (si existe)
    if (petData.healthScore) {
        const healthFactor = (100 - petData.healthScore) / 100; // 0 a 1
        biologicalAge += biologicalAge * (healthFactor * 0.2); // Hasta +20% si salud baja
    }

    // Redondeo y aseguramos un valor positivo
    return Math.max(0, parseFloat(biologicalAge.toFixed(2)));
};

/**
 * Calcular edad cronológica desde fecha de nacimiento
 */
function calculateChronologicalAge(dateOfBirth) {
    if (!dateOfBirth) return 0;
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Convertir días a años (aproximado)
    return diffDays / 365.25;
}

/**
 * Obtener factor de riesgo por raza
 * Algunas razas tienen mayor riesgo de problemas de salud
 */
exports.getBreedRiskFactor = (breed) => {
    const breedRiskMap = {
        // Razas con alto riesgo
        'bulldog': 0.8,
        'pug': 0.7,
        'great_dane': 0.6,
        'german_shepherd': 0.4,
        'golden_retriever': 0.3,
        // Razas con bajo riesgo
        'mixed': 0.1,
        'mutt': 0.1,
        // Por defecto
        'default': 0.2
    };

    if (!breed) return 0.2;

    const breedLower = breed.toLowerCase().replace(/\s+/g, '_');
    
    // Buscar coincidencia parcial
    for (const [key, value] of Object.entries(breedRiskMap)) {
        if (breedLower.includes(key) || key.includes(breedLower)) {
            return value;
        }
    }

    return breedRiskMap.default;
};

/**
 * Calcular Activity Score basado en datos de actividad
 */
exports.calculateActivityScore = (activityData) => {
    if (!activityData || !activityData.steps || !activityData.activeMinutes) {
        return 50; // Score neutral por defecto
    }

    // Normalizar steps (asumiendo 10,000 pasos = 100 puntos)
    const stepsScore = Math.min(100, (activityData.steps / 100) * 10);
    
    // Normalizar minutos activos (asumiendo 60 min = 100 puntos)
    const minutesScore = Math.min(100, (activityData.activeMinutes / 60) * 100);
    
    // Promedio ponderado
    const activityScore = (stepsScore * 0.6) + (minutesScore * 0.4);
    
    return Math.round(activityScore);
};

