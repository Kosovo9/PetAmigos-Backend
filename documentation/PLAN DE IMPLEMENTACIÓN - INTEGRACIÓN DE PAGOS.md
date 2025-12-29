# PLAN DE IMPLEMENTACIÓN - INTEGRACIÓN DE PAGOS

**Objetivo:** Implementar un sistema de pagos robusto y seguro que soporte múltiples métodos de pago: PayPal, Mercado Pago y transferencias bancarias (específicamente para el mercado mexicano). El sistema debe eliminar la dependencia de Stripe y Vercel según los requerimientos del cliente.

---

## MÉTODOS DE PAGO A IMPLEMENTAR

1.  **PayPal** - Método de pago global, ampliamente usado en América del Norte, Europa y Asia.
2.  **Mercado Pago** - Método de pago dominante en América Latina (especialmente México, Argentina, Brasil, Chile, Colombia).
3.  **Transferencias Bancarias (SPEI)** - Método específico para México, usando el sistema SPEI (Sistema de Pagos Electrónicos Interbancarios).

---

## ESTRUCTURA DE CARPETAS Y ARCHIVOS

```
petamigos-global/
├── services/
│   └── 15-payment-service/         # Servicio de pagos
│       ├── src/
│       │   ├── index.ts            # Punto de entrada
│       │   ├── routes/
│       │   │   ├── paypal.routes.ts
│       │   │   ├── mercadopago.routes.ts
│       │   │   ├── spei.routes.ts
│       │   │   └── subscription.routes.ts
│       │   ├── controllers/
│       │   │   ├── paypal.controller.ts
│       │   │   ├── mercadopago.controller.ts
│       │   │   ├── spei.controller.ts
│       │   │   └── subscription.controller.ts
│       │   ├── services/
│       │   │   ├── paypal.service.ts       # Cliente SDK de PayPal
│       │   │   ├── mercadopago.service.ts  # Cliente SDK de Mercado Pago
│       │   │   ├── spei.service.ts         # Lógica de SPEI
│       │   │   ├── payment.service.ts      # Lógica común de pagos
│       │   │   └── subscription.service.ts # Gestión de suscripciones
│       │   ├── models/
│       │   │   ├── payment.model.ts
│       │   │   ├── subscription.model.ts
│       │   │   └── transaction.model.ts
│       │   ├── webhooks/
│       │   │   ├── paypal.webhook.ts       # Webhook de PayPal
│       │   │   └── mercadopago.webhook.ts  # Webhook de Mercado Pago
│       │   └── utils/
│       │       ├── currency.ts             # Conversión de monedas
│       │       └── validation.ts           # Validación de pagos
│       ├── package.json
│       └── Dockerfile
│
├── client/
│   └── src/
│       ├── components/
│       │   └── payments/
│       │       ├── PaymentModal.tsx        # Modal de selección de método
│       │       ├── PayPalButton.tsx        # Botón de PayPal
│       │       ├── MercadoPagoButton.tsx   # Botón de Mercado Pago
│       │       └── SPEIInstructions.tsx    # Instrucciones de SPEI
│       └── app/
│           └── (main)/
│               ├── pricing/page.tsx        # Página de precios
│               └── payment/
│                   ├── success/page.tsx    # Página de éxito
│                   └── cancel/page.tsx     # Página de cancelación
│
└── docker-compose.yml
```

---

## DETALLE DE ARCHIVOS A GENERAR POR KIMI.COM

### 1. `services/15-payment-service/`

#### `src/index.ts`
Punto de entrada del servicio. Inicia el servidor Fastify, conecta a la base de datos y registra las rutas de pago y webhooks.

#### `src/routes/paypal.routes.ts`
Define las rutas para PayPal:
- `POST /paypal/create-order`: Crea una orden de pago en PayPal.
- `POST /paypal/capture-order`: Captura el pago después de que el usuario apruebe.

#### `src/routes/mercadopago.routes.ts`
Define las rutas para Mercado Pago:
- `POST /mercadopago/create-preference`: Crea una preferencia de pago.
- `GET /mercadopago/success`: Callback de éxito.
- `GET /mercadopago/failure`: Callback de fallo.

#### `src/routes/spei.routes.ts`
Define las rutas para SPEI:
- `POST /spei/generate-reference`: Genera una referencia de pago SPEI.
- `POST /spei/verify-payment`: Verifica manualmente un pago SPEI (requiere admin).

#### `src/routes/subscription.routes.ts`
Define las rutas para suscripciones:
- `GET /subscriptions`: Obtiene las suscripciones del usuario.
- `POST /subscriptions/create`: Crea una nueva suscripción.
- `POST /subscriptions/cancel`: Cancela una suscripción.

#### `src/controllers/paypal.controller.ts`
Lógica para manejar los pagos de PayPal:
1.  **`createOrder()`**: Crea una orden de pago usando el SDK de PayPal. Devuelve el `orderId` al frontend.
2.  **`captureOrder()`**: Captura el pago después de que el usuario apruebe en el popup de PayPal. Actualiza el estado del pago en la base de datos y activa la suscripción del usuario.

