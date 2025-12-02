const Transaction = require('../models/Transaction');



// ============================================

// GEO SOCKET SERVICE - PILAR 4

// Servicios Transaccionales y Logística Real-Time 3.0

// ============================================



/**

 * Configuración de Socket.io para ubicación en tiempo real y pagos rápidos

 * Engagement Nivel Dios - Grado Uber

 */

const setupGeoSocketService = (io) => {

    // Variable de configuración: Comisión del 20% + tarifa de emergencia

    const COMMISSION_RATE = 0.20; // 20% de comisión

    const AMBER_ALERT_FEE = 29.00; // USD por Alerta Amber



    io.on('connection', (socket) => {

        console.log(`🔌 Geo Socket conectado: ${socket.id}`);



        // 1. Lógica de Ubicación en Tiempo Real

        socket.on('walkerLocationUpdate', (data) => {

            const { ownerId, coords, walkerId } = data;

            

            // Transmite la nueva ubicación a la interfaz del dueño

            io.to(`owner-${ownerId}`).emit('petLocation', {

                coords,

                walkerId,

                timestamp: new Date()

            });

        });



        // 2. Pago Rápido (Función de Alto Margen)

        socket.on('serviceCompleted', async (data) => {

            try {

                const { petId, serviceCost, serviceType, ownerId } = data;

                const totalAmount = parseFloat(serviceCost);

                const platformCut = totalAmount * COMMISSION_RATE;



                // Registra la transacción de alta comisión

                const transaction = await Transaction.create({

                    userId: ownerId,

                    type: 'SERVICE_FEE',

                    amount: totalAmount,

                    status: 'COMPLETED',

                    metadata: {

                        serviceId: data.serviceId,

                        serviceType: serviceType || 'Walker',

                        platformProfit: platformCut,

                        description: `Servicio ${serviceType} completado`

                    },

                    processedAt: new Date()

                });



                // Notificación de pago confirmado

                io.to(socket.id).emit('paymentConfirmed', { 

                    success: true,

                    transactionId: transaction._id,

                    profit: platformCut,

                    totalAmount

                });



                // Notificar al dueño

                io.to(`owner-${ownerId}`).emit('servicePaid', {

                    amount: totalAmount,

                    serviceType

                });



            } catch (error) {

                console.error("Error en serviceCompleted:", error);

                socket.emit('paymentError', { error: "Error al procesar pago." });

            }

        });



        // 3. Alerta Amber (Transaccional de Emergencia)

        socket.on('triggerAmberAlert', async (data) => {

            try {

                const { petId, ownerId, location } = data;

                

                // Registrar transacción de Alerta Amber

                await Transaction.create({

                    userId: ownerId,

                    type: 'SERVICE_FEE',

                    amount: AMBER_ALERT_FEE,

                    status: 'COMPLETED',

                    metadata: {

                        serviceType: 'AMBER_ALERT',

                        description: 'Alerta Amber activada - Notificación a 5,000 vecinos en 5km',

                        location

                    },

                    processedAt: new Date()

                });



                // Broadcast de alerta a todos los usuarios cercanos

                io.emit('amberAlert', {

                    petId,

                    location,

                    timestamp: new Date(),

                    message: "ALERTA AMBER ACTIVADA - Mascota perdida"

                });



                socket.emit('amberAlertConfirmed', {

                    success: true,

                    fee: AMBER_ALERT_FEE

                });



            } catch (error) {

                console.error("Error en triggerAmberAlert:", error);

                socket.emit('amberAlertError', { error: "Error al activar Alerta Amber." });

            }

        });



        // 4. Unirse a room del dueño para recibir actualizaciones

        socket.on('joinOwnerRoom', (ownerId) => {

            socket.join(`owner-${ownerId}`);

            console.log(`👤 Owner ${ownerId} conectado a room`);

        });



        socket.on('disconnect', () => {

            console.log(`🔌 Geo Socket desconectado: ${socket.id}`);

        });

    });



    return io;

};



module.exports = setupGeoSocketService;



