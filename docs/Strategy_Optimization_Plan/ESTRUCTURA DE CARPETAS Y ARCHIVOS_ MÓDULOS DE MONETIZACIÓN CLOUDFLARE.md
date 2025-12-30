# ESTRUCTURA DE CARPETAS Y ARCHIVOS: MÓDULOS DE MONETIZACIÓN CLOUDFLARE

**Objetivo:** Proporcionar a Kimi.com la estructura de carpetas y archivos para los microservicios de monetización, adaptados para ser desplegados como Cloudflare Workers.

---

## 1. BACKEND: CLOUDFLARE WORKERS (Microservicios de Monetización)

### A. `17-ad-service` (PetAds)

```
petamigos-global/
└── services/
    └── 17-ad-service/
        ├── src/
        │   ├── index.ts                     # Worker principal (usando Hono)
        │   ├── routes/
        │   │   ├── ad.routes.ts
        │   │   └── delivery.routes.ts       # Ruta interna para entrega de anuncios
        │   ├── services/
        │   │   ├── kv_cache.service.ts      # Interfaz para Cloudflare KV
        │   │   └── auction.service.ts       # Lógica de subasta
        │   └── models/
        │       └── campaign.model.ts
        ├── wrangler.toml                    # Archivo de configuración de Cloudflare Worker
        └── package.json
```

### B. `8-marketplace-service` (Marketplace)

```
petamigos-global/
└── services/
    └── 8-marketplace-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   ├── product.routes.ts
        │   │   └── transaction.routes.ts
        │   ├── services/
        │   │   ├── neon_db.service.ts       # Conexión a Neon (PostgreSQL Serverless)
        │   │   └── search.service.ts        # Búsqueda (puede usar D1 o Neon)
        │   └── models/
        │       ├── product.model.ts
        │       └── transaction.model.ts
        ├── wrangler.toml
        └── package.json
```

### C. `15-payment-service` (Pagos y Escrow)

```
petamigos-global/
└── services/
    └── 15-payment-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   ├── payment.routes.ts
        │   │   └── webhook.routes.ts
        │   ├── services/
        │   │   ├── durable_escrow.do.ts     # Durable Object para el estado de Escrow
        │   │   ├── paypal.service.ts
        │   │   └── mercadopago.service.ts
        │   └── models/
        │       └── transaction.model.ts
        ├── wrangler.toml
        └── package.json
```

---

## 2. FRONTEND: COMPONENTES DE MONETIZACIÓN RÁPIDA

### A. Componentes de PetAds (para el plan Blitz)

```
client/
└── src/
    └── components/
        ├── marketplace/
        │   └── PromotedListingBadge.tsx     # Badge para los productos pagados
        └── ads-manager/
            ├── CampaignCreationForm.tsx
            └── steps/
                └── Step3_BudgetPayment.tsx  # Llama al 15-payment-service para el fee
```

---

## 3. INSTRUCCIONES DE IMPLEMENTACIÓN PARA KIMI.COM

1.  **Framework:** Utilizar **Hono** o un framework ligero similar optimizado para Workers en lugar de Fastify para el código de los microservicios.
2.  **Persistencia:** Utilizar **Cloudflare KV** para caching y **Durable Objects** para el estado de Escrow.
3.  **Despliegue:** El `wrangler.toml` debe ser configurado para cada Worker, especificando las rutas, los bindings a KV y los Durable Objects.

Este plan asegura que Kimi.com genere código nativo para la infraestructura de borde, lo que es fundamental para el éxito del plan "Blitz 15 Días".
