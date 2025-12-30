# ESTRUCTURA DE CARPETAS Y ARCHIVOS: PROMOTED LISTINGS (Cloudflare KV)

**Objetivo:** Proporcionar a Kimi.com la estructura de carpetas y archivos para implementar la lógica de "Promoted Listings" en el Marketplace, utilizando Cloudflare KV para una recuperación de baja latencia.

---

## 1. BACKEND: `8-marketplace-service` (Worker)

La lógica de Promoted Listings se integra en el `8-marketplace-service` para que la búsqueda priorice los productos pagados.

```
petamigos-global/
└── services/
    └── 8-marketplace-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   ├── product.routes.ts
        │   │   └── promoted.routes.ts       # Rutas para que el Admin/Ads Manager gestione los listados
        │   ├── services/
        │   │   ├── kv_promoted.service.ts   # Lógica de interacción con Cloudflare KV
        │   │   └── search.service.ts        # Modificado para priorizar resultados de KV
        │   └── models/
        │       └── promoted_listing.model.ts # Modelo de datos para la base de datos principal
        ├── wrangler.toml                    # Configuración del binding KV
        └── package.json
```

## 2. ESTRUCTURA DE DATOS EN CLOUDFLARE KV

Cloudflare KV se utiliza como una caché de borde de alta velocidad. La clave de la optimización es la estructura de la clave.

| Tipo de Dato | Clave KV | Valor KV | Propósito |
|---|---|---|---|
| **Listado Activo** | `PROMOTED:ACTIVE:PRODUCT_ID` | `{"product_id": "...", "priority": 1, "expiry": 1735689600}` | Recuperación directa por ID. |
| **Índice de Búsqueda** | `PROMOTED:SEARCH:CATEGORY:LOCATION` | `["PRODUCT_ID_1", "PRODUCT_ID_2", ...]` | Permite al `search.service` obtener rápidamente los IDs promocionados para una categoría/ubicación. |
| **Metadatos** | `PROMOTED:META:PRODUCT_ID` | `{"title": "...", "image_url": "..."}` | Datos mínimos para renderizar el badge de "Promoted". |

### Lógica Clave en `kv_promoted.service.ts`

1.  **`addListing(listingId, category, location)`:** Escribe el `PRODUCT_ID` en la clave `PROMOTED:ACTIVE:PRODUCT_ID` y lo añade al array de la clave `PROMOTED:SEARCH:CATEGORY:LOCATION`.
2.  **`getPromoted(category, location)`:** Lee la clave `PROMOTED:SEARCH:CATEGORY:LOCATION` y devuelve los IDs.
3.  **`search.service.ts` (Modificación):** Antes de ejecutar la búsqueda principal en Neon/D1, consulta `kv_promoted.service.ts`. Los IDs promocionados se insertan en las primeras posiciones del resultado final.

## 3. FRONTEND: COMPONENTES DE VISUALIZACIÓN

```
client/
└── src/
    └── components/
        └── marketplace/
            ├── ProductCard.tsx
            └── PromotedListingBadge.tsx # Componente que muestra el distintivo "Promoted"
```

Este diseño garantiza que los listados pagados se sirvan con la latencia más baja posible, maximizando el valor del "fee" pagado por el usuario.
