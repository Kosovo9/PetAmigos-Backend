# 🚀 Checklist de Deployment para Netlify - PetMatch Global

## ✅ Estado Actual del Proyecto

### Tests Pasando
- ✅ **23/23 tests pasando** exitosamente
- ✅ Matching engine funcionando correctamente
- ✅ Breed compatibility table validada
- ✅ Seed tests completados

### Build en Progreso
- 🔄 Build del frontend (Vite) en proceso
- 🔄 Build del backend (esbuild) pendiente

---

## 📋 Pasos Restantes para Deployment

### 1. **Completar el Build Local** ✅ (En Progreso)
```bash
pnpm build
```
**Estado**: Ejecutándose actualmente

---

### 2. **Configurar Variables de Entorno en Netlify** ⚠️ CRÍTICO

Necesitas agregar estas variables en **Netlify Dashboard → Site Settings → Environment Variables**:

#### **Variables de Base de Datos** (REQUERIDAS)
```env
DATABASE_URL=mysql://usuario:password@host:puerto/database
```
> 💡 **Importante**: Necesitarás una base de datos MySQL en producción. Opciones:
> - **PlanetScale** (Gratis hasta 5GB)
> - **Railway** (Gratis con límites)
> - **Aiven** (Gratis tier disponible)
> - **AWS RDS** (Pago)

#### **Variables de Autenticación** (REQUERIDAS)
```env
JWT_SECRET=tu-secreto-super-seguro-aqui-min-32-caracteres
OAUTH_SERVER_URL=https://tu-sitio.netlify.app
```

#### **Variables de Aplicación** (OPCIONALES)
```env
NODE_ENV=production
PORT=3000
OWNER_OPEN_ID=owner
VITE_APP_ID=petmatch-prod
```

#### **Variables de APIs Externas** (Si las usas)
```env
# AWS S3 (para almacenamiento de imágenes)
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=petmatch-images

# Google Maps (si usas geolocalización)
VITE_GOOGLE_MAPS_API_KEY=tu-api-key

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.umami.is
VITE_ANALYTICS_WEBSITE_ID=tu-website-id
```

---

### 3. **Configurar Base de Datos en Producción** ⚠️ CRÍTICO

