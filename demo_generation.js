// 🎨 DEMOSTRACIÓN REAL: Generar foto navideña usando el sistema PetMatch
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuración
const API_URL = 'http://localhost:5000/api';
const IMAGE_PATH = 'C:/Users/roberto27979/.gemini/antigravity/brain/40677739-f9d8-4d18-a871-95a2baddbf68/uploaded_image_1764353886287.jpg';

async function generateChristmasPhoto() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  🎄 PETMATCH AI - GENERACIÓN NAVIDEÑA EN VIVO 🎄      ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
        // 1. Verificar que la imagen existe
        if (!fs.existsSync(IMAGE_PATH)) {
            console.error('❌ Imagen no encontrada:', IMAGE_PATH);
            return;
        }

        console.log('✅ Imagen del Collie encontrada');
        console.log('📸 Preparando generación...\n');

        // 2. Crear FormData con la imagen
        const formData = new FormData();
        formData.append('photo', fs.createReadStream(IMAGE_PATH), {
            filename: 'collie.jpg',
            contentType: 'image/jpeg'
        });

        // 3. Configurar el prompt exacto que pediste
        const options = {
            scenario: 'christmas-forest-sunset',
            style: 'christmas',
            category: 'pet',
            petSpecies: 'dog',
            petBreed: 'Rough Collie',
            quality: '8K',
            prompt: 'A beautiful Rough Collie dog with brown and white fur standing majestically in a snowy Christmas forest at sunset. The scene shows a magical winter wonderland with snow-covered pine trees, gentle snowflakes falling, warm golden sunset light filtering through the trees creating a dreamy atmosphere. The dog is positioned in the foreground looking noble and happy, with its fluffy coat illuminated by the warm sunset glow. Christmas decorations like red ribbons and small ornaments are subtly placed on nearby trees. The background shows a serene snowy forest path disappearing into the distance. Cinematic lighting, professional photography quality, 8K resolution, magical Christmas atmosphere, warm color palette with golden hour lighting contrasting with cool blue snow tones.'
        };

        // Agregar opciones al FormData
        Object.keys(options).forEach(key => {
            formData.append(key, options[key]);
        });

        console.log('🎯 Configuración de generación:');
        console.log('   - Escenario: Bosque nevado al atardecer');
        console.log('   - Estilo: Christmas magical');
        console.log('   - Calidad: 8K');
        console.log('   - Mascota: Rough Collie\n');

        console.log('🚀 Enviando request al backend de PetMatch...');
        console.log('⏳ Esto puede tomar 10-30 segundos...\n');

        // 4. Hacer la llamada al backend (sin auth para demo)
        const startTime = Date.now();

        const response = await axios.post(
            `${API_URL}/photos/generate-demo`, // Endpoint de demo sin auth
            formData,
            {
                headers: {
                    ...formData.getHeaders()
                },
                timeout: 60000, // 60 segundos
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        // 5. Procesar respuesta
        if (response.data.success) {
            console.log('✨ ¡FOTO GENERADA EXITOSAMENTE!\n');
            console.log('═══════════════════════════════════════════════════════');
            console.log('📊 DETALLES DE LA GENERACIÓN:');
            console.log('═══════════════════════════════════════════════════════');
            console.log(`   🤖 Engine usado: ${response.data.engine.toUpperCase()}`);
            console.log(`   📐 Calidad: ${response.data.quality}`);
            console.log(`   💰 Costo: ${response.data.cost ? '$' + response.data.cost : 'GRATIS'}`);
            console.log(`   🎨 Watermark: ${response.data.hasWatermark ? 'Sí (versión FREE)' : 'No (versión PREMIUM)'}`);
            console.log(`   ⏱️  Tiempo: ${duration}s`);
            console.log(`   🆔 Photo ID: ${response.data.photoId}`);
            console.log('═══════════════════════════════════════════════════════\n');

            // 6. Guardar la imagen generada
            if (response.data.imageUrl) {
                let imageBuffer;

                if (response.data.imageUrl.startsWith('data:image')) {
                    // Base64
                    const base64Data = response.data.imageUrl.split(',')[1];
                    imageBuffer = Buffer.from(base64Data, 'base64');
                } else if (response.data.imageUrl.startsWith('http')) {
                    // URL remota
                    const imgResponse = await axios.get(response.data.imageUrl, {
                        responseType: 'arraybuffer'
                    });
                    imageBuffer = Buffer.from(imgResponse.data);
                }

                if (imageBuffer) {
                    const outputPath = path.join(__dirname, 'RESULTADO_COLLIE_NAVIDAD.jpg');
                    fs.writeFileSync(outputPath, imageBuffer);
                    console.log('💾 Imagen guardada en:', outputPath);
                    console.log('📂 Puedes abrirla ahora para ver el resultado\n');
                }
            }

            console.log('🎉 ¡DEMOSTRACIÓN COMPLETADA CON ÉXITO!');
            console.log('🌟 El sistema PetMatch funcionó perfectamente');

            if (response.data.message) {
                console.log(`\n💡 Mensaje: ${response.data.message}`);
            }

        } else {
            console.error('❌ Error en la generación:', response.data.error);
        }

    } catch (error) {
        console.error('\n❌ ERROR EN LA DEMOSTRACIÓN:');

        if (error.response) {
            console.error('   - Status:', error.response.status);
            console.error('   - Error:', error.response.data?.error || error.response.data);

            if (error.response.status === 401) {
                console.log('\n💡 Nota: Necesitas autenticación. Creando endpoint de demo...');
            }
        } else if (error.code === 'ECONNREFUSED') {
            console.error('   - El servidor no está corriendo');
            console.log('\n💡 Solución: Ejecuta "cd server && npm start" en otra terminal');
        } else {
            console.error('   - Error:', error.message);
        }
    }
}

// Ejecutar
generateChristmasPhoto();
