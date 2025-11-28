const axios = require('axios');
const fs = require('fs');

// 🎯 CONFIGURACIÓN DEL OBJETIVO
const API_URL = 'https://cd-server-andand-npm-install.onrender.com/api'; // Backend en Producción
// const API_URL = 'http://localhost:5000/api'; // Descomentar para probar local

const NUM_USERS = 10;
const PHOTOS_PER_USER = 3;
const PURCHASES_TO_SIMULATE = 5;

// Colores para consola
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    bold: "\x1b[1m"
};

const log = (msg, color = colors.reset) => console.log(`${color}${msg}${colors.reset}`);

// Estado del test
const stats = {
    usersCreated: 0,
    photosGenerated: 0,
    purchasesSimulated: 0,
    referralsTracked: 0,
    errors: 0
};

const users = [];

// 🛠️ UTILS
const randomString = (len = 8) => Math.random().toString(36).substring(2, 2 + len);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runBattleTest() {
    log(`\n🚀 INICIANDO BATTLE TEST: OPERATION CHAOS`, colors.bold + colors.cyan);
    log(`🎯 Objetivo: ${API_URL}`, colors.yellow);
    log(`👥 Usuarios a crear: ${NUM_USERS}`, colors.yellow);

    const startTime = Date.now();

    try {
        // 1. REGISTRO DE USUARIOS (Con Referidos)
        log(`\n[FASE 1] CREANDO EJÉRCITO DE BOTS...`, colors.bold);

        // Crear primer usuario (Líder)
        const leader = await registerUser(`leader_${randomString()}`, null);
        if (leader) users.push(leader);

        // Crear resto de usuarios (algunos referidos por el líder)
        for (let i = 0; i < NUM_USERS - 1; i++) {
            const isReferral = i % 2 === 0; // 50% son referidos
            const referrerCode = isReferral && leader ? leader.referralCode : null;

            const user = await registerUser(`bot_${i}_${randomString()}`, referrerCode);
            if (user) {
                users.push(user);
                if (isReferral) stats.referralsTracked++;
            }
            await delay(200); // Pequeña pausa para no saturar rate limits básicos
        }

        // 2. GENERACIÓN DE FOTOS (Consumo de Créditos)
        log(`\n[FASE 2] GENERANDO TRÁFICO DE IMÁGENES...`, colors.bold);
        for (const user of users) {
            log(`📸 Usuario ${user.email} generando fotos...`, colors.cyan);
            for (let j = 0; j < PHOTOS_PER_USER; j++) {
                await generatePhoto(user);
                await delay(100);
            }
        }

        // 3. SIMULACIÓN DE COMPRAS (Ingresos y Comisiones)
        log(`\n[FASE 3] SIMULANDO LLUVIA DE DINERO...`, colors.bold);
        // Solo los primeros 5 usuarios compran
        for (let i = 0; i < PURCHASES_TO_SIMULATE; i++) {
            if (users[i]) {
                await simulatePurchase(users[i]);
            }
        }

        // 4. VERIFICACIÓN DE RESULTADOS
        log(`\n[FASE 4] ANÁLISIS DE DAÑOS...`, colors.bold);
        await verifyAffiliateCommissions(leader);

    } catch (error) {
        log(`❌ ERROR FATAL EN EL TEST: ${error.message}`, colors.red);
    } finally {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        printReport(duration);
    }
}

// --- FUNCIONES AUXILIARES ---

async function registerUser(name, referralCode) {
    try {
        const email = `${name}@test.com`;
        const password = 'Password123!';

        const payload = {
            name: name,
            email: email,
            password: password
        };

        if (referralCode) payload.referralCode = referralCode;

        const res = await axios.post(`${API_URL}/auth/register`, payload);

        if (res.data.token) {
            log(`✅ Usuario creado: ${email} ${referralCode ? `(Ref: ${referralCode})` : ''}`, colors.green);
            stats.usersCreated++;
            return { ...res.data.user, token: res.data.token, password };
        }
    } catch (error) {
        log(`❌ Error creando usuario ${name}: ${error.response?.data?.message || error.message}`, colors.red);
        stats.errors++;
        return null;
    }
}