#### Opción A: PlanetScale (Recomendado - Gratis)
1. Crear cuenta en [planetscale.com](https://planetscale.com)
2. Crear nueva base de datos
3. Obtener connection string
4. Ejecutar migraciones:
```bash
# Localmente, con DATABASE_URL de producción
pnpm db:push
```

#### Opción B: Railway
1. Crear cuenta en [railway.app](https://railway.app)
2. Crear servicio MySQL
3. Copiar DATABASE_URL
4. Ejecutar migraciones

---

### 4. **Preparar el Repositorio Git** ✅

```bash
# Verificar que estés en la rama correcta
git status

# Agregar cambios
git add .

# Commit
git commit -m "feat: ready for Netlify deployment with PostCSS fix"

# Push a GitHub
git push origin main
```

---

### 5. **Deployment en Netlify** 🎯

#### Opción A: Deployment via GitHub (Recomendado)
1. **Ir a [app.netlify.com](https://app.netlify.com)**
2. **Click en "Add new site" → "Import an existing project"**
3. **Conectar con GitHub** y seleccionar el repositorio
4. **Configurar Build Settings**:
   - **Base directory**: (dejar vacío)
   - **Build command**: `pnpm install && pnpm build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: (dejar vacío por ahora)

5. **Agregar Environment Variables** (ver sección 2)
6. **Click en "Deploy site"**

#### Opción B: Deployment via Netlify CLI
```bash
# Instalar Netlify CLI globalmente
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

---

### 6. **Configurar el Backend** ⚠️ IMPORTANTE

**NOTA**: Netlify es principalmente para frontend. Para el backend necesitas:

#### Opción A: Netlify Functions (Serverless)
- Convertir las rutas Express a Netlify Functions
- Limitaciones: No ideal para WebSockets o conexiones persistentes

#### Opción B: Backend Separado en Render/Railway (RECOMENDADO)
1. **Deploy Backend en Render**:
   - Crear cuenta en [render.com](https://render.com)
   - Crear "Web Service"
   - Conectar mismo repositorio
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - Agregar variables de entorno

2. **Actualizar Frontend para apuntar al backend**:
```typescript
// client/src/lib/api.ts o similar
const API_URL = import.meta.env.VITE_API_URL || 'https://tu-backend.onrender.com';
```

---

### 7. **Post-Deployment Checklist** ✅

Después del deployment, verificar:

- [ ] **Frontend carga correctamente**
- [ ] **Rutas de SPA funcionan** (navegación sin errores 404)
- [ ] **API endpoints responden** (si backend está configurado)
- [ ] **Base de datos conectada** (verificar en logs)
- [ ] **Imágenes y assets cargan**
- [ ] **Formularios funcionan**
- [ ] **Autenticación funciona** (si aplica)
- [ ] **Responsive design** en móvil
- [ ] **Performance** (Lighthouse score > 80)

---

## 🔧 Troubleshooting Común

### Error: "Build failed"
```bash
# Verificar build localmente primero
pnpm build

# Revisar logs en Netlify Dashboard
```

### Error: "Database connection failed"
- Verificar `DATABASE_URL` en variables de entorno
- Asegurar que la base de datos permite conexiones externas
- Verificar firewall/whitelist de IPs

### Error: "API calls failing"
- Verificar CORS en el backend
- Asegurar que `VITE_API_URL` apunta al backend correcto
- Verificar que el backend está desplegado y corriendo

### Error: "404 on page refresh"
- Verificar que `netlify.toml` tiene el redirect `/* → /index.html`

---

## 📊 Arquitectura Recomendada

```
┌─────────────────────────────────────────┐
│         NETLIFY (Frontend)              │
│   https://petmatch.netlify.app          │
│                                         │
│   - React SPA                           │
│   - Static Assets                       │
│   - Client-side Routing                 │
└─────────────────┬───────────────────────┘
                  │
                  │ API Calls
                  ▼
┌─────────────────────────────────────────┐
│      RENDER/RAILWAY (Backend)           │
│   https://petmatch-api.onrender.com     │
│                                         │
│   - Express Server                      │
│   - tRPC API                            │
│   - Authentication                      │
└─────────────────┬───────────────────────┘
                  │
                  │ Database Queries
                  ▼
┌─────────────────────────────────────────┐
│      PLANETSCALE (Database)             │
│                                         │
│   - MySQL Database                      │
│   - Automatic Backups                   │
│   - Scaling                             │
└─────────────────────────────────────────┘
```

---

## 💰 Costos Estimados

| Servicio | Plan | Costo |
|----------|------|-------|
| **Netlify** | Starter | **$0/mes** (100GB bandwidth) |
| **Render** | Free | **$0/mes** (750hrs/mes) |
| **PlanetScale** | Hobby | **$0/mes** (5GB storage) |
| **Total** | | **$0/mes** 🎉 |

---

## 🎯 Próximos Pasos Inmediatos

1. ✅ **Esperar que termine el build actual**
2. ⚠️ **Crear cuenta en PlanetScale** y configurar base de datos
3. ⚠️ **Crear cuenta en Render** para el backend
4. ⚠️ **Configurar variables de entorno** en ambos servicios
5. 🚀 **Deploy frontend en Netlify**
6. 🚀 **Deploy backend en Render**
7. ✅ **Probar la aplicación en producción**

---

## 📝 Comandos Rápidos

```bash
# Build local
pnpm build

# Test local
pnpm test

# Dev local
pnpm dev

# Deploy (con Netlify CLI)
netlify deploy --prod

# Ver logs de Netlify
netlify logs

# Abrir dashboard de Netlify
netlify open
```

---

## 🆘 Necesitas Ayuda?

Si encuentras algún error durante el deployment:

1. **Revisar logs** en Netlify Dashboard
2. **Verificar variables de entorno**
3. **Probar build localmente** con `pnpm build`
4. **Revisar este checklist** punto por punto

---

**Última actualización**: 2025-12-28
**Estado**: ✅ Listo para deployment (pendiente configuración de servicios externos)
