# 🚀 GUÍA DE DESPLIEGUE - PETAMIGOS WORLD

## ⚠️ IMPORTANTE: Socket.IO y Serverless

### Vercel
**Socket.IO NO funciona en funciones serverless puras de Vercel.**

**Solución Recomendada**:
- Desplegar el servidor Node.js con Socket.IO en un VPS dedicado:
  - **Render.com** (Recomendado)
  - **Fly.io**
  - **Google Cloud Run**
  - **Railway**
  - **DigitalOcean App Platform**
- El frontend Next.js/React puede desplegarse en Vercel
- El frontend consume el endpoint del servidor Socket.IO

**Arquitectura**:
```
Frontend (Vercel) → API Server con Socket.IO (Render/Fly) → MongoDB Atlas
```

### Cloudflare Workers
**Socket.IO requiere adaptaciones especiales en Cloudflare Workers.**

**Solución Recomendada**:
- Desplegar servidor Socket.IO en proveedor dedicado (Render, Fly, etc.)
- Usar Cloudflare como:
  - Proxy reverso
  - CDN
  - Gestión de dominio
  - Protección DDoS

**Arquitectura**:
```
Cloudflare (Proxy/CDN) → Socket.IO Server (Render/Fly) → MongoDB Atlas
```

---

## 📦 DESPLIEGUE RECOMENDADO

### Opción 1: Render.com (Recomendado para Socket.IO)

1. **Crear cuenta en Render.com**
2. **Nuevo Web Service**:
   - Conectar repositorio GitHub
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment: Node
   - Plan: Starter ($7/mes) o más

3. **Variables de Entorno**:
   - Agregar todas las variables de `server/.env.example`
   - Especialmente: `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`

4. **Frontend en Vercel**:
   - Conectar repositorio
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Actualizar `CLIENT_URL` en backend con URL de Vercel

### Opción 2: Railway

1. **Crear proyecto en Railway**
2. **Conectar GitHub**
3. **Configurar**:
   - Root Directory: `server`
   - Start Command: `npm start`
   - Variables de entorno desde `.env.example`

### Opción 3: Fly.io

1. **Instalar Fly CLI**: `npm install -g @fly/cli`
2. **Login**: `fly auth login`
3. **Inicializar**: `fly launch` en directorio `server`
4. **Desplegar**: `fly deploy`

---

## 🔧 CONFIGURACIÓN DE PRODUCCIÓN

### Variables de Entorno Críticas

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://tu-frontend.vercel.app
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/petamigos
JWT_SECRET=tu_secret_super_seguro
STRIPE_SECRET_KEY=sk_live_...
```

### MongoDB Atlas

1. Crear cluster en MongoDB Atlas
2. Whitelist IP del servidor (0.0.0.0/0 para desarrollo)
3. Crear usuario de base de datos
4. Obtener connection string
5. Actualizar `MONGO_URI`

### Socket.IO - CORS

Asegúrate de configurar CORS correctamente en `server.js`:

```javascript
const io = new Server(server, {
  cors: { 
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

---

## 📊 MONITOREO Y LOGS

### Render.com
- Logs automáticos en dashboard
- Health checks configurados
- Alertas por email

### Sentry (Opcional)
- Configurar `SENTRY_DSN` en variables de entorno
- Tracking automático de errores

---

## ✅ CHECKLIST DE DESPLIEGUE

- [ ] Servidor Node.js desplegado (Render/Fly/Railway)
- [ ] MongoDB Atlas configurado
- [ ] Variables de entorno configuradas
- [ ] Frontend desplegado (Vercel)
- [ ] CORS configurado correctamente
- [ ] Socket.IO funcionando (verificar conexiones)
- [ ] Stripe configurado (claves de producción)
- [ ] Dominio personalizado (opcional)
- [ ] SSL/HTTPS activado
- [ ] Monitoreo configurado

---

## 🐛 TROUBLESHOOTING

### Socket.IO no conecta
- Verificar CORS en servidor
- Verificar que el servidor no esté en modo serverless
- Verificar que el puerto esté abierto

### Errores de MongoDB
- Verificar whitelist de IPs
- Verificar credenciales
- Verificar connection string

### Errores de CORS
- Verificar `CLIENT_URL` en backend
- Verificar configuración de CORS en `server.js`

---

**Última actualización**: Noviembre 2024



