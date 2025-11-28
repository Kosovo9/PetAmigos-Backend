# 💼 AFFILIATE SYSTEM - PLATINUM SUITE
## Sistema de Afiliados de Nivel Empresarial

### 🎯 CARACTERÍSTICAS IMPLEMENTADAS

#### 1. 🔐 **Two-Factor Authentication (2FA)**
- Integración con Google Authenticator
- QR Code generado automáticamente
- Protección adicional para cuentas de afiliados
- Endpoints:
  - `POST /api/affiliates/2fa/enable` - Habilitar 2FA
  - `POST /api/affiliates/2fa/verify` - Verificar código
  - `POST /api/affiliates/2fa/disable` - Desactivar 2FA

#### 2. 📊 **Real-Time Analytics Dashboard**
- Métricas en vivo de conversiones
- Tracking de clics y conversiones
- Cálculo automático de comisiones
- Progreso hacia siguiente tier
- Historial de transacciones

#### 3. 💰 **Automatic Payout Scheduling**
- Sistema de wallet interno
- Balance en tiempo real
- Pagos automáticos programados
- Configuración de umbral mínimo ($50 USD por defecto)
- Soporte para múltiples métodos:
  - PayPal
  - Stripe
  - Transferencia Bancaria

#### 4. 🎯 **Referral Tier System**
- **Bronze** (Default): 20% comisión
- **Silver** ($1,000+ lifetime): 22% comisión + Soporte prioritario
- **Gold** ($5,000+ lifetime): 25% comisión + Pagos semanales
- **Platinum** ($10,000+ lifetime): 30% comisión + Pagos instantáneos + Gerente dedicado

Upgrade automático basado en lifetime earnings.

#### 5. 📧 **Automated Email Notifications**
- Notificación de nueva venta (con detalles de comisión)
- Notificación de pago procesado
- Notificación de upgrade de tier
- Configuración personalizable por afiliado
- Templates HTML profesionales

---

### 🛡️ SEGURIDAD ANTI-FRAUDE

#### Medidas Implementadas:
1. **Validación de Transacciones**: Cada comisión se registra en `AffiliateTransaction` con metadata completa
2. **2FA Obligatorio**: Para retiros mayores a $500 (configurable)
3. **Rate Limiting**: Protección contra abuso de endpoints
4. **Audit Trail**: Logs completos de todas las transacciones
5. **Wallet Segregado**: Balance separado del sistema principal

#### Anti-Clonación de Enlaces:
- Códigos únicos por afiliado
- Tracking de IPs sospechosas
- Detección de patrones anormales de clics

---

### 💳 SISTEMA DE PAGOS (Sin Costos para Ti ni Afiliados)

#### Solución Implementada: **Stripe Connect**

**¿Cómo funciona?**
1. Los afiliados conectan su cuenta de Stripe/PayPal directamente
2. PetMatch actúa como plataforma intermediaria
3. Los pagos se transfieren automáticamente desde el balance del afiliado
4. **Stripe cobra la comisión de procesamiento** (~2.9% + $0.30), NO tú

**Configuración Requerida:**
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_CONNECT_CLIENT_ID=ca_...
```

**Flujo de Pago:**
1. Afiliado solicita payout desde dashboard
2. Sistema verifica balance mínimo ($50)
3. Si tiene 2FA, solicita código
4. Stripe Connect transfiere fondos directamente
5. Email de confirmación enviado

**Costos:**
- Para ti: $0 (Stripe cobra al afiliado)
- Para afiliado: 2.9% + $0.30 por transacción (estándar de Stripe)
- Alternativa PayPal: 2.5% fijo

---

### 📋 DISCLAIMER LEGAL (3 Idiomas)

#### Español:
```
DESCARGO DE RESPONSABILIDAD FISCAL

Al participar en el Programa de Afiliados de PetMatch, usted reconoce y acepta que:

1. Es responsable de declarar todos los ingresos generados a través de este programa ante las autoridades fiscales correspondientes en su jurisdicción.

2. PetMatch no retiene impuestos ni emite formularios fiscales (W-2, 1099, etc.) a menos que sea requerido por ley en su país.

3. Usted es el único responsable de calcular, declarar y pagar todos los impuestos aplicables sobre sus ganancias.

4. PetMatch no proporciona asesoría fiscal. Consulte con un profesional de impuestos en su país.

5. El incumplimiento de sus obligaciones fiscales puede resultar en sanciones legales por parte de las autoridades fiscales.

Al continuar, confirma que ha leído y comprendido este descargo de responsabilidad.
```

#### English:
```
TAX LIABILITY DISCLAIMER

By participating in the PetMatch Affiliate Program, you acknowledge and agree that:

1. You are responsible for reporting all income generated through this program to the appropriate tax authorities in your jurisdiction.

2. PetMatch does not withhold taxes or issue tax forms (W-2, 1099, etc.) unless required by law in your country.

3. You are solely responsible for calculating, reporting, and paying all applicable taxes on your earnings.

4. PetMatch does not provide tax advice. Please consult with a tax professional in your country.

5. Failure to comply with your tax obligations may result in legal penalties from tax authorities.

By continuing, you confirm that you have read and understood this disclaimer.
```

#### Français:
```
AVIS DE NON-RESPONSABILITÉ FISCALE

En participant au Programme d'Affiliation PetMatch, vous reconnaissez et acceptez que:

1. Vous êtes responsable de déclarer tous les revenus générés par ce programme aux autorités fiscales compétentes de votre juridiction.

2. PetMatch ne retient pas d'impôts et n'émet pas de formulaires fiscaux sauf si requis par la loi dans votre pays.

3. Vous êtes seul responsable du calcul, de la déclaration et du paiement de tous les impôts applicables sur vos gains.

4. PetMatch ne fournit pas de conseils fiscaux. Veuillez consulter un professionnel fiscal dans votre pays.

5. Le non-respect de vos obligations fiscales peut entraîner des sanctions légales de la part des autorités fiscales.

En continuant, vous confirmez avoir lu et compris cet avis.
```

---

### 🔗 ESTRUCTURA DE ENLACES

#### URL de Afiliado:
```
https://petmatch.fun?ref=CODIGO_AFILIADO
```

#### Tracking:
- Cookie de 90 días
- Attribution de última interacción
- Cross-device tracking (si el usuario inicia sesión)

---

### 📊 DASHBOARD DEL AFILIADO

#### Secciones:
1. **Overview**: Balance, lifetime earnings, tier actual
2. **Mis Enlaces**: Códigos activos, QR codes, copiar link
3. **Analíticas**: Gráficos de clics, conversiones, ingresos
4. **Pagos**: Historial, solicitar payout, configurar método
5. **Configuración**: 2FA, notificaciones, datos de pago

---

### 🚀 PRÓXIMOS PASOS

1. **Configurar Stripe Connect** en tu cuenta de Stripe
2. **Agregar variables de entorno** SMTP para emails
3. **Crear página de términos** para afiliados
4. **Testing completo** del flujo de pago

---

### 📞 SOPORTE

Para afiliados: `affiliates@petmatch.fun`
Para soporte técnico: `support@petmatch.fun`

---

**Última Actualización**: 2025-11-28
**Versión**: 2.0 - Platinum Suite
