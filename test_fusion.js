const axios = require('axios');

async function testEndpoints() {
    const baseURL = 'http://localhost:5000/api/fusion';
    console.log('🚀 Iniciando Test de Fusión 10x...\n');

    try {
        // 1. Test PetMatch Fly
        console.log('✈️  Probando PetMatch Fly...');
        const flyResponse = await axios.get(`${baseURL}/fly/policies`);
        console.log('✅ Status:', flyResponse.status);
        console.log('📦 Datos:', flyResponse.data.data.length, 'aerolíneas encontradas.');
        console.log('   Ejemplo:', flyResponse.data.data[0].airline, '-', flyResponse.data.data[0].price);
        console.log('-----------------------------------');

        // 2. Test Love Stories
        console.log('❤️  Probando Love Stories...');
        const loveResponse = await axios.get(`${baseURL}/love-stories`);
        console.log('✅ Status:', loveResponse.status);
        console.log('📦 Historias:', loveResponse.data.data.length);
        console.log('   Título:', loveResponse.data.data[0].title);
        console.log('-----------------------------------');

        console.log('🎉 ¡TODOS LOS SISTEMAS OPERATIVOS!');

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        if (error.response) {
            console.error('   Detalle:', error.response.data);
        }
    }
}

testEndpoints();
