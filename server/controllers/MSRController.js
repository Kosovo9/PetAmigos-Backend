const Transaction = require('../models/Transaction');

const PetProfile = require('../models/PetProfile');

const BNPLLoan = require('../models/BNPLLoanModel');

const ConversionLog = require('../models/ConversionLog');



// ============================================

// MSR CONTROLLER - PROTOCOLO DE REVISIÓN ESTRATÉGICA MENSUAL

// Análisis de eficiencia del 40% y aceleración de valoración

// ============================================



/**

 * Generar Reporte Estratégico Mensual (MSR)

 */

exports.generateMonthlyReport = async (req, res) => {

    try {

        const { month, year } = req.query;

        const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);

        const endDate = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 0);



        // 1. Cash Harvest / Recurrente

        const lifetimeMemberships = await Transaction.find({

            type: 'SUBSCRIPTION',

            metadata: { serviceType: 'LIFETIME_MEMBERSHIP' },

            createdAt: { $gte: startDate, $lte: endDate }

        });



        const totalLifetimeRevenue = lifetimeMemberships.reduce((sum, t) => sum + t.amount, 0);

        const lifetimeConversions = lifetimeMemberships.length;

        

        // Calcular Churn Rate (simplificado)

        const activeLifetime = await PetProfile.countDocuments({ isLifetimeMember: true });

        const churnRate = 0; // Calcular basado en cancelaciones



        // 2. Transaccional / Sentry AI

        const serviceTransactions = await Transaction.find({

            type: 'SERVICE_FEE',

            createdAt: { $gte: startDate, $lte: endDate }

        });



        const totalServiceRevenue = serviceTransactions.reduce((sum, t) => sum + (t.metadata?.platformProfit || 0), 0);

        const avgMoodScore = await PetProfile.aggregate([

            { $group: { _id: null, avgMood: { $avg: '$moodScore' } } }

        ]);



        // 3. Alto Valor (FinTech / Legal)

        const bnplLoans = await BNPLLoan.find({

            createdAt: { $gte: startDate, $lte: endDate }

        });



        const totalBNPLValue = bnplLoans.reduce((sum, l) => sum + l.principal, 0);

        const wagWillCount = await Transaction.countDocuments({

            type: 'HIGH_VALUE',

            metadata: { serviceType: 'WILL' },

            createdAt: { $gte: startDate, $lte: endDate }

        });



        // 4. Calcular KPIs

        const report = {

            period: { startDate, endDate },

            cashHarvest: {

                lifetimeRevenue: totalLifetimeRevenue,

                lifetimeConversions,

                churnRate: `${churnRate}%`,

                activeLifetimeMembers: activeLifetime,

                conversionRate: lifetimeConversions > 0 ? '5%+' : '0%' // Simplificado

            },

            transactional: {

                serviceRevenue: totalServiceRevenue,

                serviceTransactions: serviceTransactions.length,

                avgMoodScore: avgMoodScore[0]?.avgMood || 0,

                optimalThreshold: 32 // Basado en optimización

            },

            highValue: {

                bnplLoans: bnplLoans.length,

                totalBNPLValue,

                wagWillCount,

                avgTransactionValue: totalBNPLValue / (bnplLoans.length || 1)

            },

            recommendations: generateRecommendations({

                churnRate,

                avgMoodScore: avgMoodScore[0]?.avgMood || 50,

                lifetimeConversions

            })

        };



        res.status(200).json({

            success: true,

            report

        });

    } catch (error) {

        console.error("Error en generateMonthlyReport:", error);

        res.status(500).json({ error: "Error al generar reporte mensual." });

    }

};



function generateRecommendations(data) {

    const recommendations = [];



    if (data.churnRate > 5) {

        recommendations.push({

            priority: 'HIGH',

            action: 'Activar Retención Predictiva Automática para usuarios en riesgo',

            impact: 'Reducir Churn Rate a < 3%'

        });

    }

    if (data.avgMoodScore < 40) {

        recommendations.push({

            priority: 'MEDIUM',

            action: 'Ajustar umbral de Sentry AI para capturar más ansiedad',

            impact: 'Aumentar conversión de servicios'

        });

    }

    if (data.lifetimeConversions < 100) {

        recommendations.push({

            priority: 'HIGH',

            action: 'Ejecutar A/B Testing en Landing Page de Lifetime',

            impact: 'Aumentar CR a > 5%'

        });

    }

    return recommendations;

}


