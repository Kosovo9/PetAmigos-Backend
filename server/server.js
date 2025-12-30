const express = require('express');

const http = require('http');

const cors = require('cors');

const { Server } = require('socket.io');

const mongoose = require('mongoose');

require('dotenv').config();



// Middlewares de Seguridad

const wafShield = require('./middleware/wafShield');

const auth = require('./middleware/auth');

// 🛡️ FORT KNOX SECURITY SUITE
const {
  helmetConfig,
  generalLimiter,
  authLimiter,
  ipBlacklistMiddleware,
  antiScrapingMiddleware,
  antiCloningMiddleware,
  csrfProtection,
  advancedInjectionProtection,
  fileUploadProtection
} = require('./middleware/fortKnoxSecurity');



const UniversalEngine = require('./core/UniversalEngine');
const QuantumSecurity = require('./security/QuantumSecurity');
const SpeedOptimizer = require('./performance/SpeedOptimizer');

// 🚀 INICIALIZACIÓN DE MOTORES 200X
const universalEngine = new UniversalEngine();
const quantumSecurity = new QuantumSecurity();

console.log(`🚀 Universal Engine Active: ${JSON.stringify(universalEngine.detectPlatform())}`);
console.log(`🔒 Quantum Security Initialized`);

const UniversalTabletAdapter = require('./ui/UniversalTabletAdapter');
const UniversalAuth = require('./auth/UniversalAuth');

const app = express();
const server = http.createServer(app);

// 📱 UNIVERSAL TABLET & AUTH MIDDLEWARE (200X)
app.use((req, res, next) => {
  // Tablet Optimization
  const tabletAdapter = new UniversalTabletAdapter(req);
  const optimHeaders = tabletAdapter.getOptimizationHeaders();
  for (const [key, value] of Object.entries(optimHeaders)) {
    res.setHeader(key, value);
  }

  // Attach Universal Auth helper to req
  req.universalAuth = new UniversalAuth();
  next();
});

// ⚡ SPEED OPTIMIZER (Compression & Caching)
SpeedOptimizer.applyMiddleware(app);

// 🛡️ CAPA 1: Helmet - Headers de Seguridad HTTP
app.use(helmetConfig);

// 🛡️ CAPA 2: IP Blacklist
app.use(ipBlacklistMiddleware);

// 🛡️ CAPA 3: Anti-Scraping (Bots)
app.use(antiScrapingMiddleware);

// 🛡️ CAPA 4: Rate Limiting General
app.use(generalLimiter);

// 🌐 CORS Configuration Mejorado
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
      'https://petmatch-global.netlify.app',
      'https://amigospet.netlify.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  credentials: true,
  maxAge: 86400, // 24 horas
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight para todas las rutas

// 📦 Compression y Timeout
const compression = require('compression');
const timeout = require('connect-timeout');

app.use(timeout('30s')); // Timeout global 30 segundos
app.use((req, res, next) => {
  if (!req.timedout) next();
});

