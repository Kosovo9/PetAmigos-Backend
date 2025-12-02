const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');



/**

 * Health Check para Render y monitoreo

 */

router.get('/health', async (req, res) => {

    try {

        // Verificar conexión a MongoDB

        const dbState = mongoose.connection.readyState;

        const dbStatus = dbState === 1 ? 'connected' : 'disconnected';



        res.status(200).json({

            status: 'ok',

            timestamp: new Date().toISOString(),

            database: dbStatus,

            uptime: process.uptime()

        });

    } catch (error) {

        res.status(503).json({

            status: 'error',

            message: error.message

        });

    }

});



module.exports = router;



