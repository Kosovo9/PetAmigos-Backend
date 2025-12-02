// Worker Básico para Anti-Scraping y Geo-Blocking (Concepto)
// Este código irá en el Editor de Workers de Cloudflare.

addEventListener('fetch', event => {
  const country = event.request.cf.country;
  
  // Solo permitir US, CA, MX.
  if (!['US', 'CA', 'MX'].includes(country)) {
    return event.respondWith(
      new Response('Acceso restringido fuera de Norteamérica.', { status: 403 })
    );
  }
  
  // Si pasa, proxy a Vercel/Render
  event.respondWith(fetch(event.request));
});



