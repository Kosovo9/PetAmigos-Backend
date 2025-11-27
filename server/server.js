const express = require('express');

const http = require('http');

const cors = require('cors');

const { Server } = require('socket.io');

const mongoose = require('mongoose');

require('dotenv').config();



// Middlewares de Seguridad

const wafShield = require('./middleware/wafShield');

const auth = require('./middleware/auth');



const app = express();

const server = http.createServer(app);



app.use(cors());

app.use(express.json({ limit: '50mb' }));



// 🔒 WAF: Protección global contra inyecciones y ataques

app.use(wafShield);



mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log('✅ BD Conectada'))

  .catch(err => console.error('❌ Error BD:', err));



const io = new Server(server, {

  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] }

});



io.on('connection', (socket) => {

  console.log(`🔌 User: ${socket.id}`);

  socket.on('request_service', (data) => io.emit('new_request', data));

});



app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/pay', require('./routes/paymentRoutes'));

app.use('/api/ai', require('./routes/aiRoutes'));



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));

