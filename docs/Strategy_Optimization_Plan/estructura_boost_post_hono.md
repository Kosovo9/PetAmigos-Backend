# ESTRUCTURA DE CARPETAS Y ARCHIVOS: BOOST POST (Hono Worker)

**Objetivo:** Proporcionar a Kimi.com la estructura de carpetas y archivos para codificar el microservicio de "Boost Post" (`17-ad-service`), utilizando Cloudflare Workers y el framework Hono para una baja latencia.

---

## 1. BACKEND: `17-ad-service` (Worker)

El `17-ad-service` es el microservicio de anuncios. La lógica de "Boost Post" es un subconjunto de la lógica de campañas.

```
petamigos-global/
└── services/
    └── 17-ad-service/
        ├── src/
        │   ├── index.ts                     # Worker principal (usando Hono)
        │   ├── routes/
        │   │   ├── ad.routes.ts
        │   │   └── boost.routes.ts          # Nueva ruta para iniciar un Boost Post
        │   ├── controllers/
        │   │   └── boost.controller.ts      # Lógica de validación y creación de campaña Boost
        │   ├── services/
        │   │   ├── targeting.service.ts     # Reutiliza la segmentación "Pet DNA"
        │   │   └── payment_proxy.service.ts # Proxy para llamar al 15-payment-service
        │   └── models/
        │       └── boost_campaign.model.ts  # Esquema simplificado para campañas Boost
        ├── wrangler.toml
        └── package.json
```

## 2. LÓGICA CLAVE EN `boost.controller.ts`

El controlador debe ser extremadamente rápido, ya que se ejecuta en el borde.

1.  **Validación de Pago:** Llama a `payment_proxy.service.ts` para confirmar que el `fee de $10 USD` fue pagado.
2.  **Creación de Campaña:** Crea una entrada simplificada en la base de datos (Neon/D1) con un objetivo de impresiones o alcance limitado.
3.  **Activación Rápida:** Escribe la campaña activa en **Cloudflare KV** para que el `delivery.routes.ts` pueda servirla inmediatamente.

## 3. FRONTEND: COMPONENTES DE "BOOST POST"

La interfaz de usuario debe ser un modal simple en el post o Reel.

```
client/
└── src/
    └── components/
        ├── social/
        │   ├── PostCard.tsx
        │   └── BoostButton.tsx              # Botón "Boost" en cada post/Reel
        └── ads-manager/
            └── BoostModal.tsx               # Modal de 3 pasos simplificado para Boost
```

## 4. OPTIMIZACIÓN DE BAJA LATENCIA

- **Hono Framework:** Kimi.com debe usar Hono para el `index.ts` ya que es un framework minimalista y rápido, diseñado específicamente para Workers.
- **Ruta de Entrega:** La ruta `delivery.routes.ts` debe ser la más optimizada, solo consultando KV y retornando el ID del post a mostrar.

Este diseño asegura que el "Boost Post" sea un proceso de un solo clic para el usuario y una fuente de ingresos de baja latencia para la plataforma.
