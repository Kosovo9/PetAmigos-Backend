const GovernanceToken = require('../models/GovernanceToken');

const Vote = require('../models/Vote');

const PetProfile = require('../models/PetProfile');



// ============================================

// DAO CONTROLLER - PILAR J3

// DAO y Tokenización de la Comunidad

// Defensibilidad 15x - Lock-in Final

// ============================================



/**

 * Acuñar token de gobernanza vinculado al PIT Token

 * Recompensa a usuarios del Mini FB (engagement)

 */

exports.mintGovernanceToken = async (req, res) => {

    try {

        const { petId, engagementScore } = req.body;

        const userId = req.userId;



        // 1. Validar que la mascota tiene PIT Token

        const pet = await PetProfile.findById(petId);

        if (!pet || pet.owner.toString() !== userId || !pet.pitTokenId) {

            return res.status(403).json({ 

                error: "Se requiere PIT Token activo para obtener tokens de gobernanza." 

            });

        }



        // 2. Calcular cantidad de tokens basada en engagement

        const baseTokens = 100;

        const engagementMultiplier = Math.min(engagementScore / 100, 5); // Máximo 5x

        const tokenAmount = Math.floor(baseTokens * engagementMultiplier);



        // 3. Crear o actualizar token de gobernanza

        let governanceToken = await GovernanceToken.findOne({ userId, petId });

        

        if (governanceToken) {

            governanceToken.balance += tokenAmount;

            governanceToken.lastMint = new Date();

        } else {

            governanceToken = await GovernanceToken.create({

                userId,

                petId,

                pitTokenId: pet.pitTokenId,

                balance: tokenAmount,

                lastMint: new Date()

            });

        }

        await governanceToken.save();



        res.status(200).json({

            success: true,

            message: "Tokens de gobernanza acuñados.",

            tokens: {

                balance: governanceToken.balance,

                minted: tokenAmount,

                pitTokenId: pet.pitTokenId

            }

        });

    } catch (error) {

        console.error("Error en mintGovernanceToken:", error);

        res.status(500).json({ error: "Error al acuñar tokens de gobernanza." });

    }

};



/**

 * Votar sobre nuevas características (DAO)

 */

exports.vote = async (req, res) => {

    try {

        const { proposalId, voteOption, tokenAmount } = req.body;

        const userId = req.userId;



        // 1. Verificar balance de tokens

        const governanceToken = await GovernanceToken.findOne({ userId });

        if (!governanceToken || governanceToken.balance < tokenAmount) {

            return res.status(403).json({ 

                error: "Tokens insuficientes para votar." 

            });

        }



        // 2. Registrar voto

        const vote = await Vote.create({

            userId,

            proposalId,

            voteOption, // 'YES', 'NO', 'ABSTAIN'

            tokenWeight: tokenAmount,

            timestamp: new Date()

        });



        // 3. Descontar tokens usados (opcional, o mantener para votos futuros)

        // governanceToken.balance -= tokenAmount;

        // await governanceToken.save();



        res.status(200).json({

            success: true,

            message: "Voto registrado exitosamente.",

            vote: {

                id: vote._id,

                proposalId: vote.proposalId,

                voteOption: vote.voteOption,

                tokenWeight: vote.tokenWeight

            }

        });

    } catch (error) {

        console.error("Error en vote:", error);

        res.status(500).json({ error: "Error al registrar voto." });

    }

};



/**

 * Obtener resultados de una propuesta

 */

exports.getProposalResults = async (req, res) => {

    try {

        const { proposalId } = req.params;

        const votes = await Vote.find({ proposalId });

        

        const results = votes.reduce((acc, vote) => {

            if (!acc[vote.voteOption]) {

                acc[vote.voteOption] = { count: 0, totalWeight: 0 };

            }

            acc[vote.voteOption].count += 1;

            acc[vote.voteOption].totalWeight += vote.tokenWeight;

            return acc;

        }, {});



        res.status(200).json({

            success: true,

            proposalId,

            results,

            totalVotes: votes.length

        });

    } catch (error) {

        console.error("Error en getProposalResults:", error);

        res.status(500).json({ error: "Error al obtener resultados." });

    }

};


