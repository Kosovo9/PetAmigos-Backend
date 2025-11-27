const fs = require('fs'); // Módulo nativo de Node.js

const moment = require('moment'); // Requiere: npm install moment



// RUTA DEL ARCHIVO DE REGISTRO

const LOG_FILE = 'security_audit.log';



// 1. Función para registrar eventos críticos del WAF (Inyección, Fraude)

const logCriticalEvent = (event) => {

    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    // Registra IP, código de error y mensaje

    const logEntry = `[${timestamp}] [CRITICAL] IP: ${event.ip} | CODE: ${event.code} | MESSAGE: ${event.message}\n`;

    

    // Escribir en el archivo de forma asíncrona (Protocolo de Auditoría)

    fs.appendFile(LOG_FILE, logEntry, (err) => {

        if (err) console.error("Error escribiendo en el log de auditoría crítica:", err);

    });

};



// 2. Función para registrar fallos de Biometría (Anti-Robo/Fraude de Identidad)

const logBiometricFailure = (event) => {

    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    // Registra ID de usuario, tipo de fallo (Check-in/Check-out) e intentos

    const logEntry = `[${timestamp}] [BIOMETRIC FAIL] IP: ${event.ip} | USER_ID: ${event.userId} | TYPE: ${event.type} | ATTEMPTS: ${event.attempts}\n`;

    

    fs.appendFile(LOG_FILE, logEntry, (err) => {

        if (err) console.error("Error escribiendo en el log de biometría:", err);

    });

};



module.exports = { logCriticalEvent, logBiometricFailure };

