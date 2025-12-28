# 🚀 DEPLOYMENT RÁPIDO - 10 MINUTOS

## ✅ Estado: LISTO PARA DEPLOYMENT

---

## 📋 CHECKLIST DE 3 PASOS

### ☐ PASO 1: Base de Datos (5 min)
1. Ir a **https://planetscale.com** → Sign up (gratis)
2. Click **"New database"** → Nombre: `petmatch`
3. Click **"Connect"** → Copiar **Connection String**
4. Ejecutar en terminal:
```bash
# Actualizar .env con tu DATABASE_URL
# DATABASE_URL="mysql://usuario:password@host/petmatch"

pnpm db:push
```

---

### ☐ PASO 2: Frontend en Netlify (3 min)
1. Ir a **https://app.netlify.com** → Login con GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Seleccionar tu repositorio
4. **Build settings**:
   - Build command: `pnpm install && pnpm build`
   - Publish directory: `dist/public`
5. **Environment variables** (agregar):
   ```
   VITE_API_URL = https://tu-backend.onrender.com
   ```
6. Click **"Deploy site"**

---

### ☐ PASO 3: Backend en Render (2 min)
1. Ir a **https://render.com** → Sign up (gratis)
2. Click **"New +"** → **"Web Service"**
3. Conectar tu repositorio de GitHub
4. **Configuración**:
   - Name: `petmatch-backend`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
5. **Environment variables** (agregar):
   ```
   DATABASE_URL = <tu-planetscale-connection-string>
   JWT_SECRET = <generar-secreto-32-caracteres>
   NODE_ENV = production
   PORT = 3000
   ```
6. Click **"Create Web Service"**

---

## 🎯 DESPUÉS DEL DEPLOYMENT

### Actualizar Frontend con URL del Backend
1. En Netlify → Site settings → Environment variables
2. Actualizar `VITE_API_URL` con la URL de Render
3. Trigger redeploy

### Verificar
- ✅ Frontend carga: `https://tu-sitio.netlify.app`
- ✅ Backend responde: `https://tu-backend.onrender.com`
- ✅ No hay errores en consola

---

## 🔑 GENERAR JWT_SECRET

```bash
# En terminal, ejecutar:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 💡 TIPS

- **PlanetScale**: Gratis hasta 5GB
- **Netlify**: Gratis hasta 100GB bandwidth/mes
- **Render**: Gratis 750 horas/mes (suficiente para 1 servicio 24/7)

---

## 🆘 AYUDA

Si algo falla, revisar:
- `DEPLOYMENT_SUMMARY.md` - Resumen ejecutivo
- `NETLIFY_DEPLOYMENT_CHECKLIST.md` - Guía detallada
- `.env.example` - Variables de entorno

---

**Tiempo total: ~10 minutos**  
**Costo: $0/mes** 🎉
