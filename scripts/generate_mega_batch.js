require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MegaPromptLibrary = require('../server/models/MegaPromptLibrary');
const { connectWithRetry } = require('../server/config/database');

const generateBatch = async () => {
    console.log('🚀 INICIANDO GENERACIÓN DE BATCH MASIVO...');

    const connected = await connectWithRetry();
    if (!connected) {
        console.error('❌ Error de conexión DB');
        process.exit(1);
    }

    try {
        // 1. Fetch all prompts
        const prompts = await MegaPromptLibrary.find({});
        console.log(`📦 Encontrados ${prompts.length} prompts en la Bóveda.`);

        // 2. Format for Export
        const exportData = prompts.map(p => ({
            id: p._id,
            title: p.title,
            category: p.category,
            tags: p.tags,
            hollywood_prompt: p.promptData.hollywood,
            raw_prompt: p.promptData.raw,
            technical_specs: p.promptData.technical
        }));

        // 3. Write to JSON
        const outputPath = path.join(__dirname, '../mega_prompts_batch.json');
        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

        console.log(`✅ BATCH GENERADO EXITOSAMENTE: ${outputPath}`);
        console.log(`📊 Total Prompts: ${exportData.length}`);
        console.log('💎 Listo para usar en campañas de marketing o automatización.');

    } catch (error) {
        console.error('❌ Error generando batch:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

generateBatch();
