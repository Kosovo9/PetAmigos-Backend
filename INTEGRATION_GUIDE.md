# 🚀 GUÍA DE INTEGRACIÓN FRONTEND → BACKEND

## 📋 ENDPOINTS DISPONIBLES

### **BASE URL**
```
Local: http://localhost:5000/api
Producción: https://petmatch-backend.onrender.com/api
```

---

## 🔥 TOP 10 FEATURES - ENDPOINTS

### **1. 💬 CHAT MESSENGER**

#### Crear Conversación
```javascript
POST /api/chat/create
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  participants: ['userId1', 'userId2'],
  type: 'walker' | 'vet' | 'general'
}
```

#### Enviar Mensaje
```javascript
POST /api/chat/send
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  conversationId: 'string',
  message: 'string',
  type: 'text' | 'image' | 'location' | 'payment',
  metadata: { /* opcional */ }
}
```

#### Obtener Mensajes
```javascript
GET /api/chat/:conversationId
Headers: { Authorization: 'Bearer TOKEN' }
```

---

### **2. 🚨 MASCOTAS PERDIDAS**

#### Crear Alerta
```javascript
POST /api/geo/alert
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  petId: 'string',
  location: {
    type: 'Point',
    coordinates: [lng, lat]
  },
  radius: 5000, // metros
  description: 'string',
  photo: 'url'
}
```

#### Ver Alertas Cercanas
```javascript
GET /api/geo/nearby?lat=19.4326&lng=-99.1332&radius=5000
Headers: { Authorization: 'Bearer TOKEN' }
```

---

### **3. 🐕 PASEOS VERIFICADOS**

#### Check-in Biométrico
```javascript
POST /api/verification/biometric-checkin
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  userId: 'string',
  petId: 'string',
  biometricType: 'fingerprint' | 'facial',
  biometricData: 'base64_string'
}
```

#### Verificar Acceso Walker
```javascript
POST /api/verification/biometric-access
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  userId: 'string',
  petId: 'string',
  biometricType: 'fingerprint',
  biometricData: 'base64_string'
}
```

---

### **4. 🍖 NUTRICIÓN AI**

#### Generar Plan Nutricional
```javascript
POST /api/ai-creative/generate
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  userId: 'string',
  prompt: 'Plan nutricional para Golden Retriever de 3 años',
  style: 'professional',
  resolution: '1K' | '4K_MAX'
}
```

---

### **5. 💳 PAGOS**

#### Crear Sesión de Pago
```javascript
POST /api/pay/create-checkout-session
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  type: 'lifetime' | 'monthly',
  amount: 97.00,
  currency: 'USD'
}
```

#### Procesar Membresía Lifetime
```javascript
POST /api/pay/lifetime-membership
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  petId: 'string',
  paymentMethod: 'stripe' | 'mercadopago',
  amount: 97.00,
  currency: 'USD'
}
```

---

### **6. 🎨 AI PHOTO STUDIO**

#### Ver Love Stories
```javascript
GET /api/fusion/love-stories
```

#### Crear Love Story
```javascript
POST /api/fusion/love-stories
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  title: 'string',
  content: 'string',
  image: 'url'
}
```

---

### **7. ✈️ PETMATCH FLY**

#### Obtener Políticas de Aerolíneas
```javascript
GET /api/fusion/fly/policies
Response: {
  success: true,
  data: [
    {
      airline: 'Aeroméxico',
      cabinAllowed: true,
      maxWeight: '10kg',
      price: '135 USD',
      requirements: ['Cartilla vacunación', ...]
    }
  ]
}
```

---

### **8. 🌿 ESG & CARBONO**

#### Calcular Huella de Carbono
```javascript
POST /api/fusion/esg/calculate
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  petId: 'string',
  foodType: 'dry' | 'wet' | 'raw',
  weight: 25, // kg
  activityLevel: 'low' | 'medium' | 'high'
}
Response: {
  success: true,
  annualEmission: '45.5 kg CO2e',
  offsetPlan: {
    treesNeeded: 3,
    cost: 15,
    currency: 'USD'
  }
}
```

---

### **9. 💎 MICROINFLUENCERS**

#### Ver Dashboard
```javascript
GET /api/fusion/influencers/dashboard
Headers: { Authorization: 'Bearer TOKEN' }
Response: {
  success: true,
  data: {
    level: 'Pet Influencer',
    commissionRate: '20%',
    totalSales: 1540.50,
    earnings: 308.10,
    referralCode: 'PET-X10-LOVE'
  }
}
```

---

### **10. 🏥 VETERINARIAS**

#### Trigger Oferta de Servicio
```javascript
POST /api/sentry/trigger-offer
Headers: { Authorization: 'Bearer TOKEN' }
Body: {
  petId: 'string',
  currentMoodScore: 25 // < 30 activa venta
}
Response: {
  success: true,
  message: 'Oferta activada',
  offerType: 'Daycare_4_Hours',
  price: 59.99,
  urgency: 'HIGH'
}
```

---

## 🔐 AUTENTICACIÓN

### Signup
```javascript
POST /api/auth/signup
Body: {
  name: 'string',
  email: 'string',
  password: 'string'
}
Response: {
  result: { user },
  token: 'JWT_TOKEN'
}
```

### Signin
```javascript
POST /api/auth/signin
Body: {
  email: 'string',
  password: 'string'
}
Response: {
  result: { user },
  token: 'JWT_TOKEN'
}
```

---

## 📱 EJEMPLO DE USO EN REACT

```typescript
// src/lib/api.ts
import { apiEndpoint } from './config';

export async function fetchLoveStories() {
  const response = await fetch(apiEndpoint('/fusion/love-stories'));
  return response.json();
}

export async function createLostPetAlert(data: any, token: string) {
  const response = await fetch(apiEndpoint('/geo/alert'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function getAirlinePolicies() {
  const response = await fetch(apiEndpoint('/fusion/fly/policies'));
  return response.json();
}
```

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Instalar dependencias del cliente
2. ✅ Configurar variables de entorno
3. ✅ Crear páginas para cada feature
4. ✅ Testing local
5. ✅ Deploy a producción

---

## 📝 NOTAS IMPORTANTES

- **Todos los endpoints protegidos requieren** `Authorization: Bearer TOKEN`
- **El token se obtiene** en `/api/auth/signin` o `/api/auth/signup`
- **CORS ya está configurado** para `www.petmatch.fun`
- **Socket.io está activo** en el mismo puerto del backend

---

**Generado**: Noviembre 2024
**Backend URL**: https://petmatch-backend.onrender.com
**Dominio**: www.petmatch.fun
