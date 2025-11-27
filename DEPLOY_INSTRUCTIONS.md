# 🚀 INSTRUCCIONES DE DEPLOY - PETAMIGOS WORLD

**Usuario**: Kosovo9  
**Repositorio**: https://github.com/Kosovo9/PetAmigos-Backend

---

## 📋 SECUENCIA RECOMENDADA (La más eficiente)

### ✅ OPCIÓN 1: Subir código PRIMERO, luego configurar Render (RECOMENDADO)

**Ventajas**:
- Todo queda sincronizado desde el inicio
- Render puede hacer deploy inmediatamente después de configurar env vars
- Menos pasos de ida y vuelta

**Pasos**:
1. ✅ Hacer commit y push del código al repo
2. ✅ Configurar variables de entorno en Render
3. ✅ Render hace deploy automático

---

## 🔧 PASO 1: PREPARAR Y SUBIR CÓDIGO A GITHUB

### 1.1 Verificar que no hay archivos sensibles

```bash
# Verificar que .env no está en el repo
git status
```

**Asegúrate de que estos archivos NO estén en el commit**:
- `server/.env`
- `client/.env`
- Cualquier archivo con passwords o API keys

### 1.2 Hacer commit inicial

```bash
# Agregar todos los archivos del proyecto
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: implementación completa de PetAmigos World - Backend con 7 Pilares, Frontend React, y toda la infraestructura de monetización"

# Verificar el commit
git log --oneline -1
```

### 1.3 Conectar con GitHub y hacer push

```bash
# Si es la primera vez, agregar el remote
git remote add origin https://github.com/Kosovo9/PetAmigos-Backend.git

# Verificar el remote
git remote -v

# Hacer push al branch main
git branch -M main
git push -u origin main
```

**Si el repo ya existe y tiene contenido**:
```bash
# Hacer pull primero para sincronizar
git pull origin main --allow-unrelated-histories

# Resolver conflictos si los hay, luego:
git push -u origin main
```

---

## 🔧 PASO 2: CONFIGURAR VARIABLES DE ENTORNO EN RENDER

Una vez que el código esté en GitHub:

### 2.1 Ir a Render Dashboard

1. Ve a: https://dashboard.render.com
2. Selecciona tu servicio: **PetAmigos-Backend**
3. Ve a **Settings** → **Environment**

### 2.2 Agregar Variables de Entorno

Agrega estas variables **UNA POR UNA** (sin comillas):

```env
MONGODB_URI=mongodb+srv://petamigos_user:PetAmig0s2025!W0rld#Secure@cluster0.baflqoq.mongodb.net/petamigos?retryWrites=true&w=majority

JWT_SECRET=PetAmigosJWT2025SecureTokenKey!Kosovo9#

NODE_ENV=production

PORT=5000

CLIENT_URL=https://tu-frontend.vercel.app
```

**⚠️ IMPORTANTE**: 
- El password de MongoDB tiene caracteres especiales (`#`). Asegúrate de copiarlo exactamente.
- Si Render muestra error con el `#`, puedes URL-encode el password: `%23` en lugar de `#`

### 2.3 Verificar Build Commands

En **Settings** → **Build & Deploy**:

- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Root Directory**: (dejar vacío o poner `.`)

---

## 🔧 PASO 3: VERIFICAR DEPLOY

### 3.1 Revisar Logs de Render

1. Ve a **Logs** en Render
2. Debes ver:
   ```
   ✅ BD Conectada
   🚀 Server en puerto 5000
   ```

### 3.2 Probar Health Check

```bash
curl https://tu-backend.onrender.com/health
```

**Respuesta esperada**:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45
}
```

---

## ⚠️ TROUBLESHOOTING

### Error: "Cannot find module"
- Verifica que `package.json` esté en `server/package.json`
- Verifica que Build Command sea: `cd server && npm install`

### Error: "MongoDB connection failed"
- Verifica que MONGODB_URI esté correctamente copiado
- Verifica que el password no tenga espacios extra
- Si el `#` causa problemas, URL-encode: `%23`

### Error: "JWT_SECRET is not defined"
- Verifica que JWT_SECRET esté en las variables de entorno
- Debe tener mínimo 32 caracteres

### El deploy se queda en "Building"
- Revisa los logs de build
- Verifica que todas las dependencias estén en `package.json`

---

## ✅ CHECKLIST FINAL

- [ ] Código subido a GitHub (commit y push exitoso)
- [ ] Variables de entorno configuradas en Render
- [ ] Build Command: `cd server && npm install`
- [ ] Start Command: `cd server && npm start`
- [ ] Deploy exitoso en Render
- [ ] Health check respondiendo
- [ ] Logs muestran "✅ BD Conectada"

---

**¿Listo para empezar?** Ejecuta los comandos del Paso 1 y avísame cuando termines. 🔥

