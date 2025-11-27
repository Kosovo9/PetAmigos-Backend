# Cloudflare Worker - Anti-Scraping y Geo-Blocking

## Uso

1. Ir a Cloudflare Dashboard → Workers & Pages
2. Crear nuevo Worker
3. Copiar el código de `worker.js`
4. Configurar ruta: `petamigos.com/*` o `*.petamigos.com/*`
5. Guardar y desplegar

## Funcionalidad

- ✅ Geo-blocking: Solo permite acceso desde US, CA, MX
- ✅ Proxy a servidor backend (Vercel/Render)
- ✅ Protección DDoS automática de Cloudflare


