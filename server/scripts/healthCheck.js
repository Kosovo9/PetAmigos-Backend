// Health check mejorado para evitar hibernación de Render
const axios = require('axios');

async function healthCheck() {
    try {
        console.log(`[${new Date().toISOString()}] 🏥 Ejecutando health check...`);

        // 1. Verificar estado del proceso
        const memoryUsage = process.memoryUsage();
        console.log('📊 Memoria:', {
            rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
        });

        // 2. Hacer ping a sí mismo en producción
        if (process.env.NODE_ENV === 'production') {
            const baseUrl = process.env.BASE_URL || 'https://petamigos-backend.onrender.com';
            try {
                const response = await axios.get(`${baseUrl}/health`, {
                    timeout: 10000,
                    headers: { 'User-Agent': 'HealthCheck/1.0' }
                });
                console.log('✅ Self-ping exitoso:', response.data);
            } catch (error) {
                console.warn('⚠️ Self-ping falló:', error.message);
            }
        }

        // 3. Verificar uptime
        const uptime = process.uptime();
        console.log(`⏱️ Uptime: ${Math.floor(uptime / 60)} minutos`);

        return {
            status: 'healthy',
            timestamp: new Date(),
            uptime: uptime,
            memory: memoryUsage
        };
    } catch (error) {
        console.error('❌ Health check fallido:', error.message);
        return { status: 'unhealthy', error: error.message };
    }
}

// Ejecutar cada 10 minutos para evitar sleep de Render
const HEALTH_CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutos

if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Programando health checks cada 10 minutos...');
    setInterval(healthCheck, HEALTH_CHECK_INTERVAL);

    // Ejecutar inmediatamente
    healthCheck();
}

module.exports = healthCheck;
