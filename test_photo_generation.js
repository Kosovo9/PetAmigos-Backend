// 🎨 TEST: Generar foto navideña del Collie usando el sistema real de PetMatch
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testPhotoGeneration() {
    try {
        console.log('🎄 Iniciando generación de foto navideña...\n');

        // 1. Preparar la imagen del Collie
        const imagePath = 'C:/Users/roberto27979/.gemini/antigravity/brain/40677739-f9d8-4d18-a871-95a2baddbf68/uploaded_image_1764353886287.jpg';

        if (!fs.existsSync(imagePath)) {
            console.error('❌ Imagen no encontrada en:', imagePath);
            return;
        }

        // 2. Crear FormData con la imagen
        const formData = new FormData();
        formData.append('photo', fs.createReadStream(imagePath));

        // 3. Configurar opciones de generación (mismo prompt que pediste)
        const options = {
            scenario: 'christmas-forest-sunset',
            style: 'christmas',
            category: 'pet',
            prompt: 'A beautiful Rough Collie dog with brown and white fur standing majestically in a snowy Christmas forest at sunset. The scene shows a magical winter wonderland with snow-covered pine trees, gentle snowflakes falling, warm golden sunset light filtering through the trees creating a dreamy atmosphere. The dog is positioned in the foreground looking noble and happy, with its fluffy coat illuminated by the warm sunset glow. Christmas decorations like red ribbons and small ornaments are subtly placed on nearby trees. The background shows a serene snowy forest path disappearing into the distance.',
            quality: '8K',
            petSpecies: 'dog',
            petBreed: 'Rough Collie'
        };

        // Agregar opciones al FormData
        Object.keys(options).forEach(key => {
            formData.append(key, options[key]);
        });

        console.log('📤 Enviando request al backend de PetMatch...');
        console.log('🎯 Endpoint: http://localhost:5000/api/photos/generate');
        console.log('🎨 Engine: Multi-engine (Google AI → Higgsfield → Hugging Face)\n');

        // 4. Hacer la llamada al backend real
        const response = await axios.post(
            'http://localhost:5000/api/photos/generate',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`
                },
                timeout: 60000 // 60 segundos para generación
            }
        );

        // 5. Procesar respuesta
        if (response.data.success) {
            console.log('✅ ¡FOTO GENERADA EXITOSAMENTE!\n');
            console.log('📊 Detalles de la generación:');
            console.log('   - Engine usado:', response.data.engine);
            console.log('   - Calidad:', response.data.quality);
            console.log('   - Costo:', response.data.cost ? `$${response.data.cost}` : 'GRATIS');
            console.log('   - Tiene watermark:', response.data.hasWatermark ? 'Sí' : 'No');
            console.log('   - Créditos restantes:', response.data.creditsRemaining);
            console.log('   - URL de imagen:', response.data.imageUrl.substring(0, 100) + '...');
            console.log('   - Photo ID:', response.data.photoId);

            if (response.data.message) {
                console.log('   - Mensaje:', response.data.message);
            }

            // 6. Guardar la imagen generada localmente
            if (response.data.imageUrl.startsWith('data:image')) {
                const base64Data = response.data.imageUrl.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const outputPath = path.join(__dirname, 'generated_collie_christmas.jpg');
                fs.writeFileSync(outputPath, buffer);
                console.log('\n💾 Imagen guardada en:', outputPath);
            }

            console.log('\n🎉 ¡Proceso completado! La magia de PetMatch funcionó perfectamente.');

        } else {
            console.error('❌ Error en la generación:', response.data.error);
        }

    } catch (error) {
        console.error('\n❌ ERROR EN EL TEST:');

        if (error.response) {
            console.error('   - Status:', error.response.status);
            console.error('   - Error:', error.response.data);
        } else if (error.request) {
            console.error('   - No se recibió respuesta del servidor');
            console.error('   - ¿Está el backend corriendo en http://localhost:5000?');
        } else {
            console.error('   - Error:', error.message);
        }

        console.log('\n💡 Sugerencias:');
        console.log('   1. Asegúrate de que el backend esté corriendo: cd server && npm start');
        console.log('   2. Verifica que tengas las API keys configuradas en .env');
        console.log('   3. Crea un usuario de prueba y obtén un token válido');
    }
}

// Ejecutar el test
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║  🎄 PETMATCH AI - TEST DE GENERACIÓN NAVIDEÑA 🎄      ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

testPhotoGeneration();
