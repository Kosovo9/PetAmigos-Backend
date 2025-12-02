# 🧪 CHECKLIST DE PRUEBAS EXHAUSTIVAS - PETMATCH $1 USD
**Fecha:** 2025-12-01 22:13  
**Modo:** TEST_DOLLAR (Todo cuesta $1)  
**Objetivo:** Validar 20 puntos críticos antes del lanzamiento

---

## ✅ FASE 1: VERIFICACIÓN VISUAL (Pruebas 1-5)

### ✓ Prueba #1: Banner Eliminado
- [ ] Abre `https://www.petmatch.fun` en **ventana incógnita**
- [ ] Espera 5 segundos
- [ ] **RESULTADO ESPERADO:** NO debe aparecer el banner "Working on it..."
- [ ] **SI FALLA:** Hard refresh (`Ctrl+Shift+R`) y espera 2 min más

### ✓ Prueba #2: Página Principal Carga
- [ ] La página carga completamente
- [ ] Ves el fondo cósmico navideño
- [ ] No hay errores en DevTools Console (F12)
- [ ] **RESULTADO ESPERADO:** Página limpia, sin errores

### ✓ Prueba #3: Login/Signup Funciona
- [ ] Click en "Login" o "Sign Up"
- [ ] Crea una cuenta nueva: `test1@petmatch.fun` / `Test123!`
- [ ] O usa super-admin: `admin@petmatch.fun` / `AdminPower2025!Secure`
- [ ] **RESULTADO ESPERADO:** Login exitoso, redirige a dashboard o home

### ✓ Prueba #4: Galería de Prompts Visible
- [ ] Ve a `https://www.petmatch.fun/prompts`
- [ ] Espera 3 segundos
- [ ] **RESULTADO ESPERADO:** Ves 100+ prompts en grid
- [ ] Categorías: "LinkedIn", "Social", "Seasonal", etc.
- [ ] **SI FALLA:** Corre `node scripts/seed_social_profiles.js` en backend

### ✓ Prueba #5: Filtros y Búsqueda Funcionan
- [ ] Click en categoría "LinkedIn"
- [ ] Solo muestra prompts de LinkedIn
- [ ] Escribe "dog" en búsqueda
- [ ] Solo muestra prompts con perros
- [ ] **RESULTADO ESPERADO:** Filtros funcionan correctamente

---

## 💳 FASE 2: FLUJO DE PAGO (Pruebas 6-12)

### ✓ Prueba #6: Botón de Pago Aparece
- [ ] Click en cualquier prompt (ej. "LinkedIn: Tech CEO con Golden Retriever")
- [ ] Scroll hasta el final
- [ ] **RESULTADO ESPERADO:** Ves botón amarillo **"Pay $1 & Generate Image"**
- [ ] **SI NO APARECE:** Verifica que `user.credits === 0` en MongoDB

### ✓ Prueba #7: Checkout Se Abre
- [ ] Click en "Pay $1 & Generate Image"
- [ ] Espera 2 segundos
- [ ] **RESULTADO ESPERADO:** Redirige a `checkout.stripe.com`
- [ ] Ves formulario de pago de Stripe
- [ ] Monto: **$1.00 USD**
- [ ] **SI FALLA:** Abre DevTools → Network → busca error en `/api/pay/create-checkout`

### ✓ Prueba #8: Pago con Tarjeta de Prueba
- [ ] Número: `4242 4242 4242 4242`
- [ ] Fecha: `12/34`
- [ ] CVC: `123`
- [ ] ZIP: `12345`
- [ ] Email: tu email de prueba
- [ ] Click en "Pay"
- [ ] **RESULTADO ESPERADO:** Pago se procesa, loading spinner

### ✓ Prueba #9: Redirect a Success
- [ ] Espera 3-5 segundos
- [ ] **RESULTADO ESPERADO:** Redirige a `https://www.petmatch.fun/payment/success`
- [ ] Ves mensaje "✅ Payment Successful!"
- [ ] **SI FALLA:** Verifica `success_url` en `paymentController.js`

### ✓ Prueba #10: Webhook Suma Crédito
- [ ] Espera 3 segundos en `/payment/success`
- [ ] Redirige automáticamente a `/prompts`
- [ ] **VERIFICA EN MONGODB:**
  - [ ] Ve a Atlas → Database → Users → busca tu usuario
  - [ ] Campo `credits` debe ser `1` (era `0` antes)
- [ ] **VERIFICA EN STRIPE:**
  - [ ] Dashboard → Payments → último pago debe estar "Succeeded"
  - [ ] Webhooks → Events → debe haber `checkout.session.completed`
- [ ] **RESULTADO ESPERADO:** Crédito sumado correctamente

### ✓ Prueba #11: Botón Cambia a "Generate"
- [ ] Vuelve a `/prompts`
- [ ] Click en el mismo prompt de antes
- [ ] **RESULTADO ESPERADO:** Botón ahora dice **"Generate 10000x Version"** (azul)
- [ ] **SI SIGUE DICIENDO "Pay $1":** Refresca la página (`F5`)

### ✓ Prueba #12: Transacción en Base de Datos
- [ ] **VERIFICA EN MONGODB:**
  - [ ] Collections → `transactions`
  - [ ] Busca la última transacción
  - [ ] Campos:
    - `stripeSessionId`: debe tener valor (ej. `cs_test_...`)
    - `amount`: `1`
    - `status`: `paid` (era `pending` antes del webhook)
    - `user`: tu userId
- [ ] **RESULTADO ESPERADO:** Transacción registrada correctamente

---

