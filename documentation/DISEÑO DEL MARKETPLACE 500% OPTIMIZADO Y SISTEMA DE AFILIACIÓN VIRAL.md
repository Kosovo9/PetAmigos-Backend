# DISEÑO DEL MARKETPLACE 500% OPTIMIZADO Y SISTEMA DE AFILIACIÓN VIRAL

**Objetivo:** Diseñar el `marketplace-service` y el `affiliate-service` con una optimización 500% superior a Facebook Marketplace, enfocándose en la seguridad, la experiencia de usuario y el crecimiento orgánico a través de un sistema de afiliación agresivo (25-35%).

---

## 1. MARKETPLACE 500% OPTIMIZADO (petmatch.fun)

La optimización 500% se logra resolviendo los principales "Cons" de Facebook Marketplace: falta de seguridad, baja calidad de los listados y logística deficiente.

### A. Seguridad y Confianza (Nivel CIA)

| Característica | Optimización 500% | Servicio/Tecnología |
|---|---|---|
| **Verificación de Vendedor** | **Verificación de Identidad (KYC) obligatoria** para vendedores. Uso de `user-service` para verificar documentos. | `user-service` + `security-service` |
| **Escaneo de Productos** | **Escaneo de imágenes de productos** en busca de contenido prohibido o engañoso (ej. fotos de stock). | `media-service` + `security-service` |
| **Transacciones Seguras** | **Sistema de Pago en Custodia (Escrow)**. El pago se libera al vendedor solo 48 horas después de que el comprador confirma la recepción. | `payment-service` |
| **Sistema de Reputación** | **Reputación Bidireccional** (Comprador y Vendedor) vinculada al `Trust Score` del Dashboard. | `marketplace-service` + `user-service` |

### B. Experiencia de Usuario (UX)

| Característica | Optimización 500% | Justificación |
|---|---|---|
| **Búsqueda Instantánea** | **Búsqueda Semántica con MeiliSearch**. Permite buscar por "juguete duradero para un labrador de 2 años" en lugar de solo "juguete". | Velocidad y precisión de búsqueda superior a cualquier competidor. |
| **Filtros de Nicho** | Filtros específicos para mascotas (raza, edad, condición médica, alergias). | Permite a los usuarios encontrar productos hiper-relevantes, aumentando la conversión. |
| **Integración Social** | **"Ask a Friend"**: Permite compartir un listado directamente a un chat de Messenger o a un grupo de la plataforma. | Aprovecha el efecto de red social para impulsar las ventas. |

### C. Logística y Fulfillment

| Característica | Optimización 500% | Servicio/Tecnología |
|---|---|---|
| **Integración de Envíos** | **API de Integración con 3PLs** (Third-Party Logistics) locales (ej. Estafeta en México, USPS en USA). | El vendedor imprime la etiqueta de envío directamente desde el Dashboard. |
| **Seguimiento en Tiempo Real** | **Widget de Seguimiento** en el Dashboard de Usuario. | Reduce las consultas al AI Helpdesk y mejora la confianza del comprador. |

---

## 2. SISTEMA DE AFILIACIÓN VIRAL (25% - 35%)

**Viabilidad:** **Esencial para el crecimiento viral y la valuación de $350M.**

El alto porcentaje de comisión (25-35%) es una inversión en marketing de boca en boca que se paga con ingresos, no con capital.

### A. Diseño del `affiliate-service`

| Componente | Función | Comisión Aplicada |
|---|---|---|
| **Generación de Enlaces** | Genera un enlace único (`petmatch.fun/?ref=USER_ID`) para cada usuario. | 35% de la primera suscripción. |
| **Seguimiento de Cookies** | Seguimiento de 90 días para atribución de ventas. | 25% de la comisión en ventas de Marketplace. |
| **Dashboard de Afiliado** | Un panel en el Dashboard de Usuario que muestra: Clics, Conversiones, Ganancias Pendientes, Pagos Recibidos. | 30% de la comisión en ventas de Treats. |
| **Pagos de Comisión** | Integración con `payment-service` para pagos automáticos de comisiones (PayPal/Transferencia) el día 15 de cada mes. | 25% - 35% (variable según el producto). |

### B. Estrategia de Crecimiento Viral

1.  **Afiliación Universal:** **Cualquier usuario** puede ser un afiliado. Esto convierte a toda la base de usuarios en una fuerza de marketing.
2.  **Incentivo de Nivel:** Ofrecer un **5% adicional** de comisión por las ventas generadas por los usuarios que el afiliado original refirió (modelo de dos niveles). Esto incentiva a los afiliados a reclutar a otros afiliados.
3.  **Monetización de Contenido:** El `affiliate-service` se integra con el `reel-service`. Los creadores de contenido pueden etiquetar productos del Marketplace en sus Reels y ganar una comisión del 30% por cada venta generada directamente desde su video.

---

## 3. ESTRUCTURA DE CARPETAS PARA KIMI.COM

### Backend: `8-marketplace-service` y `22-affiliate-service`

**Instrucción para Kimi.com:** Generar los siguientes microservicios.

```
petamigos-global/
└── services/
    ├── 8-marketplace-service/
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── routes/
    │   │   │   ├── product.routes.ts
    │   │   │   └── transaction.routes.ts
    │   │   ├── controllers/
    │   │   │   ├── product.controller.ts
    │   │   │   └── transaction.controller.ts
    │   │   ├── services/
    │   │   │   ├── search.service.ts       # Integración con MeiliSearch
    │   │   │   └── shipping.service.ts     # Integración con 3PL APIs
    │   │   └── models/
    │   │       ├── product.model.ts
    │   │       └── transaction.model.ts
    │   ├── package.json
    │   └── Dockerfile
    └── 22-affiliate-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   └── affiliate.routes.ts      # Rutas para generar enlaces y obtener reportes
        │   ├── controllers/
        │   │   └── affiliate.controller.ts
        │   ├── services/
        │   │   └── commission.service.ts    # Lógica de cálculo de comisiones (25-35%)
        │   └── models/
        │       ├── affiliate_link.model.ts
        │       └── commission_payment.model.ts
        ├── package.json
        └── Dockerfile
```

### Frontend: `client/` (Archivos a Agregar/Modificar)

```
client/
└── src/
    ├── app/
    │   ├── (main)/
    │   │   └── marketplace/
    │   │       └── page.tsx           # Página principal del Marketplace
    │   └── (affiliate)/
    │       └── page.tsx               # Dashboard de Afiliado
    └── components/
        ├── marketplace/
        │   ├── ProductCard.tsx
        │   ├── ProductDetail.tsx
        │   ├── SearchBar.tsx          # Búsqueda Semántica
        │   └── ShippingWidget.tsx     # Seguimiento de Envíos
        └── affiliate/
            ├── AffiliateDashboard.tsx # Muestra Clics, Conversiones, Ganancias
            └── AffiliateLinkGenerator.tsx
```

---

## 4. CONCLUSIÓN

El Marketplace 500% optimizado, con su enfoque en la seguridad transaccional (Escrow) y la búsqueda semántica, junto con el sistema de afiliación viral del 25-35%, crea un motor de crecimiento orgánico masivo. Este motor es el componente final necesario para asegurar el hito de 1M+ MAU y la valuación de **$350 Millones USD en el Mes 12**. El `affiliate-service` es la inversión más inteligente en marketing que se puede hacer.
