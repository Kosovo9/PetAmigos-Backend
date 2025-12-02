const ConversionLog = require('../models/ConversionLog');



// ============================================

// A/B TESTING CONTROLLER - OPTIMIZACIÓN POST-LANZAMIENTO

// Protocolo de optimización del Cash Harvest

// ============================================



/**

 * Registrar conversión para A/B Testing

 */

exports.logConversion = async (req, res) => {

    try {

        const { userId, testId, variant, conversionType, amount } = req.body;

        const conversion = await ConversionLog.create({

            userId,

            testId,

            variant, // 'A' o 'B'

            conversionType, // 'lifetime_membership', 'bnpl_loan', etc.

            amount,

            timestamp: new Date()

        });

        res.status(200).json({ success: true, conversion });

    } catch (error) {

        console.error("Error en logConversion:", error);

        res.status(500).json({ error: "Error al registrar conversión." });

    }

};



/**

 * Obtener resultados de A/B Test

 */

exports.getABTestResults = async (req, res) => {

    try {

        const { testId } = req.params;

        const conversions = await ConversionLog.find({ testId });

        

        const variantA = conversions.filter(c => c.variant === 'A');

        const variantB = conversions.filter(c => c.variant === 'B');

        

        const crA = variantA.length > 0 ? (variantA.length / (variantA.length + variantB.length)) * 100 : 0;

        const crB = variantB.length > 0 ? (variantB.length / (variantA.length + variantB.length)) * 100 : 0;

        

        const revenueA = variantA.reduce((sum, c) => sum + (c.amount || 0), 0);

        const revenueB = variantB.reduce((sum, c) => sum + (c.amount || 0), 0);

        

        res.status(200).json({

            success: true,

            testId,

            results: {

                variantA: {

                    conversions: variantA.length,

                    conversionRate: crA.toFixed(2) + '%',

                    revenue: revenueA

                },

                variantB: {

                    conversions: variantB.length,

                    conversionRate: crB.toFixed(2) + '%',

                    revenue: revenueB

                },

                winner: crB > crA ? 'B' : 'A',

                recommendation: crB > crA && crB > 5 ? 'Implementar Variante B' : 'Continuar con Variante A'

            }

        });

    } catch (error) {

        console.error("Error en getABTestResults:", error);

        res.status(500).json({ error: "Error al obtener resultados." });

    }

};