## 🎨 FASE 3: GENERACIÓN DE IMAGEN (Pruebas 13-17)

### ✓ Prueba #13: Click en Generate
- [ ] Click en "Generate 10000x Version"
- [ ] Espera 5-10 segundos
- [ ] **RESULTADO ESPERADO:** Loading spinner o mensaje "Generating..."
- [ ] **SI FALLA:** Abre DevTools → Console → busca errores

### ✓ Prueba #14: Imagen o Placeholder Aparece
- [ ] **RESULTADO ESPERADO (Modo Demo):**
  - [ ] Aparece un **placeholder SVG** con gradiente morado
  - [ ] Texto: "PetMatch AI - Pet - Christmas"
  - [ ] Mensaje: "Por favor configura las API keys para generar con IA"
- [ ] **ESTO ES NORMAL** (las APIs de IA no están configuradas todavía)
- [ ] **SI APARECE IMAGEN REAL:** ¡Excelente! Las APIs ya están configuradas

### ✓ Prueba #15: Crédito Se Consume
- [ ] **VERIFICA EN MONGODB:**
  - [ ] Users → tu usuario → `credits` debe ser `0` (era `1` antes)
- [ ] **RESULTADO ESPERADO:** Crédito consumido correctamente

### ✓ Prueba #16: Botón Vuelve a "Pay $1"
- [ ] Refresca `/prompts`
- [ ] Click en cualquier prompt
- [ ] **RESULTADO ESPERADO:** Botón vuelve a decir **"Pay $1 & Generate Image"**
- [ ] (Porque ya no tienes créditos)

### ✓ Prueba #17: Segundo Ciclo Completo
- [ ] Repite Pruebas 6-16 una vez más
- [ ] **RESULTADO ESPERADO:** Todo funciona igual que la primera vez
- [ ] Confirma que puedes hacer múltiples pagos sin errores

---

## 🔒 FASE 4: SEGURIDAD Y EDGE CASES (Pruebas 18-20)

### ✓ Prueba #18: No Puedes Generar Sin Créditos
- [ ] Asegúrate de tener `credits: 0`
- [ ] Intenta llamar directamente a `/api/prompts/generate` (con Postman o curl)
- [ ] **RESULTADO ESPERADO:** Error `403` o `"Insufficient credits"`
- [ ] **SI PERMITE GENERAR:** Hay un bug de seguridad (avísame)

### ✓ Prueba #19: Webhook Rechaza Firmas Inválidas
- [ ] Ve a Stripe Dashboard → Webhooks → Events
- [ ] Click en el último evento `checkout.session.completed`
- [ ] Click en "Resend" (esto reenvía el webhook)
- [ ] **VERIFICA EN RENDER LOGS:**
  - [ ] Debe aparecer "✅ Added 1 credit to user..."
  - [ ] O "⚠️ Webhook signature verification failed" (si la firma cambió)
- [ ] **RESULTADO ESPERADO:** Webhook solo procesa eventos válidos

### ✓ Prueba #20: Rate Limiting Funciona
- [ ] Haz 10 clicks rápidos en "Pay $1 & Generate Image"
- [ ] **RESULTADO ESPERADO:**
  - [ ] Solo se abre 1 checkout (los demás se ignoran)
  - [ ] O aparece mensaje "Too many requests"
- [ ] **SI ABRE 10 CHECKOUTS:** Hay un bug (pero no crítico)

---

## 📊 RESUMEN DE RESULTADOS

### ✅ TODO BIEN SI:
- [ ] 20/20 pruebas pasaron
- [ ] Banner desaparecido
- [ ] Pago de $1 funciona
- [ ] Webhook suma créditos
- [ ] Generación consume créditos
- [ ] No hay errores en logs

### ⚠️ REVISAR SI:
- [ ] 15-19/20 pruebas pasaron
- [ ] Hay errores menores (ej. lentitud, UI glitches)
- [ ] Webhook tarda más de 10 segundos

### 🚨 PROBLEMA CRÍTICO SI:
- [ ] Menos de 15/20 pruebas pasaron
- [ ] Pago no funciona
- [ ] Webhook no suma créditos
- [ ] Hay errores en Stripe Dashboard

---

## 🛠️ DEBUGGING RÁPIDO

### Si falla Prueba 1-5:
```bash
# Vercel no desplegó
# Espera 5 min más o fuerza rebuild en Vercel Dashboard
```

### Si falla Prueba 6-12:
```bash
# Problema de backend
# Revisa Render logs:
# https://dashboard.render.com → tu servicio → Logs
# Busca errores rojos
```

### Si falla Prueba 13-17:
```bash
# Problema de generación (NORMAL en modo demo)
# Las APIs de IA no están configuradas
# Mañana añades GOOGLE_AI_API_KEY
```

### Si falla Prueba 18-20:
```bash
# Problema de seguridad
# Avísame de inmediato
```

---

## 📝 NOTAS FINALES

- **Tiempo estimado:** 15-20 minutos para las 20 pruebas
- **Herramientas necesarias:**
  - Navegador (Chrome/Edge en modo incógnito)
  - MongoDB Atlas (para verificar datos)
  - Stripe Dashboard (para verificar pagos)
  - Render Dashboard (para ver logs)
- **Tarjeta de prueba:** `4242 4242 4242 4242` (SOLO esta)
- **Emails de prueba:** `test1@petmatch.fun`, `test2@petmatch.fun`, etc.

---

**IMPORTANTE:** Si alguna prueba falla, **anota el número y el error exacto**. Luego búscalo en la tabla de errores que te di antes.

¡Buena suerte, Socio! 🚀