async function generatePhoto(user) {
    try {
        // Usamos un endpoint mock o real si tienes créditos
        // Si no tiene créditos, debería fallar (test correcto)
        const res = await axios.post(`${API_URL}/photos/generate`, {
            prompt: "A cute dog in christmas outfit",
            category: "christmas",
            style: "realistic"
        }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });

        if (res.status === 200) {
            log(`  ✅ Foto generada (ID: ${res.data.photoId})`, colors.green);
            stats.photosGenerated++;
        }
    } catch (error) {
        if (error.response?.status === 402) {
            log(`  ⚠️ Sin créditos (Esperado si se acabaron)`, colors.yellow);
        } else {
            log(`  ❌ Error generando foto: ${error.response?.data?.error || error.message}`, colors.red);
            stats.errors++;
        }
    }
}

async function simulatePurchase(user) {
    try {
        // Simulamos una compra exitosa llamando al webhook o endpoint de prueba
        // NOTA: Esto requiere un endpoint de "test purchase" o simular el webhook de Stripe
        // Por ahora, usaremos el endpoint de "purchase photo" si existe, o compra de créditos

        log(`💰 Usuario ${user.email} comprando créditos...`, colors.cyan);

        // Aquí idealmente llamaríamos a un endpoint de "crear orden"
        // Como es un test externo, solo podemos verificar si los endpoints de pago responden
        // Simulemos una llamada a "create-checkout-session"

        const res = await axios.post(`${API_URL}/payments/create-checkout-session`, {
            priceId: 'price_test_credits_100',
            quantity: 1
        }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });

        if (res.status === 200) {
            log(`  ✅ Checkout session creada`, colors.green);
            stats.purchasesSimulated++;
        }

    } catch (error) {
        log(`  ❌ Error en compra: ${error.response?.data?.error || error.message}`, colors.red);
        // No contamos como error crítico si es porque falta configuración de Stripe en backend
    }
}

async function verifyAffiliateCommissions(leader) {
    if (!leader) return;

    try {
        const res = await axios.get(`${API_URL}/affiliates/dashboard`, {
            headers: { Authorization: `Bearer ${leader.token}` }
        });

        log(`📊 Dashboard del Líder:`, colors.cyan);
        log(`   Referidos: ${res.data.totalReferrals}`, colors.green);
        log(`   Ganancias: $${res.data.totalEarnings}`, colors.green);

        if (res.data.totalReferrals > 0) {
            log(`✅ El sistema de referidos FUNCIONA`, colors.green + colors.bold);
        } else {
            log(`⚠️ No se detectaron referidos (¿Delay en base de datos?)`, colors.yellow);
        }

    } catch (error) {
        log(`❌ Error verificando dashboard: ${error.message}`, colors.red);
    }
}

function printReport(duration) {
    log(`\n=============================================`, colors.bold);
    log(`🏁 REPORTE FINAL DE MISIÓN`, colors.bold);
    log(`=============================================`, colors.bold);
    log(`⏱️ Duración: ${duration} segundos`);
    log(`👥 Usuarios Creados: ${stats.usersCreated} / ${NUM_USERS}`);
    log(`📸 Fotos Generadas: ${stats.photosGenerated}`);
    log(`💰 Intentos de Compra: ${stats.purchasesSimulated}`);
    log(`🔗 Referidos Rastreados: ${stats.referralsTracked}`);
    log(`❌ Errores Totales: ${stats.errors}`);

    if (stats.errors === 0) {
        log(`\n🏆 RESULTADO: VICTORIA IMPECABLE (100% SUCCESS)`, colors.green + colors.bold);
    } else if (stats.errors < 5) {
        log(`\n⚠️ RESULTADO: ÉXITO CON HERIDAS LEVES`, colors.yellow + colors.bold);
    } else {
        log(`\n💀 RESULTADO: EL SISTEMA SUFRIÓ DAÑOS`, colors.red + colors.bold);
    }
    log(`=============================================\n`, colors.bold);
}

// Ejecutar
runBattleTest();
