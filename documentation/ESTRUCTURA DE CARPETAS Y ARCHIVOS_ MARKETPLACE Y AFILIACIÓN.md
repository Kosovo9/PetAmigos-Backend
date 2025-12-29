# ESTRUCTURA DE CARPETAS Y ARCHIVOS: MARKETPLACE Y AFILIACIÓN

**Objetivo:** Proporcionar a Kimi.com la estructura de carpetas y archivos exacta para generar el `marketplace-service` y el `affiliate-service`, así como los componentes de frontend asociados.

---

## 1. BACKEND: MICROSERVICIOS

### A. `8-marketplace-service` (Marketplace 500% Optimizado)

```
petamigos-global/
└── services/
    └── 8-marketplace-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   ├── product.routes.ts        # Rutas para listados (GET, POST, PUT)
        │   │   └── transaction.routes.ts    # Rutas para transacciones (Compra, Escrow)
        │   ├── controllers/
        │   │   ├── product.controller.ts
        │   │   └── transaction.controller.ts
        │   ├── services/
        │   │   ├── search.service.ts        # Integración con MeiliSearch para búsqueda semántica
        │   │   ├── shipping.service.ts      # Integración con APIs de 3PL (Logística)
        │   │   └── escrow.service.ts        # Lógica de pago en custodia
        │   └── models/
        │       ├── product.model.ts         # Esquema de producto
        │       └── transaction.model.ts     # Esquema de transacción
        ├── package.json
        └── Dockerfile
```

### B. `22-affiliate-service` (Sistema de Afiliación Viral 25-35%)

```
petamigos-global/
└── services/
    └── 22-affiliate-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   ├── affiliate.routes.ts      # Rutas para generar enlaces y obtener reportes
        │   │   └── tracking.routes.ts       # Rutas para el tracking de clics y conversiones
        │   ├── controllers/
        │   │   └── affiliate.controller.ts
        │   ├── services/
        │   │   └── commission.service.ts    # Lógica de cálculo de comisiones (25-35%)
        │   └── models/
        │       ├── affiliate_link.model.ts  # Almacena enlaces únicos y atribución
        │       └── commission_payment.model.ts # Historial de pagos de comisiones
        ├── package.json
        └── Dockerfile
```

---

## 2. FRONTEND: COMPONENTES DE USUARIO

### `client/` (Archivos a Agregar/Modificar)

```
client/
└── src/
    ├── app/
    │   ├── (main)/
    │   │   └── marketplace/
    │   │       └── page.tsx           # Página principal del Marketplace
    │   └── (affiliate)/
    │       └── page.tsx               # Dashboard de Afiliado (protegido por auth)
    └── components/
        ├── marketplace/
        │   ├── ProductCard.tsx
        │   ├── ProductDetail.tsx
        │   ├── SearchBar.tsx          # Búsqueda Semántica con filtros avanzados
        │   ├── ShippingWidget.tsx     # Seguimiento de Envíos
        │   └── SellerVerification.tsx # Componente de verificación de vendedor
        └── affiliate/
            ├── AffiliateDashboard.tsx # Muestra Clics, Conversiones, Ganancias
            ├── AffiliateLinkGenerator.tsx # Genera el enlace único
            └── CommissionReport.tsx   # Reporte detallado de comisiones
```

---

## 3. INSTRUCCIONES DE INTEGRACIÓN PARA KIMI.COM

1.  **Integración de Pagos:** El `marketplace-service` debe interactuar con el `payment-service` para manejar el flujo de Escrow (custodia).
2.  **Integración de Búsqueda:** El `marketplace-service` debe utilizar **MeiliSearch** para la búsqueda de productos, no la base de datos principal.
3.  **Integración de Afiliación:**
    - El `affiliate-service` debe registrar las conversiones de suscripciones y ventas de Marketplace.
    - El `commission.service.ts` debe calcular el 25-35% de la comisión y notificar al `payment-service` para el pago.
4.  **Seguridad:** Ambos microservicios deben utilizar el `security-middleware` para protección contra ataques y spam.

Este plan proporciona la estructura completa para el motor de monetización y crecimiento viral de PetAmigos Global.
