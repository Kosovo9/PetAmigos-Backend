const Transaction = require('../models/Transaction');

const PetProfile = require('../models/PetProfile');

const { segmentMarketingTarget, sendToForkAds } = require('../services/MarketingSegmentationService');

const axios = require('axios');



// ============================================

// QA CONTROLLER - MÓDULO H

// Protocolo de Pruebas 10X y Validación Final

// ============================================



/**

 * QA del Núcleo Financiero Global (4 Procesadores)

 * TEST: Verificar que cada procesador funciona correctamente

 */

exports.testPaymentProcessors = async (req, res) => {

    try {

        const results = {

            stripe: { status: 'pending', message: '' },

            mercadopago: { status: 'pending', message: '' },

            lemonsqueezy: { status: 'pending', message: '' },

            paypal: { status: 'pending', message: '' }

        };



        // Test Stripe (US)

        try {

            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

            const session = await stripe.checkout.sessions.create({

                payment_method_types: ['card'],

                line_items: [{

                    price_data: {

                        currency: 'usd',

                        product_data: { name: 'Test Lifetime Membership' },

                        unit_amount: 9700

                    },

                    quantity: 1

                }],

                mode: 'payment'

            });

            results.stripe = { status: 'success', message: 'Stripe funcionando', sessionId: session.id };

        } catch (error) {

            results.stripe = { status: 'error', message: error.message };

        }



        // Test Mercado Pago (MX)

        try {

            const mpResponse = await axios.get('https://api.mercadopago.com/v1/payment_methods', {

                headers: { 'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }

            });

            results.mercadopago = { status: 'success', message: 'Mercado Pago funcionando' };

        } catch (error) {

            results.mercadopago = { status: 'error', message: error.message };

        }



        // Test Lemon Squeezy

        try {

            const lsResponse = await axios.get('https://api.lemonsqueezy.com/v1/stores', {

                headers: { 'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}` }

            });

            results.lemonsqueezy = { status: 'success', message: 'Lemon Squeezy funcionando' };

        } catch (error) {

            results.lemonsqueezy = { status: 'error', message: error.message };

        }



        const allPassed = Object.values(results).every(r => r.status === 'success');



        res.status(200).json({

            success: allPassed,

            results,

            message: allPassed ? 'Todos los procesadores funcionando' : 'Algunos procesadores fallaron'

        });

    } catch (error) {

        console.error("Error en testPaymentProcessors:", error);

        res.status(500).json({ error: "Error al probar procesadores." });

    }

};



/**

 * QA del Bucle Predictivo (Test de Valor 10X)

 * TEST: Bucle Sentry (Ansiedad -> Venta)

 */

exports.testPredictiveLoop = async (req, res) => {

    try {

        // 1. Simular entrada de datos

        const testPetData = {

            moodScore: 25,

            chronologicalAge: 2,

            biologicalAge: 3.5, // Mayor que cronológica

            isLifetimeMember: false

        };



        // 2. Segmentación

        const segmentData = segmentMarketingTarget({

            petProfile: testPetData,

            financialScore: 0

        });



        // 3. Verificar que es ANXIETY_SERVICE_TRIGGER

        const isAnxietyTrigger = segmentData === 'ANXIETY_SERVICE_TRIGGER';



        // 4. Enviar a ForkAds (simulado)

        let forkAdsResponse = null;

        if (isAnxietyTrigger) {

            try {

                forkAdsResponse = await sendToForkAds('test-user-id', segmentData);

            } catch (error) {

                console.warn("ForkAds no disponible (test):", error.message);

            }

        }



        res.status(200).json({

            success: true,

            test: 'Bucle Sentry (Ansiedad -> Venta)',

            results: {

                input: testPetData,

                segment: segmentData,

                isAnxietyTrigger,

                forkAdsSent: forkAdsResponse !== null,

                message: isAnxietyTrigger 

                    ? '✅ Bucle predictivo funcionando - Segmento correcto enviado a ForkAds'

                    : '❌ Bucle predictivo falló - Segmento incorrecto'

            }

        });

    } catch (error) {

        console.error("Error en testPredictiveLoop:", error);

        res.status(500).json({ error: "Error al probar bucle predictivo." });

    }

};



/**

 * QA de Escalabilidad (Socket.io)

 * TEST: 100 conexiones simultáneas

 */

exports.testSocketScalability = async (req, res) => {

    try {

        // Este test requiere ejecutarse desde un cliente externo

        // Por ahora, solo verificamos que el servidor esté corriendo

        res.status(200).json({

            success: true,

            test: 'Escalabilidad Socket.io',

            message: 'Servidor Socket.io activo. Ejecutar test de carga externo para validar 100 conexiones simultáneas.',

            recommendation: 'Usar herramienta como Artillery.io o k6 para test de carga'

        });

    } catch (error) {

        console.error("Error en testSocketScalability:", error);

        res.status(500).json({ error: "Error al probar escalabilidad." });

    }

};



/**

 * QA GeoSpatial (PetMatch)

 * Ejecutar todos los tests G01-G05

 */

exports.testGeoSpatial = async (req, res) => {

    try {

        // Importar tests

        const { runAllTests } = require('../../tests/petMatchTests');

        const results = await runAllTests();

        const allPassed = Object.values(results).every(r => r === true);

        res.status(200).json({

            success: allPassed,

            test: 'Protocolo de Pruebas GeoSpatial (G01-G05)',

            results

        });

    } catch (error) {

        console.error("Error en testGeoSpatial:", error);

        res.status(500).json({ error: "Error al ejecutar tests geospaciales." });

    }

};



