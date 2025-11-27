# 💰 CONFIGURACIÓN DE PASARELAS DE PAGO - CASH HARVEST 10X

## 1. LEMON SQUEEZY - CONFIGURACIÓN FISCAL GLOBAL

### Configuración de Impuestos

#### Estados Unidos (US)
```
1. Acceder a Lemon Squeezy Dashboard → Settings → Tax
2. Configurar:
   - Tax Calculation: "Automatic"
   - Tax Rates: Por estado (ej. CA: 7.25%, NY: 8%, TX: 6.25%)
   - Product Tax Code: "digital_products" o "software_subscription"
3. Verificar que el Pasaporte de Longevidad esté marcado como "Digital Product"
```

#### Canadá (CA)
```
1. Configurar GST/HST:
   - GST: 5% (provincias sin HST)
   - HST: 13-15% (Ontario, Nova Scotia, etc.)
2. Product Tax Code: "digital_products"
3. Verificar que Lemon Squeezy calcule automáticamente según provincia
```

#### México (MX)
```
1. Configurar IVA:
   - IVA: 16% (aplicable a todos los estados)
   - Product Tax Code: "digital_products"
2. Verificar que Lemon Squeezy emita facturas CFDI (si aplica)
```

### Checklist de Verificación

- [ ] Impuestos configurados para US, CA, MX
- [ ] Productos marcados como "Digital Products"
- [ ] Tax Calculation en modo "Automatic"
- [ ] Prueba de transacción en cada región
- [ ] Verificación de facturas/recibos generados

### Variables de Entorno Requeridas

```env
LEMON_SQUEEZY_API_KEY=tu_api_key_aqui
LEMON_SQUEEZY_STORE_ID=tu_store_id_aqui
LEMON_SQUEEZY_WEBHOOK_SECRET=tu_webhook_secret_aqui
```

---

## 2. MERCADO PAGO - MIGRACIÓN A PRODUCCIÓN

### Checklist de Migración

#### Fase 1: Verificación de Cuenta
- [ ] Cuenta verificada con documentación legal
- [ ] Credenciales de producción generadas
- [ ] Webhooks configurados en producción

#### Fase 2: Configuración de Productos
- [ ] Pasaporte de Longevidad creado en producción
- [ ] Precio configurado: $97 USD (o equivalente en MXN)
- [ ] Descripción y términos actualizados

#### Fase 3: Pruebas de Integración
- [ ] Test de pago con tarjeta de prueba
- [ ] Verificación de webhook recibido
- [ ] Confirmación de actualización de `isLifetimeMember`

### Credenciales de Producción

```env
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_produccion
MERCADOPAGO_PUBLIC_KEY=tu_public_key_produccion
MERCADOPAGO_WEBHOOK_SECRET=tu_webhook_secret_produccion
```

### ⚠️ CRÍTICO: No usar credenciales de sandbox en producción

---

## 3. STRIPE - CONFIGURACIÓN GLOBAL

### Configuración de Impuestos

#### Estados Unidos
```
1. Stripe Dashboard → Settings → Tax
2. Habilitar "Stripe Tax"
3. Configurar:
   - Automatic Tax Calculation: ON
   - Tax Rates: Por estado automático
4. Product Tax Code: "txcd_10203001" (Software as a Service)
```

#### Internacional
```
1. Habilitar "Stripe Tax" para países internacionales
2. Configurar VAT automático para EU
3. Verificar que los productos estén marcados como "Digital Products"
```

### Checklist de Verificación

- [ ] Stripe Tax habilitado
- [ ] Productos configurados con tax codes correctos
- [ ] Webhooks configurados en producción
- [ ] Prueba de pago exitosa en US
- [ ] Prueba de pago exitosa en CA (si aplica)

---

## 4. PAYPAL - CONFIGURACIÓN OPCIONAL

### Checklist (si se implementa)

- [ ] Cuenta de negocio verificada
- [ ] API credentials generadas
- [ ] Webhooks configurados
- [ ] Prueba de pago exitosa

---

## 5. VERIFICACIÓN FINAL DE PASARELAS

### Script de Verificación

```bash
# Ejecutar tests de QA
npm run test:payment-processors

# Verificar endpoints
curl -X GET https://api.petamigos.com/api/qa/payment-processors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Criterios de Éxito

- ✅ Todos los procesadores responden correctamente
- ✅ Impuestos calculados automáticamente
- ✅ Webhooks recibidos y procesados
- ✅ `isLifetimeMember` actualizado correctamente
- ✅ Transacciones registradas en `Transaction` model

---

## 6. MONITOREO POST-LANZAMIENTO

### Métricas a Monitorear

1. **Tasa de Éxito de Pagos**
   - Meta: > 95% de transacciones exitosas
   - Acción si < 90%: Revisar logs y contactar soporte

2. **Tiempo de Procesamiento**
   - Meta: < 3 segundos desde click hasta confirmación
   - Acción si > 5s: Optimizar flujo

3. **Tasa de Abandono en Checkout**
   - Meta: < 20%
   - Acción si > 30%: Revisar UX del checkout

---

**Última actualización**: Noviembre 2024  
**Estado**: Listo para configuración final


