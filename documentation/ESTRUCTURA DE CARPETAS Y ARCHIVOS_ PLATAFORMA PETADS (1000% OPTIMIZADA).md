# ESTRUCTURA DE CARPETAS Y ARCHIVOS: PLATAFORMA PETADS (1000% OPTIMIZADA)

**Objetivo:** Proporcionar a Kimi.com la estructura de carpetas y archivos exacta para generar el `17-ad-service` y los componentes de frontend del Ads Manager.

---

## 1. BACKEND: `17-ad-service`

```
petamigos-global/
└── services/
    └── 17-ad-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   ├── ad.routes.ts             # Rutas para crear, editar y pausar anuncios
        │   │   └── delivery.routes.ts       # Ruta interna para que otros servicios soliciten un anuncio
        │   ├── controllers/
        │   │   └── ad.controller.ts
        │   ├── services/
        │   │   ├── targeting.service.ts     # Lógica de segmentación semántica (consulta user-service)
        │   │   └── auction.service.ts       # Lógica de subasta y optimización de LTV
        │   └── models/
        │       ├── campaign.model.ts        # Esquema de campañas
        │       ├── ad_creative.model.ts     # Esquema de creatividades de anuncios
        │       └── ad_impression.model.ts   # Registro de impresiones y clics
        ├── package.json
        └── Dockerfile
```

---

## 2. FRONTEND: ADS MANAGER

```
client/
└── src/
    ├── app/
    │   └── (main)/
    │       └── ads-manager/
    │           └── page.tsx           # Ads Manager principal
    └── components/
        ├── ads-manager/
        │   ├── CampaignCreationForm.tsx # Formulario de 3 pasos
        │   ├── AudienceSelector.tsx     # Selector de audiencia semántica (asistido por IA)
        │   ├── RealTimeMetrics.tsx      # Gráficos de rendimiento (alimentado por 11-analytics-service)
        │   └── PaymentIntegration.tsx   # Integración con 15-payment-service
        └── ui/
            └── AdUnit.tsx               # Componente para renderizar anuncios nativos en el feed
```

---

## 3. INSTRUCCIONES DE INTEGRACIÓN PARA KIMI.COM

1.  **Integración de Pagos:** El `PaymentIntegration.tsx` en el frontend debe interactuar con el `15-payment-service` para procesar el "fee" de la campaña.
2.  **Integración de Analíticas:** El `RealTimeMetrics.tsx` debe consumir las rutas del `11-analytics-service` para mostrar el rendimiento de la campaña en tiempo real.
3.  **Integración de Entrega:** El `social-service` y el `marketplace-service` deben llamar a la ruta interna `delivery.routes.ts` del `17-ad-service` para obtener el anuncio más relevante para inyectar en el feed o en los resultados de búsqueda.
4.  **Seguridad:** El `17-ad-service` debe utilizar el `security-middleware` para proteger las rutas de creación de campañas.

Este plan proporciona la estructura completa para el motor de ingresos de alto margen de PetAmigos Global.
