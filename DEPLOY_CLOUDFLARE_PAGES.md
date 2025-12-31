# 🚀 GUÍA DE DESPLIEGUE: PETMATCH FRONTEND (Cloudflare Pages)

Esta guía está actualizada y verificada con el build local exitoso (`dist/public`).

## ✅ 1. PREPARACIÓN (Ya realizada por Antigravity)
*   **`wrangler.toml`**: Creado en la raíz.
*   **Scripts de Build**: Verificados en `package.json` (`build:pages`).
*   **Build Local**: Probado exitosamente.

---

## 🌩️ 2. DESPLIEGUE EN CLOUDFLARE PAGES (Paso a Paso)

Sigue estos pasos EXACTOS en el Dashboard de Cloudflare. Hemos optimizado la configuración para usar el build de Vite que ya sabemos que funciona.

1.  **Ir a Cloudflare Dashboard**: [dash.cloudflare.com](https://dash.cloudflare.com)
2.  **Menú**: Workers & Pages > **Create Application** > **Pages** > **Connect to Git**.
3.  **Repositorio**: Selecciona `Kosovo9/PetAmigos-Backend`.
4.  **Configuración del Proyecto (IMPORTANTE)**:

    *   **Project Name**: `petmatch-frontend`
    *   **Production Branch**: `main`
    *   **Framework Preset**: `None` (Personalizado)
    *   **Build Command**: `pnpm install && pnpm run build:pages`
    *   **Build Output Directory**: `dist/public`
    *   **Root Directory**: `/` (Déjalo vacío o en la raíz)

5.  **Variables de Entorno** (Environment Variables):
    *   `VITE_API_URL` = `https://petamigos-backend.onrender.com` (o la URL que te dé Render)
    *   `NODE_VERSION` = `20` (Recomendado para pnpm/vite recientes, o `18`)
    *   `VITE_CLERK_PUBLISHABLE_KEY` = `[TU_CLAVE_DE_CLERK]`

6.  **Click**: `Save and Deploy`.

---

## 🔧 3. DESPLIEGUE DEL BACKEND (Render)

(Como estaba planeado, sin cambios)

1.  **Ir a Render**: [dashboard.render.com](https://dashboard.render.com)
2.  **New Web Service** > Conectar `Kosovo9/PetAmigos-Backend`.
3.  **Configuración**:
    *   **Runtime**: Node
    *   **Build Command**: `pnpm install && pnpm build` (o `npm install && npm run build`)
    *   **Start Command**: `pnpm start` (o `npm start`)
    *   **Root Directory**: `/`
4.  **Variables de Entorno**: Configura todas las del `.env` (DATABASE_URL, JWT_SECRET, etc.).

---

## 🌐 4. DNS (Después del Deploy)

1.  En Cloudflare Pages > Custom Domains.
2.  Agrega `petmatch.fun` y `www.petmatch.fun`.
3.  Cloudflare configurará los DNS automáticamente si gestionas el dominio allí.

---

### ❓ ¿Por qué estos ajustes?
El análisis mostró que tu build exitoso es con **Vite** en la raíz. La configuración de Next.js (`cd client...`) podría fallar o requerir ajustes complejos (`next-on-pages`). Esta configuración usa el build estático `dist/public` que ya verificamos que funciona al 100%.
