const BNPLLoan = require('../models/BNPLLoanModel');

const PetProfile = require('../models/PetProfile');



// ============================================

// FINTECH CONTROLLER - MÓDULO G (PILAR 9)

// Micro-Financiamiento Veterinario (BNPL)

// ============================================



/**

 * Aplicar para préstamo BNPL (Buy Now, Pay Later)

 * Anclaje de confianza 10X: Requiere verificación C.I.A. y PIT Token

 */

exports.applyForBNPLLoan = async (req, res) => {

    try {

        const { petId, vetCost, durationMonths = 6, vetClinic } = req.body;

        const ownerId = req.userId;



        // 1. ANCLAJE DE CONFIANZA 10X (Pilar 7 & 3)

        const pet = await PetProfile.findById(petId).select('isCiaVerified pitTokenId biologicalAge dateOfBirth');

        if (!pet || pet.owner.toString() !== ownerId) {

            return res.status(404).json({ error: "Mascota no encontrada o no autorizada." });

        }

        if (!pet.isCiaVerified || !pet.pitTokenId) {

            // Rechazo 10X: La mascota debe estar blindada para calificar

            return res.status(403).json({ 

                error: "Préstamo denegado: Se requiere Verificación Biométrica C.I.A. y PIT Token activo.",

                requirements: {

                    isCiaVerified: pet.isCiaVerified || false,

                    hasPITToken: !!pet.pitTokenId

                }

            });

        }



        // 2. EVALUACIÓN DE RIESGO BÁSICA (Pilar 1)

        // Calcular edad cronológica

        const chronologicalAge = calculateChronologicalAge(pet.dateOfBirth);

        // El riesgo aumenta si la biologicalAge es mucho mayor que la edad cronológica

        const riskScore = pet.biologicalAge > chronologicalAge * 1.3 ? 0.15 : 0.08; 

        

        // 3. CÁLCULO DE INTERÉS Y COMISIÓN (Alto Margen)

        const interestRate = riskScore; 

        const totalAmountDue = vetCost * (1 + interestRate);

        const monthlyPayment = totalAmountDue / durationMonths;



        // 4. CREACIÓN DEL PRÉSTAMO (AVT - Alto Valor Transaccional)

        const newLoan = await BNPLLoan.create({

            ownerId,

            petId: pet._id,

            principal: vetCost,

            totalDue: totalAmountDue,

            interestRate: interestRate,

            durationMonths,

            status: 'Pending_Vet_Approval',

            riskScore,

            vetClinic,

            vetCost,

            payments: generatePaymentSchedule(totalAmountDue, durationMonths)

        });



        res.status(201).json({ 

            success: true, 

            message: "Solicitud de Micro-Financiamiento creada. Tasa de interés ajustada por Riesgo Predictivo.", 

            loan: {

                id: newLoan._id,

                principal: newLoan.principal,

                totalDue: newLoan.totalDue,

                interestRate: newLoan.interestRate,

                monthlyPayment: monthlyPayment.toFixed(2),

                durationMonths: newLoan.durationMonths,

                status: newLoan.status

            }

        });

    } catch (error) {

        console.error("Error en applyForBNPLLoan:", error);

        res.status(500).json({ error: "Error al procesar solicitud de préstamo." });

    }

};



/**

 * Generar calendario de pagos

 */

function generatePaymentSchedule(totalAmount, months) {

    const monthlyPayment = totalAmount / months;

    const payments = [];

    const today = new Date();

    

    for (let i = 1; i <= months; i++) {

        const dueDate = new Date(today);

        dueDate.setMonth(dueDate.getMonth() + i);

        

        payments.push({

            amount: monthlyPayment,

            dueDate,

            status: 'Pending'

        });

    }

    

    return payments;

}



/**

 * Calcular edad cronológica

 */

function calculateChronologicalAge(dateOfBirth) {

    if (!dateOfBirth) return 0;

    const birthDate = new Date(dateOfBirth);

    const today = new Date();

    const diffTime = Math.abs(today - birthDate);

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays / 365.25;

}



/**

 * Obtener préstamos del usuario

 */

exports.getUserLoans = async (req, res) => {

    try {

        const ownerId = req.userId;

        const loans = await BNPLLoan.find({ ownerId })

            .populate('petId', 'name breed')

            .sort({ createdAt: -1 });



        res.status(200).json({

            success: true,

            loans

        });

    } catch (error) {

        console.error("Error en getUserLoans:", error);

        res.status(500).json({ error: "Error al obtener préstamos." });

    }

};