#### `src/controllers/mercadopago.controller.ts`
Lógica para manejar los pagos de Mercado Pago:
1.  **`createPreference()`**: Crea una preferencia de pago con los detalles del producto y las URLs de callback. Devuelve el `preferenceId` al frontend.
2.  **`handleSuccess()`**: Maneja el callback de éxito. Verifica el estado del pago y actualiza la base de datos.
3.  **`handleFailure()`**: Maneja el callback de fallo.

#### `src/controllers/spei.controller.ts`
Lógica para manejar las transferencias SPEI:
1.  **`generateReference()`**: Genera una referencia de pago única (CLABE interbancaria). Devuelve la referencia, el monto y las instrucciones de pago al usuario.
2.  **`verifyPayment()`**: Verifica manualmente un pago SPEI. Un administrador ingresa la referencia y confirma que el pago fue recibido. Actualiza la base de datos.

#### `src/services/paypal.service.ts`
Cliente para el SDK de PayPal:
- `createOrder(amount, currency, description)`: Crea una orden de pago.
- `captureOrder(orderId)`: Captura el pago.
- Usa el SDK oficial: `@paypal/checkout-server-sdk`.

#### `src/services/mercadopago.service.ts`
Cliente para el SDK de Mercado Pago:
- `createPreference(items, payer, backUrls)`: Crea una preferencia de pago.
- `getPayment(paymentId)`: Obtiene los detalles de un pago.
- Usa el SDK oficial: `mercadopago`.

#### `src/services/spei.service.ts`
Lógica para SPEI:
- `generateCLABE()`: Genera una CLABE interbancaria única (18 dígitos). En producción, esto se haría a través de un proveedor de pagos (ej. Conekta, Openpay).
- `generateReference()`: Genera una referencia de pago única.

