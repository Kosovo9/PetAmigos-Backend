# 🚀 GO-LIVE PETAMIGOS WORLD - GUÍA COMPLETA

**Usuario**: Kosovo9  
**Repositorio**: https://github.com/Kosovo9/PetAmigos-Backend  
**Fecha**: Enero 2025

---

## ✅ FASE 1: INFRAESTRUCTURA COMPLETADA

### MongoDB Atlas ✅
- **Cluster**: Cluster0 (115.79 MB)
- **Usuario**: `petamigos_user`
- **Password**: `PetAmig0s2025!W0rld#Secure`
- **Network Access**: `0.0.0.0/0` (todas las IPs permitidas)
- **MONGODB_URI**: 
  ```
  mongodb+srv://petamigos_user:PetAmig0s2025!W0rld#Secure@cluster0.baflqoq.mongodb.net/petamigos?retryWrites=true&w=majority
  ```

### GitHub ✅
- **Repo**: `Kosovo9/PetAmigos-Backend`
- **Branch**: `main`
- **URL**: https://github.com/Kosovo9/PetAmigos-Backend

### Render (Configuración Pendiente) 🟡
- **Proyecto**: Nexora pets global / Production
- **Servicio**: PetAmigos-Backend
- **Language**: Node
- **Branch**: main
- **Region**: Oregon (US West)

---

## 📋 FASE 2: CONFIGURACIÓN EN RENDER

### Paso 1: Variables de Entorno en Render

Ve a tu servicio en Render → **Settings** → **Environment** y agrega:

```env
# Base de Datos
MONGODB_URI=mongodb+srv://petamigos_user:PetAmig0s2025!W0rld#Secure@cluster0.baflqoq.mongodb.net/petamigos?retryWrites=true&w=majority

# Autenticación
JWT_SECRET=PetAmigosJWT2025SecureTokenKey!Kosovo9#

# Servidor
NODE_ENV=production
PORT=5000
CLIENT_URL=https://tu-frontend.vercel.app

# Pagos (Configurar después)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# IA (Configurar después)
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=AIzaSyBMkW3pRLTYV_5OLlYxNgd4-YBoN5vk3Tc
```

### Paso 2: Verificar Build y Start Commands

En Render → **Settings** → **Build & Deploy**:

- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`

### Paso 3: Health Check

Render debe tener configurado:
- **Health Check Path**: `/health`

---

## 🧪 FASE 3: VERIFICACIÓN POST-DEPLOY

### 1. Verificar Health Check

```bash
curl https://tu-backend.onrender.com/health
```

**Respuesta esperada**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "database": "connected",
  "uptime": 123.45
}
```

### 2. Verificar Conexión MongoDB

Revisa los logs de Render. Debes ver:
```
✅ BD Conectada
🚀 Server en puerto 5000
```

### 3. Probar Endpoints Críticos

#### Health Check
```bash
GET /health
```

#### Crear Usuario (Test)
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "test@petamigos.com",
  "password": "Test123!",
  "name": "Test User"
}
```

#### Crear Pet Profile (Test)
```bash
POST /api/pets/create-update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Luna",
  "species": "dog",
  "breed": "Golden Retriever",
  "birthDate": "2020-01-15",
  "activityScore": 75,
  "moodScore": 60,
  "healthScore": 80
}
```

**Verificar**: El endpoint debe calcular automáticamente `biologicalAge`.

---

## 🔧 FASE 4: CONFIGURACIÓN ADICIONAL

### Variables Opcionales (Configurar después del Go-Live)

```env
# Mercado Pago (LATAM)
MERCADOPAGO_ACCESS_TOKEN=...

# Lemon Squeezy
LEMON_SQUEEZY_API_KEY=...
LEMON_SQUEEZY_STORE_ID=...

# Marketing
FORKADS_API_KEY=...
FORKADS_ENDPOINT=https://api.forkads.com/segments

# Verificación Biométrica
CLERK_SECRET_KEY=...
```

---

## 🐛 TROUBLESHOOTING

### Error: "MongoServerError: Authentication failed"
- Verifica que el usuario y password en MONGODB_URI sean correctos
- Verifica que el usuario tenga permisos Read/Write en Atlas

### Error: "ECONNREFUSED"
- Verifica que Network Access en Atlas permita `0.0.0.0/0` o las IPs de Render
- Render muestra sus outbound IPs en la sección Networking

### Error: "JWT_SECRET is not defined"
- Verifica que JWT_SECRET esté en las variables de entorno de Render
- Debe tener mínimo 32 caracteres

### El servidor no inicia
- Revisa los logs de Render
- Verifica que `package.json` tenga el script `start: "node server.js"`
- Verifica que todas las dependencias estén en `package.json`

---

## ✅ CHECKLIST FINAL

- [x] MongoDB Atlas configurado
- [x] MONGODB_URI obtenido
- [x] GitHub repo creado
- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas en Render
- [ ] Deploy exitoso en Render
- [ ] Health check respondiendo
- [ ] Conexión MongoDB verificada
- [ ] Endpoints críticos probados

---

## 📞 PRÓXIMOS PASOS

Una vez que el backend esté desplegado y funcionando:

1. **Frontend**: Desplegar en Vercel/Netlify
2. **Pasarelas de Pago**: Configurar Stripe, Mercado Pago, Lemon Squeezy
3. **Testing**: Ejecutar `tests/stressTest.js` para validar escalabilidad
4. **Monitoreo**: Configurar Sentry para tracking de errores

---

**Última actualización**: Enero 2025  
**Estado**: 🟡 Pendiente de deploy en Render

