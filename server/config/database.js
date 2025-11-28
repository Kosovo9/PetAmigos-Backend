const mongoose = require('mongoose');

// 🛡️ CONEXIÓN ANTI-FALLOS 100X

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/petmatch';

const connectOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    retryWrites: true,
    retryReads: true
};

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 3000;

async function connectWithRetry() {
    if (isConnected) {
        console.log('✅ MongoDB ya está conectado');
        return true;
    }

    connectionAttempts++;

    try {
        console.log(`🔄 Intento de conexión MongoDB #${connectionAttempts}...`);

        await mongoose.connect(mongoUri, connectOptions);

        isConnected = true;
        connectionAttempts = 0;

        console.log('✅ MongoDB conectado exitosamente');
        console.log(`📊 Base de datos: ${mongoose.connection.name}`);

        // Event listeners
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB desconectado');
            isConnected = false;
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Error en MongoDB:', err.message);
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconectado');
            isConnected = true;
        });

        return true;

    } catch (error) {
        console.error(`❌ Error conexión MongoDB (intento ${connectionAttempts}/${MAX_RETRY_ATTEMPTS}):`, error.message);
        isConnected = false;

        // Retry con backoff exponencial
        if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
            const delay = RETRY_DELAY * connectionAttempts;
            console.log(`   ⏳ Reintentando en ${delay / 1000}s...`);

            await new Promise(resolve => setTimeout(resolve, delay));
            return connectWithRetry();
        } else {
            console.error('❌ MongoDB: Máximo de reintentos alcanzado');
            console.warn('⚠️ El servidor continuará SIN base de datos (modo demo)');
            return false;
        }
    }
}

// Función para verificar conexión
function checkConnection() {
    return isConnected && mongoose.connection.readyState === 1;
}

// Función para obtener modelo de forma segura
function getSafeModel(modelName) {
    try {
        if (!checkConnection()) {
            return null;
        }
        return mongoose.model(modelName);
    } catch (error) {
        console.error(`Error obteniendo modelo ${modelName}:`, error.message);
        return null;
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    if (isConnected) {
        try {
            await mongoose.connection.close();
            console.log('MongoDB cerrado correctamente');
        } catch (error) {
            console.error('Error cerrando MongoDB:', error.message);
        }
    }
    process.exit(0);
});

module.exports = {
    connectWithRetry,
    checkConnection,
    getSafeModel,
    get isConnected() { return isConnected; }
};
