const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 📂 CONFIGURACIÓN
const OUTPUT_DIR = path.join(__dirname, 'COLLIE_BATCH_OUTPUT');
const API_URL = 'http://localhost:5000/api/photos/generate-demo';

// Asegurar que existe el directorio
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// 🎨 20 PROMPTS MAESTROS HIPER-REALISTAS (ROUGH COLLIE)
const scenarios = [
    "Hyper-realistic Rough Collie running in a snowy forest at golden hour, 8k resolution, cinematic lighting",
    "Close-up portrait of a Rough Collie with snowflakes on nose, macro photography, depth of field, 8k",
    "Rough Collie sitting by a cozy Christmas fireplace, warm lighting, holiday atmosphere, photorealistic",
    "Rough Collie playing in autumn leaves, dynamic action shot, motion blur, sharp focus on eyes, 8k",
    "Majestic Rough Collie standing on a mountain peak, wind blowing through fur, epic landscape, wide angle",
    "Rough Collie sleeping on a Persian rug, soft morning light, cozy atmosphere, highly detailed texture",
    "Rough Collie running on a sandy beach at sunset, reflection in water, wet fur texture, 8k",
    "Studio portrait of a Rough Collie, rembrandt lighting, black background, noble expression, 8k",
    "Rough Collie in a field of lavender, soft focus background, vibrant colors, sunny day",
    "Rough Collie wearing a Santa hat, cute expression, bokeh Christmas lights background, 8k",
    "Rough Collie catching a frisbee mid-air, frozen motion, muscular definition, sharp focus",
    "Rough Collie looking out a rainy window, melancholic mood, raindrops on glass, cinematic",
    "Rough Collie in a futuristic neon city, cyberpunk style, blue and pink lighting, reflection in puddles",
    "Rough Collie puppy playing with a red ball, grass texture, soft natural lighting, 8k",
    "Rough Collie hiking in a green forest, dappled sunlight, nature photography, detailed fur",
    "Rough Collie with a butterfly on its nose, whimsical, macro, soft pastel colors",
    "Rough Collie in a pumpkin patch, autumn colors, orange and green contrast, detailed",
    "Rough Collie shaking off water, droplets flying, frozen action, backlight, high contrast",
    "Rough Collie family (mother and puppies), studio setting, softbox lighting, adorable",
    "Rough Collie in a flower crown, spring meadow, ethereal lighting, dreamlike quality, 8k"
];

// 🚀 FUNCIÓN DE GENERACIÓN
async function generateBatch() {
    console.log('🚀 INICIANDO GENERACIÓN MASIVA: 20 FOTOS DE COLLIE (MODO ANTI-FALLOS)');
    console.log(`📂 Carpeta de destino: ${OUTPUT_DIR}\n`);

    for (let i = 0; i < scenarios.length; i++) {
        const prompt = scenarios[i];
        console.log(`\n[${i + 1}/20] 🎨 Generando: "${prompt.substring(0, 50)}..."`);

        try {
            const response = await axios.post(API_URL, {
                prompt: prompt,
                petSpecies: 'Rough Collie',
                scenario: 'Custom',
                style: 'Cinematic',
                quality: '8K'
            });

            if (response.data.success) {
                const base64Data = response.data.imageUrl.replace(/^data:image\/\w+;base64,/, "");
                const buffer = Buffer.from(base64Data, 'base64');
                const filename = `collie_${i + 1}_${Date.now()}.jpg`;
                const filepath = path.join(OUTPUT_DIR, filename);

                fs.writeFileSync(filepath, buffer);
                console.log(`✅ Guardada: ${filename}`);
                console.log(`   ℹ️ Engine: ${response.data.engine} | Quality: ${response.data.quality}`);
            } else {
                console.error(`❌ Falló la generación ${i + 1}`);
            }

        } catch (error) {
            console.error(`❌ Error en foto ${i + 1}:`, error.message);
            if (error.response) {
                console.error('   Detalles:', error.response.data);
            }
        }

        // Pausa para evitar rate limiting (Anti-Spam Protection)
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('\n✨ ¡LOTE COMPLETADO! Revisa la carpeta COLLIE_BATCH_OUTPUT');
}

// Ejecutar
generateBatch();
