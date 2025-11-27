const PITToken = require('../models/PITToken');

const PetProfile = require('../models/PetProfile');

const crypto = require('crypto'); // Para generar un hash único



// ============================================

// PIT TOKEN CONTROLLER - MÓDULO F (PILAR 7)

// Soft Minting - Acuñación de Token de Identidad de Mascota

// ============================================



/**

 * Acuñar PIT Token (Soft Mint)

 * Solo mascotas verificadas C.I.A. pueden acuñar

 */

exports.mintPITToken = async (req, res) => {

    try {

        const { petId, ownerWalletAddress } = req.body;

        const userId = req.userId;



        // 1. VALIDACIÓN DE BLINDAJE (Pilar 3 Check)

        const pet = await PetProfile.findById(petId);

        if (!pet || pet.owner.toString() !== userId) {

            return res.status(404).json({ error: "Mascota no encontrada o no autorizada." });

        }

        if (!pet.isCiaVerified) {

            return res.status(403).json({ 

                error: "Token: La mascota debe completar la verificación Biométrica C.I.A. antes de acuñar el PIT Token." 

            });

        }



        // 2. Verificar que no existe un token ya acuñado

        const existingToken = await PITToken.findOne({ petId });

        if (existingToken) {

            return res.status(409).json({ error: "Esta mascota ya tiene un PIT Token acuñado." });

        }



        // 3. GENERACIÓN DEL IDENTIFICADOR INMUTABLE (Soft Mint)

        const tokenId = crypto.randomBytes(16).toString('hex').toUpperCase();

        const blockchainAddress = ownerWalletAddress || `0x${crypto.randomBytes(20).toString('hex')}`;



        // 4. Crear PIT Token

        const newPITToken = await PITToken.create({

            petId: petId,

            tokenId: tokenId,

            blockchainAddress: blockchainAddress,

            mintDate: new Date(),

            ownerHistory: [{

                userId: pet.owner,

                startDate: new Date()

            }]

        });



        // 5. Actualizar el perfil de la mascota con el token

        pet.pitTokenId = newPITToken._id;

        await pet.save();



        res.status(201).json({ 

            success: true, 

            message: "PIT Token acuñado (Soft Mint) con éxito.", 

            tokenId: tokenId,

            pitToken: {

                id: newPITToken._id,

                tokenId: newPITToken.tokenId,

                blockchainAddress: newPITToken.blockchainAddress,

                mintDate: newPITToken.mintDate

            }

        });

    } catch (error) {

        console.error("Error en mintPITToken:", error);

        if (error.code === 11000) {

            return res.status(409).json({ error: "Esta mascota ya tiene un PIT Token acuñado." });

        }

        res.status(500).json({ error: "Error al acuñar PIT Token." });

    }

};



/**

 * Obtener información del PIT Token de una mascota

 */

exports.getPITToken = async (req, res) => {

    try {

        const { petId } = req.params;

        const userId = req.userId;



        const pet = await PetProfile.findById(petId);

        if (!pet || pet.owner.toString() !== userId) {

            return res.status(404).json({ error: "Mascota no encontrada." });

        }

        if (!pet.pitTokenId) {

            return res.status(404).json({ error: "Esta mascota no tiene un PIT Token acuñado." });

        }



        const pitToken = await PITToken.findById(pet.pitTokenId)

            .populate('ownerHistory.userId', 'name email');



        res.status(200).json({

            success: true,

            pitToken: {

                id: pitToken._id,

                tokenId: pitToken.tokenId,

                blockchainAddress: pitToken.blockchainAddress,

                mintDate: pitToken.mintDate,

                ownerHistory: pitToken.ownerHistory

            }

        });

    } catch (error) {

        console.error("Error en getPITToken:", error);

        res.status(500).json({ error: "Error al obtener PIT Token." });

    }

};


