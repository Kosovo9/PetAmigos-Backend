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



const app = express();

const server = http.createServer(app);



// 🛡️ CAPA 1: Helmet - Headers de Seguridad HTTP
app.use(helmetConfig);

// 🛡️ CAPA 2: IP Blacklist
app.use(ipBlacklistMiddleware);

// 🛡️ CAPA 3: Anti-Scraping (Bots)
app.use(antiScrapingMiddleware);

// 🛡️ CAPA 4: Rate Limiting General
app.use(generalLimiter);

app.use(cors());

app.use(express.json({ limit: '50mb' }));



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



// MongoDB Connection con optimizaciones de performance
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ FATAL: MONGODB_URI no definida');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  maxPoolSize: 10, // Máximo de conexiones simultáneas
  serverSelectionTimeoutMS: 5000, // Timeout de selección de servidor
  socketTimeoutMS: 45000, // Timeout de socket
  bufferCommands: false // Deshabilitar buffering para mejor performance
})
  .then(() => console.log('✅ BD Conectada'))
  .catch(err => console.error('❌ Error BD:', err));

// Rutas API

// Health check (sin auth para monitoreo)
app.get('/', (req, res) => res.status(200).send('PetMatch Backend API is Running 🚀'));
app.use('/', require('./routes/healthRoutes'));



// Rutas API

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/pay', require('./routes/paymentRoutes'));

app.use('/api/ai', require('./routes/aiRoutes'));

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

app.use('/api/love-stories', require('./routes/loveStoriesRoutes')); // ❤️ Historias de Adopción
app.use('/api/fly', require('./routes/flyRoutes')); // ✈️ PetMatch Fly Policies
app.use('/api/digital-twin', require('./routes/digitalTwinRoutes')); // 🧬 Pet Digital Twin



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));

