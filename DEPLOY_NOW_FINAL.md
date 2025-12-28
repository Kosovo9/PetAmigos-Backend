# 🚀 GUÍA DE DESPLIEGUE RÁPIDO (20 MINUTOS)

¡Socio! Todo está listo. El código está optimizado, el build pasa y tenemos todas las features conectadas.

Sigue estos pasos EXACTOS para estar en vivo en 20 minutos.

## 1. PREPARACIÓN FINAL (2 min)

Asegúrate de estar en la carpeta raíz del proyecto:
```bash
cd "c:\Pet Amigos final\PetAmigos-Backend"
```

## 2. DESPLIEGUE DEL BACKEND (Render) (8 min)

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** -> **Web Service**
3. Conecta tu repositorio de GitHub `Kosovo9/PetAmigos-Backend`.
4. Configuración:
   - **Name**: `petmatch-backend`
   - **Root Directory**: (dejar vacío para usar la raíz)
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
5. **Environment Variables** (Copia estas de tu `.env` local):
   - `DATABASE_URL`: (Tu conexión a TiDB Cloud/MySQL)
   - `JWT_SECRET`: `80fecfadfe7fb389b6ee05054faa7b00872ab767b0f325557def6f94abc3d07d`
   - `NODE_ENV`: `production`
6. Click **Create Web Service**.

## 3. DESPLIEGUE DEL FRONTEND (Netlify) (8 min)

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Click **Add new site** -> **Import an existing project**.
3. Conecta con GitHub y selecciona `Kosovo9/PetAmigos-Backend`.
4. **Configuración del Build**:
   - **Build Command**: `pnpm install && pnpm build`
   - **Publish Directory**: `dist/public`
5. **Environment Variables** (En Site Settings -> Environment Variables):
   - Agrega: `VITE_API_URL` = `https://petmatch-backend.onrender.com/api` (La URL que te dio Render)
6. Click **Deploy site**.

## 4. DOMINIO (2 min)

1. En Netlify, ve a **Domain Settings**.
2. Agrega `www.petmatch.fun`.
3. Netlify te dará la configuración DNS.
4. Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.) y apunta el CNAME a la URL de Netlify.

---

## ✅ VERIFICACIÓN

Entra a `https://www.petmatch.fun` y verifica:
1. Que cargue el **Header** con navegación.
2. Que cargue el **Footer** con los logos de pago.
3. Que funcionen los links a `/chat`, `/christmas`, etc.

¡FELICIDADES SOCIO! 🎉
Estás en vivo con una plataforma nivel Fortune 500 en Netlify.
