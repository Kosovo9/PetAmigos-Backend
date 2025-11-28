# 🎨 GUÍA DE USO: GENERADOR DE FOTOS NAVIDEÑAS CON IA

## 📸 Sistema Multi-Engine de PetMatch

Tu plataforma usa **3 engines de IA** con fallback automático:

### Engines Disponibles:
1. **Google AI** (Gemini 2.0 Flash) - GRATIS ✅
2. **Higgsfield.ai** (Nano Banana) - PREMIUM 💎
3. **Hugging Face** (Stable Diffusion XL) - FALLBACK 🤗

---

## 🚀 CÓMO FUNCIONA

### Flujo Completo:
```
Usuario sube foto → Frontend → Backend API → ImageGenerationService
                                                      ↓
                                    Intenta Google AI (gratis)
                                                      ↓
                                    Si falla → Higgsfield (pro)
                                                      ↓
                                    Si falla → Hugging Face
                                                      ↓
                                    WatermarkService (agrega marca)
                                                      ↓
                                    StorageService (sube a Supabase)
                                                      ↓
                                    Retorna URL al usuario
```

---

## 📝 EJEMPLO DE USO (Frontend)

### Opción 1: Usando la página `/generate`

```typescript
// Ya está implementado en: client/src/app/generate/page.tsx

// 1. Usuario sube fotos con PhotoUploader
<PhotoUploader 
    onPhotosChange={setPhotos}
    maxPhotos={5}
    language="es"
/>

// 2. Selecciona escenario navideño
const scenarios = [
    'christmas-forest',
    'santa-studio', 
    'winter-wonderland',
    'cozy-fireplace'
];

// 3. Genera la foto
const generatePhoto = async () => {
    const formData = new FormData();
    photos.forEach((photo, i) => {
        formData.append(`photo${i}`, photo);
    });
    formData.append('scenario', 'christmas-forest');
    formData.append('style', 'christmas');
    
    const response = await fetch('/api/photos/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    
    const data = await response.json();
    // data.imageUrl contiene la foto generada
};
```

---

## 🔧 CONFIGURACIÓN REQUERIDA

### Variables de Entorno (.env):

```env
# Google AI (GRATIS - Recomendado)
GOOGLE_AI_API_KEY=tu_api_key_aqui

# Higgsfield (PREMIUM - Opcional)
HIGGSFIELD_API_KEY=tu_api_key_aqui

# Hugging Face (GRATIS - Fallback)
HUGGINGFACE_TOKEN=tu_token_aqui

# Supabase (Para almacenamiento)
SUPABASE_URL=tu_url_aqui
SUPABASE_KEY=tu_key_aqui
```

### Cómo Obtener las API Keys:

1. **Google AI**: https://makersuite.google.com/app/apikey
2. **Higgsfield**: https://higgsfield.ai/api
3. **Hugging Face**: https://huggingface.co/settings/tokens

---

## 🎯 EJEMPLO REAL: COLLIE EN BOSQUE NAVIDEÑO

### Request al Backend:

```javascript
POST https://petmatch-backend.onrender.com/api/photos/generate

Headers:
{
    "Authorization": "Bearer YOUR_JWT_TOKEN",
    "Content-Type": "multipart/form-data"
}

Body (FormData):
{
    photo0: [File: collie.jpg],
    scenario: "christmas-forest-sunset",
    style: "christmas",
    prompt: "A beautiful Rough Collie dog with brown and white fur standing majestically in a snowy Christmas forest at sunset. The scene shows a magical winter wonderland with snow-covered pine trees, gentle snowflakes falling, warm golden sunset light filtering through the trees creating a dreamy atmosphere.",
    quality: "8K",
    petSpecies: "dog",
    petBreed: "Rough Collie"
}
```

### Response Esperada:

```json
{
    "success": true,
    "photoId": "507f1f77bcf86cd799439011",
    "imageUrl": "https://supabase.co/storage/v1/object/public/...",
    "hasWatermark": true,
    "engine": "google-ai",
    "quality": "4K",
    "creditsRemaining": 4,
    "expiresAt": "2025-12-05T12:00:00.000Z",
    "message": "💎 Actualiza a Premium para remover la marca de agua"
}
```

---

## 🎨 CARACTERÍSTICAS DEL PHOTOUPLODER

### Funcionalidades Implementadas:

✅ **Subir hasta 5 fotos**
✅ **Reemplazar fotos individuales** (botón de refresh)
✅ **Eliminar fotos** (botón X)
✅ **Análisis de calidad automático** (detecta fotos borrosas/oscuras)
✅ **Mensajes en 3 idiomas** (ES, EN, FR)
✅ **Consejos de calidad** antes de subir

### Mensajes de Calidad:

**Español:**
- ✨ Usa buena iluminación natural o artificial
- 🎯 Asegúrate de que la foto no esté borrosa
- 🚫 Evita obstáculos que cubran a tu mascota
- 📐 Toma la foto de frente o de perfil
- 🌟 Fondos simples funcionan mejor

---

## 💰 SISTEMA DE CRÉDITOS

### Usuarios FREE:
- 5 créditos iniciales
- 1 crédito = 1 foto generada
- Fotos con watermark
- Expiran en 7 días

### Usuarios PREMIUM:
- Créditos ilimitados
- Sin watermark
- Calidad 8K (Higgsfield priority)
- No expiran

---

## 🔍 DETECCIÓN AUTOMÁTICA DE MASCOTAS

El sistema puede identificar automáticamente:
- Especie (perro, gato, ave, etc.)
- Raza (si es reconocible)
- Número de mascotas en la foto
- Calidad de la imagen

Esto se usa para optimizar el prompt de generación.

---

## 🚀 TESTING LOCAL

### 1. Iniciar Backend:
```bash
cd server
npm install
npm start
```

### 2. Ejecutar Test:
```bash
node test_photo_generation.js
```

### 3. Ver Resultado:
El archivo `generated_collie_christmas.jpg` se guardará en la raíz del proyecto.

---

## 📱 ACCESO DESDE FRONTEND

### URL de Producción:
```
https://www.petmatch.fun/generate
```

### Flujo de Usuario:
1. Usuario entra a `/generate`
2. Sube foto(s) de su mascota
3. Selecciona escenario navideño
4. Click en "Generar Foto Navideña"
5. Espera 10-30 segundos
6. Ve el resultado con watermark
7. Puede descargar o compartir
8. Si quiere sin watermark → Upgrade a Premium

---

## 🎁 PRÓXIMAS MEJORAS

- [ ] Generación de videos con Sora (solo Premium)
- [ ] Batch generation (múltiples fotos a la vez)
- [ ] Estilos personalizados
- [ ] Editor de fotos integrado
- [ ] Galería de fotos generadas

---

**Última Actualización**: 2025-11-28
**Versión**: 2.0 - Christmas Edition
