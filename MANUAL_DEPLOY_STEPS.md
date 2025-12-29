# 🚀 GUÍA DE DESPLIEGUE FINAL (PETAMIGOS)

**Estado Actual:**
- **Backend (Render):** ✔️ Código corregido (dependencia `uuid` añadida, ESM habilitado). El despliegue automático debería estar en curso o completado.
- **Frontend (Netlify):** ✔️ Código configurado (`netlify.toml` corregido para Next.js). Listo para conectar.

Debido a una limitación temporal del sistema automatizado, por favor completa estos 3 pasos finales manualmente.

## PASO 1: Verificar Backend
1. Ve a [Render Dashboard](https://dashboard.render.com/).
2. Busca el servicio **PetAmigos-Backend**.
3. Verifica que el estado sea **"Live"**.
4. Copia la **URL del Servicio** (ej. `https://petamigos-backend.onrender.com`).

## PASO 2: Crear Frontend en Netlify
1. Ve a [Netlify - Crear Nuevo Sitio](https://app.netlify.com/start).
2. Selecciona **GitHub**.
3. Busca y selecciona el repositorio: `Kosovo9/PetAmigos-Backend`.
4. Configura **EXACTAMENTE** así:
   - **Base directory:** `client`  <-- ¡ESTO ES CRUCIAL!
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Haz clic en **"Advanced"** y añade estas variables:

| Key | Value |
|-----|-------|
| `BUILT_IN_FORGE_API_URL` | *(Pega la URL de Render del Paso 1)* |
| `VITE_APP_ID` | `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://twjamqzehtterpgiqhus.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3amFtcXplaHR0ZXJwZ2lxaHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NDE2MTgsImV4cCI6MjA4MjAxNzYxOH0.npkBGzilSCp2GWaVUZvVthmklwgba61D-nvYuVhFcK8` |

6. Haz clic en **"Deploy site"**.

## PASO 3: Validación Final
1. Espera a que Netlify diga "Published" (aprox 2 min).
2. Abre la URL que te da Netlify (ej. `https://random-name.netlify.app`).
3. ¡Tu plataforma PetAmigos está viva! 🚀
