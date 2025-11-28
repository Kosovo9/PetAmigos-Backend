# 🚀 DEPLOY GUIDE - PETMATCH.FUN

## ⚡ DEPLOY RÁPIDO (15 MINUTOS)

### **PASO 1: BACKEND (Ya está listo)**
✅ Backend corriendo en `http://localhost:5000`
✅ Todos los endpoints funcionando
✅ CORS configurado para `www.petmatch.fun`

**Próximo paso:** Deploy a Render

---

### **PASO 2: FRONTEND (Next.js)**

#### 2.1 Instalar Dependencias
```bash
cd client
npm install
```

#### 2.2 Configurar Variables de Entorno
Crear `client/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://petmatch-backend.onrender.com/api
NEXT_PUBLIC_DOMAIN=www.petmatch.fun
```

#### 2.3 Build Local (Testing)
```bash
npm run build
npm start
```

Verificar en `http://localhost:3000`

---

### **PASO 3: DEPLOY A VERCEL**

#### Opción A: CLI (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod
```

#### Opción B: GitHub + Vercel Dashboard
1. Push a GitHub
2. Conectar repo en vercel.com
3. Configurar:
   - **Framework**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

---

### **PASO 4: CONFIGURAR DOMINIO**

#### En Vercel:
1. Settings → Domains
2. Add Domain: `www.petmatch.fun`
3. Copiar DNS records

#### En Cloudflare:
1. DNS → Add Record
2. Type: `CNAME`
3. Name: `www`
4. Target: `cname.vercel-dns.com`
5. Proxy: OFF (naranja → gris)

---

### **PASO 5: DEPLOY BACKEND A RENDER**

#### 5.1 Crear Servicio en Render
1. New → Web Service
2. Connect GitHub: `Kosovo9/PetAmigos-Backend`
3. Configurar:
   - **Name**: petmatch-backend
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### 5.2 Variables de Entorno en Render
```env
MONGODB_URI=mongodb+srv://petamigos_user:PetAmig0s2025!W0rld#Secure@cluster0.baflqoq.mongodb.net/petamigos
JWT_SECRET=PetAmigosJWT2025SecureTokenKey!Kosovo9#
NODE_ENV=production
PORT=5000
CLIENT_URL=https://www.petmatch.fun
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=AIzaSyBMkW3pRLTYV_5OLlYxNgd4-YBoN5vk3Tc
```

#### 5.3 Custom Domain en Render
1. Settings → Custom Domains
2. Add: `api.petmatch.fun`
3. Configurar CNAME en Cloudflare

---

## 🧪 TESTING CHECKLIST

### Backend
- [ ] Health check: `curl https://api.petmatch.fun/health`
- [ ] Fusion endpoints: `curl https://api.petmatch.fun/api/fusion/fly/policies`
- [ ] Auth: `POST https://api.petmatch.fun/api/auth/signup`

### Frontend
- [ ] Home page carga: `https://www.petmatch.fun`
- [ ] Chat page: `https://www.petmatch.fun/chat`
- [ ] Christmas: `https://www.petmatch.fun/christmas`

---

## 🎯 PROMOCIÓN DE LANZAMIENTO

### Primeras 24 Horas
```
🎉 LANZAMIENTO PETMATCH.FUN 🎉

✨ Primeras 24 horas: 100% GRATIS
🎄 Genera fotos navideñas ilimitadas
🐾 Acceso a todas las features

Comparte con amigos y gana créditos!
www.petmatch.fun
```

### Redes Sociales
- **Facebook**: Grupo de mascotas
- **Instagram**: #ChristmasPets #PetMatchFun
- **TikTok**: Videos de antes/después
- **WhatsApp**: Compartir con grupos de mascotas

---

## 📊 MONITOREO POST-DEPLOY

### Métricas Clave
- Usuarios registrados
- Fotos generadas
- Conversiones (free → paid)
- Tráfico por feature

### Tools
- Vercel Analytics (incluido)
- Render Metrics (incluido)
- Google Analytics (agregar)

---

## 🔥 TROUBLESHOOTING

### Error: "API not responding"
- Verificar que Render service esté activo
- Check CORS en `server.js`
- Verificar `NEXT_PUBLIC_API_URL` en frontend

### Error: "MongoDB connection failed"
- Verificar `MONGODB_URI` en Render
- Check IP whitelist en MongoDB Atlas

### Error: "Domain not resolving"
- Esperar propagación DNS (hasta 48h)
- Verificar CNAME en Cloudflare
- Proxy OFF en Cloudflare

---

## ✅ CHECKLIST FINAL

- [ ] Backend deployed a Render
- [ ] Frontend deployed a Vercel
- [ ] Dominio `www.petmatch.fun` configurado
- [ ] Variables de entorno configuradas
- [ ] Testing de 10 features principales
- [ ] Promoción de lanzamiento lista
- [ ] Monitoreo activo

---

**Tiempo Estimado Total**: 15-30 minutos
**Costo Mensual**: $0 (Vercel + Render free tier)
**Escalabilidad**: Automática

¡VAMOS POR ESOS BILLONES, SOCIO! 🚀💎
