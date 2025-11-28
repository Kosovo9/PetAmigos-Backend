# 🔑 GUÍA PARA OBTENER TODAS LAS API KEYS
## Variables de Entorno Faltantes en Render

---

## 📋 RESUMEN DE KEYS NECESARIAS

### ✅ YA CONFIGURADAS EN RENDER:
1. ✅ `CLIENT_URL` - https://www.petmatch.fun
2. ✅ `JWT_SECRET` - (ya configurado)
3. ✅ `MONGODB_URI` - (ya configurado)
4. ✅ `NODE_ENV` - production
5. ✅ `PORT` - (auto-asignado por Render)

### ❌ FALTANTES (CRÍTICAS):
6. ❌ `SUPABASE_URL`
7. ❌ `SUPABASE_ANON_KEY`
8. ❌ `SUPABASE_SERVICE_KEY`
9. ❌ `STRIPE_SECRET_KEY`
10. ❌ `STRIPE_PUBLISHABLE_KEY`
11. ❌ `OPENAI_API_KEY` (opcional)

---

## 🔐 CÓMO OBTENER CADA KEY

### 1. SUPABASE KEYS (3 keys)

#### Paso 1: Ir a Supabase Dashboard
```
URL: https://supabase.com/dashboard
```

#### Paso 2: Seleccionar tu proyecto
- Si no ves proyectos, crea uno nuevo:
  - Click en "New Project"
  - Nombre: `PetMatch`
  - Database Password: (guarda esta contraseña)
  - Region: `South America (São Paulo)` (más cercano a LATAM)
  - Click "Create new project"

#### Paso 3: Obtener las Keys
Una vez en el proyecto:

1. **SUPABASE_URL**:
   - Ve a: `Settings` → `API`
   - Copia: `Project URL`
   - Ejemplo: `https://rxusmugszksdowppphnw.supabase.co`

2. **SUPABASE_ANON_KEY**:
   - En la misma página (`Settings` → `API`)
   - Copia: `anon` `public` key
   - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **SUPABASE_SERVICE_KEY**:
   - En la misma página (`Settings` → `API`)
   - Copia: `service_role` key (⚠️ SECRETA, nunca exponerla)
   - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### 2. STRIPE KEYS (2 keys)

#### Paso 1: Ir a Stripe Dashboard
```
URL: https://dashboard.stripe.com/
```

#### Paso 2: Cambiar a modo TEST
- En la esquina superior derecha, asegúrate de que diga "Test mode"
- Si dice "Live mode", cambia a "Test mode"

#### Paso 3: Obtener las Keys
1. **STRIPE_SECRET_KEY**:
   - Ve a: `Developers` → `API keys`
   - Copia: `Secret key` (empieza con `sk_test_...`)
   - Si no ves la key completa, click en "Reveal test key"
   - Ejemplo: `sk_test_51Pn4CpLs6SKtSyaK...`

2. **STRIPE_PUBLISHABLE_KEY**:
   - En la misma página (`Developers` → `API keys`)
   - Copia: `Publishable key` (empieza con `pk_test_...`)
   - Ejemplo: `pk_test_51Pn4CpLs6SKtSyaK...`

---

### 3. OPENAI API KEY (1 key - OPCIONAL)

#### Paso 1: Ir a OpenAI Platform
```
URL: https://platform.openai.com/
```

#### Paso 2: Crear cuenta o iniciar sesión
- Si no tienes cuenta, crea una
- Verifica tu email y teléfono

#### Paso 3: Obtener la Key
1. **OPENAI_API_KEY**:
   - Ve a: `API keys` (en el menú lateral)
   - Click en: `Create new secret key`
   - Nombre: `PetMatch Backend`
   - Copia la key INMEDIATAMENTE (solo se muestra una vez)
   - Ejemplo: `sk-proj-...`

#### Nota sobre costos:
- OpenAI cobra por uso
- Primeros $5 USD gratis (nuevas cuentas)
- Después: ~$0.002 por imagen generada
- Puedes usar Gemini (gratis) en su lugar

---

## 🚀 CÓMO AGREGAR LAS KEYS A RENDER

### Opción A: Desde el Dashboard (Recomendado)

1. Ve a: https://dashboard.render.com/
2. Selecciona tu servicio backend
3. Ve a: `Environment` (en el menú lateral)
4. Click en: `Add Environment Variable`
5. Para cada key:
   - **Key**: Nombre de la variable (ej: `SUPABASE_URL`)
   - **Value**: El valor copiado
   - Click `Save Changes`

### Opción B: Desde el archivo .env (Local)

Si prefieres usar un archivo, crea `.env` en `/server`:

```bash
# Supabase
SUPABASE_URL=https://rxusmugszksdowppphnw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_51Pn4CpLs6SKtSyaK...
STRIPE_PUBLISHABLE_KEY=pk_test_51Pn4CpLs6SKtSyaK...

# OpenAI (opcional)
OPENAI_API_KEY=sk-proj-...
```

⚠️ **IMPORTANTE**: Nunca subas este archivo a GitHub. Está en `.gitignore`.

---

## ✅ VERIFICACIÓN

Después de agregar las keys en Render:

1. El servicio se redesplegará automáticamente
2. Espera 2-3 minutos
3. Verifica los logs en Render:
   - Deberías ver: `✅ BD Conectada`
   - Deberías ver: `🚀 Server en puerto 10000` (o el puerto asignado)
4. Prueba el backend:
   ```bash
   curl https://cd-server-andand-npm-install.onrender.com/
   ```
   - Debería responder (aunque sea con 404)

---

## 🔧 TROUBLESHOOTING

### Si el deploy sigue fallando:

1. **Verifica los logs completos** en Render
2. **Busca errores** como:
   - `Cannot find module '@supabase/supabase-js'` → Ya lo arreglamos
   - `SUPABASE_URL is not defined` → Falta agregar la key
   - `Connection refused` → Problema de MongoDB

3. **Verifica que TODAS las keys estén configuradas**:
   - Ve a Render → Environment
   - Cuenta: Deberías tener 12-13 variables

4. **Si nada funciona**:
   - Crea un `server.js` mínimo para probar:
   ```javascript
   const express = require('express');
   const app = express();
   const PORT = process.env.PORT || 3000;
   
   app.get('/', (req, res) => {
     res.json({ 
       status: 'LIVE', 
       supabase: !!process.env.SUPABASE_URL,
       stripe: !!process.env.STRIPE_SECRET_KEY 
     });
   });
   
   app.listen(PORT, () => console.log(`Server on ${PORT}`));
   ```

---

## 📞 SOPORTE

Si tienes problemas obteniendo las keys:

### Supabase:
- Docs: https://supabase.com/docs/guides/api
- Support: support@supabase.io

### Stripe:
- Docs: https://stripe.com/docs/keys
- Support: https://support.stripe.com/

### OpenAI:
- Docs: https://platform.openai.com/docs/api-reference
- Support: https://help.openai.com/

---

**¡Una vez que tengas todas las keys, el backend funcionará al 100%!** 🚀

*Guía creada por: Antigravity AI*  
*Fecha: 2025-11-28*
