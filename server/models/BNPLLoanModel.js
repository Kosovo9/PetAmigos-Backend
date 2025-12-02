const mongoose = require('mongoose');



// ============================================

// BNPL LOAN MODEL - MÓDULO G (PILAR 9)

// Micro-Financiamiento Veterinario (Buy Now, Pay Later)

// ============================================



const BNPLLoanSchema = new mongoose.Schema({

    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true },

    

    // --- FINANCIERO ---

    principal: { type: Number, required: true, comment: "Monto principal del préstamo (costo veterinario)" },

    totalDue: { type: Number, required: true, comment: "Monto total a pagar (principal + interés)" },

    interestRate: { type: Number, required: true, comment: "Tasa de interés (basada en riskScore)" },

    durationMonths: { type: Number, default: 6, comment: "Duración del préstamo en meses" },

    

    // --- ESTADO Y APROBACIÓN ---

    status: { 

        type: String, 

        enum: ['Pending_Vet_Approval', 'Approved', 'Active', 'Paid', 'Default', 'Cancelled'],

        default: 'Pending_Vet_Approval',

        index: true

    },

    vetApprovalDate: Date,

    firstPaymentDate: Date,

    lastPaymentDate: Date,

    

    // --- SEGUIMIENTO ---

    payments: [{

        amount: Number,

        dueDate: Date,

        paidDate: Date,

        status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' }

    }],

    

    // --- METADATA ---

    riskScore: { type: Number, comment: "Score de riesgo calculado (Pilar 1)" },

    vetClinic: String,

    vetCost: Number

    

}, { timestamps: true });



// Índices para consultas eficientes

BNPLLoanSchema.index({ ownerId: 1, status: 1 });

BNPLLoanSchema.index({ petId: 1 });

BNPLLoanSchema.index({ status: 1, createdAt: -1 });



module.exports = mongoose.model('BNPLLoan', BNPLLoanSchema);



