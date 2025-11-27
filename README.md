# 🐾 PetAmigos World - Pro Edition

Plataforma social completa para mascotas con Backend (Node.js/Express) y Frontend (React/Vite).

## 🚀 Inicio Rápido

### Backend (Server)

```bash
cd server
npm install
npm run dev
```

El servidor estará en `http://localhost:5000`

### Frontend (Client)

```bash
cd client
npm install
npm run dev
```

La aplicación estará en `http://localhost:5173`

## 📋 Configuración

1. **MongoDB**: Actualiza `server/.env` con tu URI de MongoDB
2. **Stripe**: Agrega tu clave secreta de Stripe para pagos
3. **OpenAI**: Agrega tu API key de OpenAI para el chat IA
4. **JWT**: Cambia el `JWT_SECRET` por uno seguro

## 🛠️ Tecnologías

### Backend
- Express.js
- MongoDB (Mongoose)
- Socket.io
- Stripe
- OpenAI
- JWT Authentication

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Socket.io Client

## 📱 Características

- ✅ Autenticación de usuarios
- ✅ Chat IA con mascotas
- ✅ Sistema de pagos (Stripe)
- ✅ Feed social
- ✅ Alertas Amber
- ✅ Sistema de treats (moneda virtual)
- ✅ Socket.io para tiempo real

## 📝 Notas

- El chat IA está en modo mock por defecto (para evitar gastos)
- Configura las variables de entorno antes de ejecutar
- El proyecto está listo para producción después de configurar las APIs

