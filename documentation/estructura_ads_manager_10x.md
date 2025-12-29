# ESTRUCTURA DE CARPETAS Y ARCHIVOS: ADS MANAGER 10X

**Objetivo:** Proporcionar a Kimi.com la estructura de carpetas y archivos para el Ads Manager 10x, incluyendo la interfaz de 3 pasos y la lógica de segmentación semántica "Pet DNA".

---

## 1. BACKEND: `17-ad-service` (Lógica de Segmentación "Pet DNA")

El backend ya fue definido, pero se enfatiza la lógica de segmentación:

```
services/
└── 17-ad-service/
    ├── src/
    │   ├── services/
    │   │   ├── targeting.service.ts     # Lógica de segmentación semántica
    │   │   └── auction.service.ts       # Lógica de subasta
    │   └── models/
    │       └── audience_segment.model.ts # Esquema para guardar audiencias personalizadas
    ...
```

### Lógica Clave en `targeting.service.ts`

Este servicio debe consultar el `user-service` para obtener los datos del perfil de la mascota (raza, edad, condición médica) y el `social-service` para el comportamiento (intereses).

```typescript
// Ejemplo de función en targeting.service.ts
async function getPetDnaAudience(criteria: AdCriteria): Promise<string[]> {
    // 1. Consulta a user-service por perfiles de mascotas que coincidan con la raza y edad.
    // 2. Consulta a social-service por usuarios que interactuaron con contenido relacionado a 'criteria.interest'.
    // 3. Combina y desduplica los IDs de usuario.
    // 4. Retorna la lista de IDs de usuario para el algoritmo de subasta.
}
```

---

## 2. FRONTEND: ADS MANAGER 10X (Interfaz de 3 Pasos)

La interfaz simplificada se implementa en el frontend de Next.js.

```
client/
└── src/
    ├── app/
    │   └── (main)/
    │       └── ads-manager/
    │           └── page.tsx           # Contenedor principal del Ads Manager
    └── components/
        ├── ads-manager/
        │   ├── CampaignCreationForm.tsx # Componente principal que gestiona el estado de los 3 pasos
        │   ├── steps/
        │   │   ├── Step1_Objective.tsx  # Paso 1: Seleccionar Objetivo (Tráfico, Conversión, Alcance)
        │   │   ├── Step2_Audience.tsx   # Paso 2: Segmentación "Pet DNA"
        │   │   └── Step3_BudgetPayment.tsx # Paso 3: Presupuesto y Pago
        │   ├── AudienceSelector.tsx     # Componente de selección de audiencia (usa la lógica de Pet DNA)
        │   ├── RealTimeMetrics.tsx      # Gráficos de rendimiento
        │   └── PaymentIntegration.tsx   # Integración con 15-payment-service
        └── ui/
            └── AdPreview.tsx            # Previsualización del anuncio en tiempo real
```

### Flujo de la Interfaz de 3 Pasos

| Paso | Componente | Función Clave |
|---|---|---|
| **1. Objetivo** | `Step1_Objective.tsx` | Define el KPI principal de la campaña. |
| **2. Audiencia** | `Step2_Audience.tsx` | Utiliza `AudienceSelector.tsx` para permitir la segmentación por **"Pet DNA"** (ej. "Mascotas con alergias alimentarias en CDMX"). |
| **3. Presupuesto** | `Step3_BudgetPayment.tsx` | Permite al usuario pagar el "fee" y establece el límite de gasto diario/total. |

---

## 3. INSTRUCCIONES DE IMPLEMENTACIÓN PARA KIMI.COM

1.  **Prioridad:** Generar los componentes de la carpeta `client/src/components/ads-manager/steps/` para establecer el flujo de la interfaz.
2.  **Conexión Backend:** El `AudienceSelector.tsx` debe hacer llamadas al endpoint de `17-ad-service` para validar y estimar el tamaño de la audiencia "Pet DNA" seleccionada.
3.  **Pago:** El `PaymentIntegration.tsx` debe interactuar con el `15-payment-service` para procesar el pago de la campaña.

Este diseño asegura una experiencia de usuario 10x en la creación de anuncios, haciendo que la plataforma sea accesible y efectiva para cualquier anunciante.
