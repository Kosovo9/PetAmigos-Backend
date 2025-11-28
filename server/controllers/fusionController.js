const PetProfile = require('../models/PetProfile');
const User = require('../models/User');

// ============================================
// FUSION CONTROLLER - 10X INTEGRATION
// Módulos: Fly, ESG, Influencers, Love Stories
// ============================================

/**
 * ✈️ PetMatch Fly: Políticas de Aerolíneas
 * Datos en tiempo real (Mock 10x)
 */
exports.getAirlinePolicies = async (req, res) => {
    try {
        // En el futuro, esto podría conectarse a una API real de aerolíneas
        const policies = [
            {
                airline: "Aeroméxico",
                cabinAllowed: true,
                maxWeight: "10kg",
                price: "135 USD",
                requirements: ["Cartilla vacunación", "Certificado sanidad", "Kennel flexible"]
            },
            {
                airline: "Volaris",
                cabinAllowed: true,
                maxWeight: "10kg",
                price: "110 USD",
                requirements: ["Cartilla vacunación", "Kennel 44x30x19cm"]
            },
            {
                airline: "Delta",
                cabinAllowed: true,
                maxWeight: "No limit (must fit)",
                price: "95 USD",
                requirements: ["Health certificate", "Soft-sided carrier"]
            },
            {
                airline: "Iberia",
                cabinAllowed: true,
                maxWeight: "8kg",
                price: "150 EUR",
                requirements: ["Pasaporte europeo", "Microchip"]
            }
        ];

        res.status(200).json({
            success: true,
            data: policies,
            source: "PetMatch Global Database"
        });
    } catch (error) {
        console.error("Error en getAirlinePolicies:", error);
        res.status(500).json({ error: "Error al obtener políticas de vuelo." });
    }
};

/**
 * 🌿 ESG: Calculadora de Huella de Carbono
 */
exports.calculateCarbonFootprint = async (req, res) => {
    try {
        const { petId, foodType, weight, activityLevel } = req.body;

        // Lógica 10x de cálculo (simplificada)
        let baseEmission = 0;
        if (foodType === 'dry') baseEmission = 1.5; // kg CO2e per kg food
        else if (foodType === 'wet') baseEmission = 3.0;
        else if (foodType === 'raw') baseEmission = 5.0;

        const foodConsumption = weight * 0.03 * 365; // 3% body weight daily * year
        const totalEmission = (baseEmission * foodConsumption).toFixed(2);

        const treesToOffset = Math.ceil(totalEmission / 20); // 1 tree ~ 20kg CO2/year

        res.status(200).json({
            success: true,
            petId,
            annualEmission: `${totalEmission} kg CO2e`,
            offsetPlan: {
                treesNeeded: treesToOffset,
                cost: treesToOffset * 5, // $5 per tree
                currency: "USD"
            },
            message: "¡Tu mascota puede ser Carbon Neutral!"
        });
    } catch (error) {
        console.error("Error en calculateCarbonFootprint:", error);
        res.status(500).json({ error: "Error al calcular huella de carbono." });
    }
};

/**
 * 💎 Microinfluencers: Dashboard de Ventas
 */
exports.getInfluencerDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        // Simulación de datos de ventas
        const dashboard = {
            level: "Pet Influencer",
            commissionRate: "20%",
            totalSales: 1540.50,
            earnings: 308.10,
            pendingPayout: 58.10,
            referralCode: "PET-X10-LOVE",
            recentSales: [
                { date: "2023-11-25", item: "Smart Collar", amount: 120.00, commission: 24.00 },
                { date: "2023-11-26", item: "Premium Food", amount: 85.50, commission: 17.10 }
            ]
        };

        res.status(200).json({
            success: true,
            data: dashboard
        });
    } catch (error) {
        console.error("Error en getInfluencerDashboard:", error);
        res.status(500).json({ error: "Error al obtener dashboard." });
    }
};

/**
 * ❤️ Love Stories: Obtener historias
 */
exports.getLoveStories = async (req, res) => {
    try {
        // En producción, esto vendría de una colección 'LoveStories'
        const stories = [
            {
                id: 1,
                title: "El rescate de Luna",
                author: "María G.",
                image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
                likes: 1240,
                preview: "La encontré bajo la lluvia..."
            },
            {
                id: 2,
                title: "Max y su nueva vida",
                author: "Carlos R.",
                image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
                likes: 856,
                preview: "Nadie creía en él, pero nosotros sí..."
            }
        ];

        res.status(200).json({
            success: true,
            data: stories
        });
    } catch (error) {
        console.error("Error en getLoveStories:", error);
        res.status(500).json({ error: "Error al obtener historias." });
    }
};

/**
 * ❤️ Love Stories: Crear historia
 */
exports.createLoveStory = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        // Aquí se guardaría en BD
        res.status(201).json({
            success: true,
            message: "Historia publicada con éxito. ¡Gracias por inspirar!"
        });
    } catch (error) {
        console.error("Error en createLoveStory:", error);
        res.status(500).json({ error: "Error al publicar historia." });
    }
};