app.use(compression({
  level: 6,
  threshold: 10 * 1024, // Comprimir >10KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

app.use(express.json({ limit: '50mb' }));

// 🏥 Health Check Automático (Evitar sleep Render)
if (process.env.NODE_ENV === 'production') {
  require('./scripts/healthCheck');
}



// 🔒 CAPA 5: WAF Original (Inyecciones básicas)

app.use(wafShield);

// 🔒 CAPA 6: Inyecciones Avanzadas
app.use(advancedInjectionProtection);

// 🔒 CAPA 7: Anti-Cloning
app.use(antiCloningMiddleware);

// 🔒 CAPA 8: CSRF Protection
app.use(csrfProtection);

// 🔒 CAPA 9: File Upload Protection
app.use(fileUploadProtection);





const io = new Server(server, {

  cors: {
    origin: [
      process.env.CLIENT_URL,
      "https://www.petmatch.fun",
      "https://petmatch.fun",
      "http://localhost:3000" // Para desarrollo local
    ],
    methods: ["GET", "POST"],
    credentials: true
  }

});



// Geo Socket Service (Pilar 4 - Real-Time 3.0)

const setupGeoSocketService = require('./services/GeoSocketService');

setupGeoSocketService(io);



// Socket básico para compatibilidad

io.on('connection', (socket) => {

  console.log(`🔌 User: ${socket.id}`);

  socket.on('request_service', (data) => io.emit('new_request', data));

});



// ═══════════════════════════════════════════════════════
// 🛡️ 3. BASE DE DATOS - ANTI-FALLOS 100X
// ═══════════════════════════════════════════════════════
const { connectWithRetry, checkConnection } = require('./config/database');

// Iniciar conexión con retry automático
(async () => {
  const connected = await connectWithRetry();
  if (!connected) {
    console.warn('⚠️ Servidor iniciando SIN base de datos');
    console.warn('   El sistema funcionará en modo DEMO con funciones limitadas');
  }
})();

// Middleware para verificar DB en rutas que la necesitan
const requireDB = (req, res, next) => {
  if (!checkConnection()) {
    return res.status(503).json({
      error: 'Base de datos no disponible',
      mode: 'demo',
      message: 'El servidor está en modo demo. Algunas funciones están limitadas.'
    });
  }
  next();
};

// Rutas API

// Health check (sin auth para monitoreo)
app.get('/', (req, res) => res.status(200).send('PetMatch Backend API is Running 🚀'));
app.use('/', require('./routes/healthRoutes'));



// Rutas API

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/pay', require('./routes/paymentRoutes'));

// 💳 NEW PAYMENT GATEWAYS (Mercado Pago + PayPal)
import mercadoPagoRoutes from './routes/payments/mercadopago.js';
import payPalRoutes from './routes/payments/paypal.js';
app.use('/api/payments/mercadopago', mercadoPagoRoutes);
app.use('/api/payments/paypal', payPalRoutes);

// 🤖 AI ROUTES (Hugging Face - Open Source)
import aiServiceRoutes from './routes/ai.js';
app.use('/api/ai', aiServiceRoutes);

app.use('/api/ai-creative', require('./routes/aiCreativeRoutes'));

app.use('/api/sentry', require('./routes/sentryRoutes'));

app.use('/api/legacy', require('./routes/legacyRoutes'));

app.use('/api/verification', require('./routes/verificationRoutes'));

app.use('/api/chat', require('./routes/chatRoutes'));

app.use('/api/pets', require('./routes/petProfileRoutes'));

app.use('/api/petmatch', require('./routes/petMatchRoutes'));

app.use('/api/pit-token', require('./routes/pitTokenRoutes'));

app.use('/api/fintech', require('./routes/finTechRoutes'));

app.use('/api/qa', require('./routes/qaRoutes'));

app.use('/api/ab-testing', require('./routes/abTestingRoutes'));

app.use('/api/data-exchange', require('./routes/dataExchangeRoutes'));

app.use('/api/insurance', require('./routes/insuranceRoutes'));

app.use('/api/dao', require('./routes/daoRoutes'));

app.use('/api/retention', require('./routes/retentionRoutes'));

app.use('/api/msr', require('./routes/msrRoutes'));

app.use('/api/breeding', require('./routes/breedingRoutes'));

app.use('/api/memory', require('./routes/memoryRoutes'));

app.use('/api/fusion', require('./routes/fusionRoutes')); // 🚀 Fusión 10x (Fly, ESG, Influencers)

app.use('/api/referrals', require('./routes/referralRoutes')); // 💎 Sistema de Créditos y Viral Loop

app.use('/api/affiliates', require('./routes/affiliateRoutes')); // 💰 Sistema de Afiliados y Códigos Promo

app.use('/api/photos', require('./routes/photoRoutes')); // 🎨 Generación de Fotos con Watermark
app.use('/api/photos', require('./routes/batchPhotoRoutes')); // 📸 Batch Upload & Auto-Analysis
app.use('/api/universe', require('./routes/photoUniverseRoutes')); // 🌌 Photo Universe (Multi-Subject)
app.use('/api/prompts', require('./routes/megaPromptRoutes')); // 📚 Mega Prompts & Reverse Engineering
app.use('/api/escrow', require('./routes/escrowRoutes')); // 🏦 Affiliate Escrow Vault

app.use('/api/love-stories', require('./routes/loveStoriesRoutes')); // ❤️ Historias de Adopción
app.use('/api/fly', require('./routes/flyRoutes')); // ✈️ PetMatch Fly Policies
app.use('/api/digital-twin', require('./routes/digitalTwinRoutes')); // 🧬 Pet Digital Twin
app.use('/api/admin', require('./routes/adminRoutes')); // 🛡️ Admin Panel (Nivel NASA)
app.use('/api/admin/generation', require('./routes/generationDashboardRoutes')); // 🎯 Generation Command Center
app.use('/api/affiliates', require('./routes/affiliateRoutes')); // 💼 Affiliate System (Platinum Suite)
app.use('/api/lost-pets', require('./routes/lostPetsRoutes')); // 🔍 Lost Pets Radar (Global)

// 🚀 NUEVOS MODULOS FINAL PUSH
import widgetRoutes from './routes/widgetRoutes.js';
app.use('/api/widget', widgetRoutes);

import storyRoutes from './routes/storyRoutes.js';
app.use('/api/stories', storyRoutes);

import eventRoutes from './routes/eventRoutes.js';
app.use('/api/events', eventRoutes);

import pushRoutes from './routes/pushRoutes.js';
app.use('/api/push', pushRoutes);

import metricsRoutes from './routes/metricsRoutes.js';
app.use('/api/metrics', metricsRoutes);




// ❌ Error Handler Centralizado (debe ir al final de todas las rutas)
const { errorHandler, notFound } = require('./middleware/errorHandler');

// 404 para rutas no encontradas
app.use(notFound);

// Error handler global
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));