#### `src/services/payment.service.ts`
Lógica común de pagos:
- `createPayment(userId, amount, currency, method, metadata)`: Crea un registro de pago en la base de datos con estado `PENDING`.
- `updatePaymentStatus(paymentId, status)`: Actualiza el estado de un pago (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`).
- `processPayment(paymentId)`: Procesa un pago completado (activa suscripción, agrega treats, etc.).

#### `src/services/subscription.service.ts`
Gestión de suscripciones:
- `createSubscription(userId, planId, paymentMethod)`: Crea una nueva suscripción.
- `cancelSubscription(subscriptionId)`: Cancela una suscripción.
- `renewSubscription(subscriptionId)`: Renueva una suscripción (job recurrente).

#### `src/webhooks/paypal.webhook.ts`
Webhook para recibir eventos de PayPal (ej. `PAYMENT.CAPTURE.COMPLETED`). Verifica la firma del webhook y actualiza el estado del pago.

#### `src/webhooks/mercadopago.webhook.ts`
Webhook para recibir eventos de Mercado Pago (ej. `payment`). Verifica la firma del webhook y actualiza el estado del pago.

#### `src/models/payment.model.ts`
Consultas a la base de datos para la tabla `payments`.

#### `src/models/subscription.model.ts`
Consultas a la base de datos para la tabla `subscriptions`.

#### `src/models/transaction.model.ts`
Consultas a la base de datos para la tabla `transactions` (registro de todas las transacciones).

---

## ESQUEMA DE BASE DE DATOS

### Tabla `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL, -- USD, MXN, EUR, etc.
  method VARCHAR(50) NOT NULL, -- paypal, mercadopago, spei
  status VARCHAR(20) NOT NULL, -- PENDING, COMPLETED, FAILED, REFUNDED
  external_id VARCHAR(255), -- ID del pago en PayPal/Mercado Pago
  metadata JSONB, -- Datos adicionales (producto, plan, etc.)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_id VARCHAR(50) NOT NULL, -- basic, premium, pro
  status VARCHAR(20) NOT NULL, -- ACTIVE, CANCELLED, EXPIRED
  payment_method VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla `transactions`
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  payment_id UUID REFERENCES payments(id),
  type VARCHAR(50) NOT NULL, -- payment, refund, subscription
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## INTEGRACIÓN EN EL FRONTEND

### 1. `client/src/components/payments/PaymentModal.tsx`

Modal que muestra los métodos de pago disponibles. El usuario selecciona uno y se muestra el componente correspondiente.

```tsx
import { useState } from 'react';
import PayPalButton from './PayPalButton';
import MercadoPagoButton from './MercadoPagoButton';
import SPEIInstructions from './SPEIInstructions';

export default function PaymentModal({ plan, onClose }) {
  const [method, setMethod] = useState(null);

  return (
    <div className="modal">
      <h2>Selecciona tu método de pago</h2>
      <button onClick={() => setMethod('paypal')}>PayPal</button>
      <button onClick={() => setMethod('mercadopago')}>Mercado Pago</button>
      <button onClick={() => setMethod('spei')}>Transferencia SPEI (México)</button>

      {method === 'paypal' && <PayPalButton plan={plan} onSuccess={onClose} />}
      {method === 'mercadopago' && <MercadoPagoButton plan={plan} onSuccess={onClose} />}
      {method === 'spei' && <SPEIInstructions plan={plan} onSuccess={onClose} />}
    </div>
  );
}
```

### 2. `client/src/components/payments/PayPalButton.tsx`

Botón de PayPal usando el SDK oficial de PayPal para React.

```tsx
import { PayPalButtons } from '@paypal/react-paypal-js';

export default function PayPalButton({ plan, onSuccess }) {
  const createOrder = async () => {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: plan.id })
    });
    const data = await res.json();
    return data.orderId;
  };

  const onApprove = async (data) => {
    await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: data.orderID })
    });
    onSuccess();
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
}
```

### 3. `client/src/components/payments/MercadoPagoButton.tsx`

Botón de Mercado Pago que redirige al checkout de Mercado Pago.

```tsx
export default function MercadoPagoButton({ plan, onSuccess }) {
  const handleClick = async () => {
    const res = await fetch('/api/mercadopago/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: plan.id })
    });
    const data = await res.json();
    window.location.href = data.initPoint; // Redirige al checkout de Mercado Pago
  };

  return <button onClick={handleClick}>Pagar con Mercado Pago</button>;
}
```

### 4. `client/src/components/payments/SPEIInstructions.tsx`

Componente que muestra las instrucciones para realizar una transferencia SPEI.

```tsx
import { useState, useEffect } from 'react';

export default function SPEIInstructions({ plan }) {
  const [reference, setReference] = useState(null);

  useEffect(() => {
    const generateReference = async () => {
      const res = await fetch('/api/spei/generate-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id })
      });
      const data = await res.json();
      setReference(data);
    };
    generateReference();
  }, []);

  if (!reference) return <p>Generando referencia...</p>;

  return (
    <div>
      <h3>Instrucciones de Pago SPEI</h3>
      <p><strong>CLABE:</strong> {reference.clabe}</p>
      <p><strong>Monto:</strong> ${reference.amount} MXN</p>
      <p><strong>Referencia:</strong> {reference.reference}</p>
      <p>Realiza la transferencia desde tu banco y tu suscripción se activará automáticamente en 24-48 horas.</p>
    </div>
  );
}
```

---

## CONFIGURACIÓN DE WEBHOOKS

### PayPal
1.  Ir al Dashboard de PayPal Developer.
2.  Crear una aplicación y obtener las credenciales (Client ID y Secret).
3.  Configurar el webhook con la URL: `https://tu-dominio.com/api/webhooks/paypal`.
4.  Seleccionar los eventos: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`.

### Mercado Pago
1.  Ir al Dashboard de Mercado Pago.
2.  Crear una aplicación y obtener las credenciales (Public Key y Access Token).
3.  Configurar el webhook con la URL: `https://tu-dominio.com/api/webhooks/mercadopago`.
4.  Seleccionar los eventos: `payment`.

---

## SEGURIDAD

1.  **Verificación de Webhooks:** Siempre verificar la firma de los webhooks para asegurar que provienen de PayPal/Mercado Pago.
2.  **HTTPS:** Todos los endpoints de pago deben usar HTTPS.
3.  **Idempotencia:** Los pagos deben ser idempotentes. Si un webhook se recibe dos veces, no se debe procesar dos veces.
4.  **Logs:** Registrar todas las transacciones en la tabla `transactions` para auditoría.
5.  **Validación de Montos:** Siempre validar que el monto recibido en el webhook coincida con el monto esperado.

---

## PLANES DE SUSCRIPCIÓN

### Planes Propuestos

| Plan | Precio (USD) | Precio (MXN) | Características |
|------|--------------|--------------|-----------------|
| **Free** | $0 | $0 | Funcionalidades básicas |
| **Basic** | $4.99 | $99 | Sin anuncios, más treats |
| **Premium** | $9.99 | $199 | Todo lo de Basic + verificación, badges |
| **Pro** | $19.99 | $399 | Todo lo de Premium + analytics, prioridad en soporte |

---

## INSTRUCCIONES ADICIONALES PARA KIMI.COM

1.  **SDKs Oficiales:** Usar los SDKs oficiales de PayPal (`@paypal/checkout-server-sdk`) y Mercado Pago (`mercadopago`).
2.  **Variables de Entorno:** Todas las credenciales deben estar en variables de entorno (`.env`):
    - `PAYPAL_CLIENT_ID`
    - `PAYPAL_CLIENT_SECRET`
    - `MERCADOPAGO_ACCESS_TOKEN`
    - `MERCADOPAGO_PUBLIC_KEY`
3.  **Modo Sandbox:** Implementar primero en modo sandbox/test para ambas plataformas. Cambiar a producción solo cuando todo esté probado.
4.  **SPEI en Producción:** Para SPEI en producción, integrar con un proveedor de pagos mexicano como **Conekta** o **Openpay** que proporcione APIs para generar CLABEs y verificar pagos automáticamente.
5.  **Renovación Automática:** Implementar un job recurrente (usando `node-cron`) que se ejecute diariamente para renovar las suscripciones que están por vencer.

Este sistema de pagos proporcionará flexibilidad para los usuarios de diferentes regiones y cumplirá con los requerimientos del cliente de eliminar Stripe y Vercel.
