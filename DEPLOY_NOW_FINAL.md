# 🚀 GUÍA DE DESPLIEGUE RÁPIDO (20 MINUTOS)

¡Socio! Todo está listo. El código está optimizado, el build pasa y tenemos todas las features conectadas.

Sigue estos pasos EXACTOS para estar en vivo en 20 minutos.

## 1. PREPARACIÓN FINAL (2 min)

Asegúrate de estar en la carpeta raíz del proyecto:
```bash
cd c:\PetAmigos_Wrold
```

## 2. DESPLIEGUE DEL BACKEND (Render) (8 min)

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** -> **Web Service**
3. Conecta tu repositorio de GitHub.
4. Configuración:
   - **Name**: `petmatch-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. **Environment Variables** (Copia estas de tu `.env` local):
   - `MONGO_URI`: (Tu conexión a MongoDB Atlas)
   - `JWT_SECRET`: (Tu secreto)
   - `STRIPE_SECRET_KEY`: (Tu llave de Stripe)
   - `OPENAI_API_KEY`: (Tu llave de OpenAI)
6. Click **Create Web Service**.

## 3. DESPLIEGUE DEL FRONTEND (Vercel) (8 min)

1. Instala Vercel CLI (si no lo tienes):
   ```bash
   npm i -g vercel
   ```
2. Ve a la carpeta del cliente:
   ```bash
   cd client
   ```
3. Ejecuta el comando de despliegue:
   ```bash
   vercel --prod
   ```
   - Acepta todo por defecto (Y/Enter).
4. Ve al dashboard de Vercel -> Settings -> Environment Variables.
   - Agrega: `NEXT_PUBLIC_API_URL` = `https://petmatch-backend.onrender.com/api` (La URL que te dio Render)

## 4. DOMINIO (2 min)

1. En Vercel, ve a **Settings** -> **Domains**.
2. Agrega `www.petmatch.fun`.
3. Vercel te dará unos registros DNS (CNAME/A).
4. Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.) y agrégalos.

---

## ✅ VERIFICACIÓN

Entra a `https://www.petmatch.fun` y verifica:
1. Que cargue el **Header** con navegación.
2. Que cargue el **Footer** con los logos de pago.
3. Que funcionen los links a `/chat`, `/christmas`, etc.

¡FELICIDADES SOCIO! 🎉
Estás en vivo con una plataforma nivel Fortune 500.
