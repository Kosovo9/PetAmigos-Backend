// ============================================
// PRUEBAS DE ESTRÉS - ESCALABILIDAD 10X
// Simulación de 10,000 conexiones simultáneas
// ============================================

const io = require('socket.io-client');



// Configuración

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

const TOTAL_CONNECTIONS = 10000;

const CONNECTIONS_PER_BATCH = 100;

const BATCH_DELAY = 100; // ms entre lotes



// Métricas

let connectedSockets = [];

let failedConnections = 0;

let messageLatencies = [];

let startTime = Date.now();



// Función para crear conexión Socket.io

function createConnection(id) {

    return new Promise((resolve, reject) => {

        const socket = io(SERVER_URL, {

            transports: ['websocket'],

            reconnection: false,

            timeout: 5000

        });



        const connectionStart = Date.now();



        socket.on('connect', () => {

            const latency = Date.now() - connectionStart;

            connectedSockets.push({ id, socket, latency });

            resolve(socket);

        });



        socket.on('connect_error', (error) => {

            failedConnections++;

            reject(error);

        });



        socket.on('disconnect', () => {

            console.log(`Socket ${id} desconectado`);

        });



        // Test de latencia de mensajes

        socket.on('pong', (timestamp) => {

            const latency = Date.now() - timestamp;

            messageLatencies.push(latency);

        });

    });

}



// Función para enviar mensajes de prueba

async function sendTestMessages(socket, count = 10) {

    for (let i = 0; i < count; i++) {

        const timestamp = Date.now();

        socket.emit('ping', timestamp);

        await new Promise(resolve => setTimeout(resolve, 100));

    }

}



// Función principal de prueba de estrés

async function runStressTest() {

    console.log('🧪 Iniciando Prueba de Estrés Socket.io...\n');

    console.log(`Objetivo: ${TOTAL_CONNECTIONS} conexiones simultáneas\n`);



    // Crear conexiones en lotes

    for (let i = 0; i < TOTAL_CONNECTIONS; i += CONNECTIONS_PER_BATCH) {

        const batch = [];

        for (let j = 0; j < CONNECTIONS_PER_BATCH && (i + j) < TOTAL_CONNECTIONS; j++) {

            batch.push(createConnection(i + j));

        }

        await Promise.allSettled(batch);

        console.log(`✅ Lote ${Math.floor(i / CONNECTIONS_PER_BATCH) + 1}: ${connectedSockets.length} conexiones activas`);

        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));

    }



    const totalTime = Date.now() - startTime;

    const successRate = (connectedSockets.length / TOTAL_CONNECTIONS) * 100;



    console.log('\n📊 RESULTADOS DE LA PRUEBA DE ESTRÉS:\n');

    console.log(`Conexiones Exitosas: ${connectedSockets.length}/${TOTAL_CONNECTIONS}`);

    console.log(`Tasa de Éxito: ${successRate.toFixed(2)}%`);

    console.log(`Conexiones Fallidas: ${failedConnections}`);

    console.log(`Tiempo Total: ${(totalTime / 1000).toFixed(2)}s`);

    console.log(`Conexiones/segundo: ${(connectedSockets.length / (totalTime / 1000)).toFixed(2)}`);



    // Estadísticas de latencia

    if (connectedSockets.length > 0) {

        const avgLatency = connectedSockets.reduce((sum, s) => sum + s.latency, 0) / connectedSockets.length;

        const maxLatency = Math.max(...connectedSockets.map(s => s.latency));

        const minLatency = Math.min(...connectedSockets.map(s => s.latency));



        console.log('\n📈 LATENCIA DE CONEXIÓN:');

        console.log(`Promedio: ${avgLatency.toFixed(2)}ms`);

        console.log(`Máxima: ${maxLatency}ms`);

        console.log(`Mínima: ${minLatency}ms`);

    }



    // Test de mensajes

    if (messageLatencies.length > 0) {

        const avgMessageLatency = messageLatencies.reduce((sum, l) => sum + l, 0) / messageLatencies.length;

        const maxMessageLatency = Math.max(...messageLatencies);

        console.log('\n💬 LATENCIA DE MENSAJES:');

        console.log(`Promedio: ${avgMessageLatency.toFixed(2)}ms`);

        console.log(`Máxima: ${maxMessageLatency}ms`);

    }



    // Criterio de éxito

    const passed = successRate >= 95 && totalTime < 60000; // 95% éxito en < 60s

    console.log(`\n${passed ? '✅ PRUEBA PASADA' : '❌ PRUEBA FALLIDA'}`);



    // Limpiar conexiones

    connectedSockets.forEach(({ socket }) => socket.disconnect());



    return passed;

}



// Test de latencia GeoSpatial

async function testGeoSpatialLatency() {

    console.log('\n🗺️ Test de Latencia GeoSpatial...\n');



    const testLocations = [

        { name: 'Ciudad de México', lat: 19.4326, lng: -99.1332, countryCode: 'MX' },

        { name: 'Toronto, CA', lat: 43.6532, lng: -79.3832, countryCode: 'CA' },

        { name: 'New York, US', lat: 40.7128, lng: -74.0060, countryCode: 'US' }

    ];



    for (const location of testLocations) {

        const startTime = Date.now();

        // Simular consulta GeoSpatial (en producción, usar API real)

        const response = await fetch(`${SERVER_URL}/api/petmatch/playmates?latitude=${location.lat}&longitude=${location.lng}&countryCode=${location.countryCode}&radiusKm=5`);

        const latency = Date.now() - startTime;

        const passed = latency < 100;

        console.log(`${location.name}: ${latency}ms ${passed ? '✅' : '❌'}`);

    }

}



// Ejecutar pruebas

if (require.main === module) {

    (async () => {

        await runStressTest();

        await testGeoSpatialLatency();

        process.exit(0);

    })();

}



module.exports = { runStressTest, testGeoSpatialLatency };


