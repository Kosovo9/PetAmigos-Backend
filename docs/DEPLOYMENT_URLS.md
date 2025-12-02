# 🔗 URLs DE DEPLOYMENT - PETAMIGOS WORLD

## 📍 URLs DESPUÉS DEL DESPLIEGUE

### 🚀 BACKEND (Render.com)
**URL Base**: `https://petamigos-backend.onrender.com`

**Endpoints Principales**:
- Health Check: `https://petamigos-backend.onrender.com/api/health`
- API Base: `https://petamigos-backend.onrender.com/api`
- Socket.IO: `wss://petamigos-backend.onrender.com`

**Nota**: Render genera URLs automáticamente con formato: `[nombre-servicio].onrender.com`

---

### 🌐 FRONTEND (Vercel)
**URL Base**: `https://petamigos-world.vercel.app`

**Páginas Principales**:
- Home: `https://petamigos-world.vercel.app`
- Login: `https://petamigos-world.vercel.app/login`
- Dashboard: `https://petamigos-world.vercel.app/dashboard`

**Nota**: Vercel genera URLs automáticamente con formato: `[nombre-proyecto].vercel.app`

---

### ☁️ CLOUDFLARE WORKER (Geo-Blocking)
**URL Base**: `https://petamigos-worker.[tu-subdominio].workers.dev`

**Nota**: Cloudflare Workers genera URLs con formato: `[nombre-worker].[tu-subdominio].workers.dev`

---

## 📝 CÓMO OBTENER LAS URLs

### 1. BACKEND EN RENDER.COM

1. **Ir a**: https://render.com
2. **Crear cuenta** (si no tienes)
3. **Nuevo Web Service**:
   - Conectar repositorio GitHub
   - Seleccionar `PetAmigos_Wrold`
   - Configurar:
     - **Name**: `petamigos-backend`
     - **Environment**: Node
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
4. **Después del deploy**, Render mostrará la URL:
   ```
   https://petamigos-backend.onrender.com
   ```
5. **Copiar esta URL** y actualizar:
   - Variable `CLIENT_URL` en Render (para CORS)
   - Variable `NEXT_PUBLIC_API_URL` en Vercel

---

### 2. FRONTEND EN VERCEL

1. **Ir a**: https://vercel.com
2. **Crear cuenta** (si no tienes)
3. **Nuevo Proyecto**:
   - Conectar repositorio GitHub
   - Seleccionar `PetAmigos_Wrold`
   - Configurar:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
4. **Agregar Variables de Entorno**:
   ```
   VITE_API_URL=https://petamigos-backend.onrender.com/api
   ```
5. **Después del deploy**, Vercel mostrará la URL:
   ```
   https://petamigos-world.vercel.app
   ```
6. **Actualizar en Render**:
   - Variable `CLIENT_URL` = `https://petamigos-world.vercel.app`

---

### 3. CLOUDFLARE WORKER

1. **Ir a**: https://dash.cloudflare.com
2. **Workers & Pages** → **Create Worker**
3. **Pegar código** de `cloudflare/worker.js`
4. **Deploy**
5. **URL generada**:
   ```
   https://petamigos-worker.[tu-subdominio].workers.dev
   ```
6. **Configurar dominio personalizado** (opcional):
   - Workers → Tu Worker → Settings → Routes
   - Agregar dominio: `api.petamigos.com`

---

## 🔧 CONFIGURACIÓN DE VARIABLES

### En Render (Backend)
```env
CLIENT_URL=https://petamigos-world.vercel.app
NEXT_PUBLIC_API_URL=https://petamigos-backend.onrender.com/api
```

### En Vercel (Frontend)
```env
VITE_API_URL=https://petamigos-backend.onrender.com/api
VITE_APP_URL=https://petamigos-world.vercel.app
```

---

## 📋 CHECKLIST DE DESPLIEGUE

### Backend (Render)
- [ ] Crear servicio en Render
- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno
- [ ] Deploy exitoso
- [ ] Copiar URL: `https://[nombre].onrender.com`
- [ ] Verificar health check: `/api/health`

### Frontend (Vercel)
- [ ] Crear proyecto en Vercel
- [ ] Conectar repositorio GitHub
- [ ] Configurar build settings
- [ ] Agregar variables de entorno
- [ ] Deploy exitoso
- [ ] Copiar URL: `https://[nombre].vercel.app`
- [ ] Actualizar `CLIENT_URL` en Render

### Cloudflare Worker (Opcional)
- [ ] Crear Worker en Cloudflare
- [ ] Deploy código de geo-blocking
- [ ] Copiar URL del Worker
- [ ] Configurar dominio personalizado (opcional)

---

## 🎯 URLs FINALES (EJEMPLO)

Una vez desplegado, tus URLs serán:

```
Backend API:    https://petamigos-backend.onrender.com
Frontend Web:   https://petamigos-world.vercel.app
Cloudflare:     https://petamigos-worker.workers.dev (opcional)
```

---

## ⚠️ IMPORTANTE

1. **Render.com** puede tardar 2-3 minutos en generar la URL después del primer deploy
2. **Vercel** genera la URL inmediatamente después del deploy
3. **Cloudflare Workers** requiere cuenta de Cloudflare (gratis)
4. **Actualizar CORS** en backend con la URL del frontend
5. **Verificar SSL/HTTPS** está activo en todas las URLs

---

## 🚀 COMANDOS RÁPIDOS

### Verificar Deployment Backend
```bash
curl https://petamigos-backend.onrender.com/api/health
```

### Verificar Deployment Frontend
```bash
curl https://petamigos-world.vercel.app
```

---

**Estado Actual**: ⏳ Pendiente de deployment  
**Próximo Paso**: Ejecutar deployment en Render y Vercel para obtener URLs reales



