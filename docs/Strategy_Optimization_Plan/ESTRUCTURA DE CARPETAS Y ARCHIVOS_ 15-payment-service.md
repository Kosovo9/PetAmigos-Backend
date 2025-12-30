# ESTRUCTURA DE CARPETAS Y ARCHIVOS: 15-payment-service

**Objetivo:** Generar la estructura de carpetas y archivos para el microservicio de pagos (`15-payment-service`), integrando PayPal y Mercado Pago, priorizando la seguridad y la optimización de la transacción.

---

## 1. ARQUITECTURA Y OPTIMIZACIÓN DE TRANSACCIONES

El `payment-service` es el corazón de la monetización. Su diseño se centra en la **velocidad de la transacción** y la **seguridad de los webhooks**.

- **Optimización:** Usar el patrón **Saga** para transacciones complejas (ej. Escrow del Marketplace) y **BullMQ** para procesar asíncronamente los webhooks de las pasarelas de pago, evitando bloqueos en la API principal.
- **Seguridad:** Implementar la verificación de la firma del webhook (HMAC) en todas las peticiones entrantes de PayPal y Mercado Pago.

---

## 2. ESTRUCTURA DE CARPETAS Y ARCHIVOS PARA KIMI.COM

```
services/
└── 15-payment-service/
    ├── src/
    │   ├── index.ts
    │   ├── routes/
    │   │   ├── payment.routes.ts        # Rutas para iniciar pagos (ej. /subscribe, /buy-treats)
    │   │   └── webhook.routes.ts        # Rutas para recibir notificaciones de PayPal/Mercado Pago
    │   ├── controllers/
    │   │   ├── payment.controller.ts
    │   │   └── webhook.controller.ts    # Lógica de verificación de firma de webhook
    │   ├── services/
    │   │   ├── paypal.service.ts        # Lógica de integración con la API de PayPal
    │   │   ├── mercadopago.service.ts   # Lógica de integración con la API de Mercado Pago
    │   │   ├── spei.service.ts          # Lógica para transferencias bancarias (México)
    │   │   └── transaction.service.ts   # Lógica de negocio (Saga, Escrow)
    │   ├── workers/
    │   │   └── webhook_processor.worker.ts # Worker para procesar webhooks asíncronamente
    │   └── models/
    │       ├── transaction.model.ts     # Esquema de transacciones
    │       └── subscription.model.ts    # Esquema de suscripciones
    ├── package.json
    └── Dockerfile
```

---

## 3. TAREAS CLAVE PARA KIMI.COM

| Archivo | Tecnología | Tarea de Optimización y Seguridad |
|---|---|---|
| `webhook.controller.ts` | **Fastify, HMAC** | Implementar la verificación de la firma (HMAC) de los webhooks antes de procesar el cuerpo de la petición. Si la firma no coincide, la petición se rechaza (403 Forbidden). |
| `webhook_processor.worker.ts` | **BullMQ** | En lugar de procesar el webhook directamente, el `webhook.controller` debe encolar el evento en BullMQ. El worker procesa la lógica de negocio (actualizar suscripción, liberar Escrow) asíncronamente. |
| `transaction.service.ts` | **PostgreSQL** | Implementar el patrón **Saga** para asegurar la consistencia de datos en transacciones que involucran múltiples servicios (ej. `payment-service` -> `marketplace-service` -> `user-service`). |
| `paypal.service.ts` | **PayPal SDK** | Implementar la lógica de "Capture" y "Refund" para manejar pagos de suscripciones y el flujo de Escrow. |
| `mercadopago.service.ts` | **Mercado Pago SDK** | Implementar la lógica de "Checkout Pro" y "Webhooks" para los mercados de América Latina. |

---

## 4. INTEGRACIÓN CON OTROS SERVICIOS

- **`security-middleware`:** Debe ser importado y utilizado en todas las rutas para aplicar Rate Limiting y proteger contra ataques de fuerza bruta en las rutas de pago.
- **`marketplace-service`:** Depende del `payment-service` para el flujo de Escrow.
- **`affiliate-service`:** Depende del `payment-service` para el pago de comisiones.

Este diseño asegura un sistema de pagos robusto, seguro y escalable, capaz de manejar millones de transacciones.
