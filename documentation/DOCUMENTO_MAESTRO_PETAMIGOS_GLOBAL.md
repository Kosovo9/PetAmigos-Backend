# PETAMIGOS GLOBAL PLATFORM - DOCUMENTO MAESTRO DE ARQUITECTURA E IMPLEMENTACIÓN

**Versión:** 1.0  
**Fecha:** Diciembre 28, 2025  
**Autor:** Manus AI  
**Cliente:** Kosovo9  
**Proyecto:** PetAmigos Global - Plataforma Social Multifacética 10x

---

## RESUMEN EJECUTIVO

Este documento presenta el plan maestro para transformar **PetAmigos** de una plataforma de matching para mascotas en una **red social global multifacética** que combina las mejores características de Facebook, TikTok, Instagram y Tinder, optimizada 10 veces en rendimiento, escalabilidad y experiencia de usuario. La plataforma soportará 20 idiomas principales, contará con un sistema de soporte AI 24/7 y estará construida completamente con herramientas open source para minimizar costos en la fase inicial.

### Objetivos Principales

El proyecto busca crear una plataforma capaz de atender a cientos de miles de usuarios simultáneos desde el primer mes, utilizando exclusivamente herramientas de código abierto hasta generar ganancias brutas suficientes para invertir en infraestructura cloud escalable. La plataforma integrará funcionalidades de red social (feed, posts, comentarios), contenido efímero (stories), videos cortos virales (reels), sistema de matching avanzado, marketplace, grupos, eventos y un sistema de pagos flexible que incluye PayPal, Mercado Pago y transferencias bancarias para el mercado mexicano.

### Alcance del Documento

Este documento maestro consolida el análisis competitivo de más de 20 plataformas líderes, define la arquitectura técnica escalable, especifica la estructura completa de carpetas y archivos para que **Kimi.com** genere el código, y proporciona instrucciones detalladas para cada componente del sistema. El documento está organizado en secciones que cubren desde el análisis del proyecto existente hasta los planes de implementación por etapas.

---

## TABLA DE CONTENIDOS

1. [Análisis del Proyecto Actual](#1-análisis-del-proyecto-actual)
2. [Análisis Competitivo - Top 20 Plataformas](#2-análisis-competitivo---top-20-plataformas)
3. [Arquitectura Técnica Escalable](#3-arquitectura-técnica-escalable)
4. [Stack Tecnológico Open Source](#4-stack-tecnológico-open-source)
5. [Idiomas y Localización](#5-idiomas-y-localización)
6. [Plan de Implementación - Etapa 1: Facebook](#6-plan-de-implementación---etapa-1-facebook)
7. [Plan de Implementación - Etapa 2: TikTok & Instagram](#7-plan-de-implementación---etapa-2-tiktok--instagram)
8. [Sistema AI Helpdesk 24/7](#8-sistema-ai-helpdesk-247)
9. [Sistema de Pagos](#9-sistema-de-pagos)
10. [Roadmap de Implementación](#10-roadmap-de-implementación)
11. [Estimación de Costos](#11-estimación-de-costos)
12. [Métricas de Éxito](#12-métricas-de-éxito)
13. [Instrucciones para Kimi.com](#13-instrucciones-para-kimicom)

---

## 1. ANÁLISIS DEL PROYECTO ACTUAL

### Estado Actual de PetAmigos

El proyecto **PetAmigos-Backend** se encuentra desplegado en producción con las siguientes características implementadas:

**Repositorio:** https://github.com/Kosovo9/PetAmigos-Backend  
**Frontend:** https://petmatch-global.netlify.app (actualmente inactivo)  
**Backend:** https://petmatch-backend.onrender.com/api

### Stack Tecnológico Existente

El proyecto utiliza actualmente una arquitectura monolítica con las siguientes tecnologías:

**Backend:** El servidor está construido con Node.js y Express.js, utilizando MongoDB con Mongoose como base de datos principal. La autenticación se maneja mediante JWT (JSON Web Tokens), y el sistema incluye integración con Socket.io para comunicación en tiempo real. El proyecto tiene dependencias con Stripe para pagos (a eliminar), OpenAI para el chat con IA, y diversas librerías para procesamiento de imágenes (Sharp) y generación de códigos QR (qrcode).

**Frontend:** La interfaz de usuario está desarrollada con Next.js 15 y React 19, utilizando TailwindCSS 4 para los estilos. El proyecto incluye Clerk para autenticación, Supabase para base de datos adicional, y Framer Motion para animaciones. La internacionalización está implementada con next-intl.

### Funcionalidades Implementadas

El sistema actual cuenta con las siguientes características operativas:

El proyecto incluye un **sistema de autenticación completo** con registro, login y verificación de usuarios mediante JWT. Existe un **chat con IA** que utiliza la API de OpenAI, aunque está configurado en modo mock por defecto para evitar costos. El **sistema de pagos** está integrado con Stripe, pero debe ser reemplazado según los requerimientos del cliente.

La plataforma cuenta con un **feed social básico** para publicaciones, un **sistema de alertas Amber** para mascotas perdidas, y un **sistema de treats** que funciona como moneda virtual. La comunicación en tiempo real está habilitada mediante Socket.io.

Entre las características avanzadas ya implementadas se encuentran un **DNA Matching Engine** para compatibilidad genética entre mascotas, un **Biological Aging Clock** para calcular la edad biológica, un **sistema de afiliados PLATINUM** con autenticación de dos factores y pagos automáticos, y un **sistema de generación de fotos por lotes** para contenido masivo.

El proyecto incluye **seguridad de nivel Fort Knox** con protección comparable a sistemas de la NASA, CIA y bancos, además de un **sistema anti-fallo** robusto para garantizar la disponibilidad.

### Soporte Multiidioma Actual

El proyecto ya tiene implementado soporte para 14 idiomas con sus variantes regionales: Inglés (EN, EN-US, EN-GB, EN-CA, EN-AU), Español (ES, ES-ES, ES-MX, ES-AR, ES-CL, ES-CO), Francés (FR, FR-FR, FR-CA), Alemán (DE, DE-DE), Italiano (IT, IT-IT), Portugués (PT, PT-BR, PT-PT), Japonés (JA, JA-JP), Coreano (KO, KO-KR), Chino (ZH, ZH-CN), Ruso (RU, RU-RU), y Árabe (AR, AR-SA).

### Estructura de Carpetas Actual

El repositorio está organizado con las siguientes carpetas principales: `COLLIE_BATCH_OUTPUT` para el sistema de generación por lotes, `LEGACY_REPOS` para repositorios heredados, `client` para el frontend React actual, `client_old_vite` para el frontend antiguo, `cloudflare` para configuración de Cloudflare, `docs` para documentación, `drizzle` para el ORM Drizzle, `extra_features` para características adicionales, `mobile` para la aplicación móvil en desarrollo, `patches` para parches, `scripts` para scripts de utilidad, `server` para el backend Express, `shared` para código compartido, `temp_extracted` para archivos temporales, y `tests` para pruebas.

### Áreas a Expandir

Para alcanzar el objetivo de una plataforma multifacética 10x, es necesario agregar las siguientes funcionalidades:

**Funcionalidades tipo Facebook:** Feed estilo timeline con algoritmo de recomendación, sistema completo de posts con texto, imágenes y videos, comentarios anidados y respuestas, sistema de reacciones emocionales (like, love, wow, haha, sad, angry), sistema de amigos con solicitudes y bloqueos, grupos y comunidades con moderación, marketplace para compra/venta, sistema de eventos con RSVP, páginas para negocios y marcas, y sistema de verificación de cuentas.

**Funcionalidades tipo TikTok e Instagram:** Stories efímeras de 24 horas con visualizaciones, reels y videos cortos verticales con algoritmo de descubrimiento, sistema de hashtags y trending topics, duets y stitches para colaboración, biblioteca de efectos y filtros AR, biblioteca de sonidos virales, live streaming con gifts virtuales, y sistema de analytics para creadores.

**Infraestructura adicional:** Sistema de mensajería privada robusto tipo Messenger, sistema de notificaciones push multiplataforma, algoritmo de recomendación avanzado con ML, sistema de reportes y moderación con IA, analytics dashboard completo para usuarios, AI Helpdesk 24/7 con aprendizaje automático, integración de PayPal y Mercado Pago, sistema de suscripciones premium, y sistema de transferencias bancarias para México.

---

## 2. ANÁLISIS COMPETITIVO - TOP 20 PLATAFORMAS

### Metodología de Análisis

Para diseñar una plataforma 10x superior, se realizó un análisis exhaustivo de las 20 plataformas sociales y de contenido más exitosas del mundo. El análisis se enfocó en identificar las características principales (PROS), las deficiencias comunes (CONS), y las arquitecturas técnicas que permiten escalar a millones de usuarios. A partir de este análisis, se extrajeron las mejores características de cada plataforma y se diseñaron soluciones innovadoras para los problemas comunes.

### Facebook - Red Social Completa

**Características Principales:** Facebook se destaca por su News Feed algorítmico que personaliza el contenido para cada usuario, las Stories efímeras de 24 horas, los Grupos para comunidades temáticas, el Marketplace para compra/venta entre usuarios, el sistema de Eventos para organización social, Messenger como sistema de mensajería robusto, Live Streaming para transmisiones en vivo, el sistema de Reacciones emocionales (Like, Love, Haha, Wow, Sad, Angry), comentarios y compartidos para interacción social, Páginas para negocios y marcas, la plataforma Watch para videos, y Facebook Dating integrado.

**Arquitectura Técnica:** Facebook utiliza Shard Manager para balanceo de carga y escalabilidad horizontal, Cassandra como base de datos NoSQL para alta disponibilidad, arquitectura de microservicios distribuida, Memcached para caching y reducción de latencia, y CDN global para distribución de contenido estático.

**Deficiencias Identificadas:** La interfaz está sobrecargada y es compleja para nuevos usuarios, existen problemas graves de privacidad de datos, el algoritmo es opaco y reduce el alcance orgánico, hay demasiada publicidad intrusiva, y la experiencia móvil es pesada y lenta.

### TikTok - Videos Cortos Virales

**Características Principales:** TikTok revolucionó las redes sociales con su For You Page (FYP) que usa un algoritmo altamente personalizado, videos verticales cortos de 15 segundos a 10 minutos, Duets y Stitches para colaboración con contenido de otros, una biblioteca masiva de efectos AR y filtros, biblioteca de audio viral, live streaming con sistema de gifts virtuales, hashtag challenges para tendencias virales organizadas, Creator Fund para monetización, TikTok Shop para comercio electrónico integrado, y analytics dashboard detallado para creadores.

**Algoritmo de Recomendación:** El algoritmo considera las interacciones del usuario (likes, shares, comentarios, tiempo de visualización), información del video (hashtags, sonidos, captions), y configuración del dispositivo. Utiliza machine learning para ranking basado en probabilidad de engagement y tiene un sistema efectivo de cold start para nuevos usuarios y creadores.

**Arquitectura Técnica:** TikTok emplea Big Data Frameworks para procesamiento masivo de datos, machine learning para recomendaciones en tiempo real, arquitectura de microservicios modular y escalable, procesamiento de video optimizado con transcodificación y compresión, y CDN global para entrega de video de baja latencia.

**Deficiencias Identificadas:** El diseño crea adicción mediante scrolling infinito, el contenido es efímero sin permanencia, es difícil construir comunidad profunda, la moderación de contenido es inconsistente, y existen preocupaciones de seguridad de datos.

### Instagram - Visual Storytelling

**Características Principales:** Instagram ofrece Feed Posts permanentes con fotos y videos, Stories efímeras de 24 horas, Reels como videos cortos estilo TikTok, IGTV y Videos para contenido largo, Direct Messages para mensajería privada, Explore Page para descubrimiento de contenido, Shopping integrado en posts, Live para transmisiones en vivo, Guides como colecciones curadas, Broadcast Channels para difusión uno-a-muchos, filtros y efectos AR avanzados, y un robusto sistema de hashtags y tags.

**Arquitectura Técnica:** Instagram maneja miles de millones de interacciones diarias mediante bases de datos distribuidas (Cassandra, PostgreSQL), Redis para caching de baja latencia, replicación multi-región global, y procesamiento automático de imágenes con compresión y optimización.

**Deficiencias Identificadas:** El algoritmo reduce el alcance orgánico arbitrariamente, existe presión por contenido perfecto que afecta la salud mental, el shadowbanning ocurre sin transparencia, hay demasiado enfoque en influencers, y muchas funciones son copiadas de competidores.

### Tinder - Dating & Matching

**Características Principales:** Tinder popularizó la interfaz de swipe (deslizar) para Like/Nope, el sistema de matching bidireccional, el ELO Rating para puntuación de perfiles, geolocalización para matching por proximidad, chat solo después de match, Super Likes para destacar interés especial, Boost para aumentar visibilidad temporal, Profile Cards visuales con fotos y bio, Passport para cambiar ubicación virtualmente, video chat integrado, y features de seguridad como verificación de fotos y reportes.

**Algoritmo de Matching:** Tinder utiliza Elastic Search como motor de descubrimiento, considera el ratio de Like/Dislike para puntuación de perfil, prioriza usuarios activos, optimiza para matches mutuos, y da boost inicial a nuevos usuarios.

**Arquitectura Técnica:** La plataforma emplea cientos de microservicios independientes, Service Mesh con Envoy para comunicación entre servicios, API Gateway para gestión centralizada, sistema de mensajería escalable en tiempo real, y indexación geoespacial eficiente.

**Deficiencias Identificadas:** El modelo freemium es agresivo con paywall, la experiencia es superficial basada en apariencia, existe ghosting y falta de compromiso, hay problemas con bots y perfiles falsos, y los usuarios experimentan fatiga de swipe.

### Análisis de Plataformas Adicionales

**Twitter/X:** Se destaca por su feed en tiempo real, sistema de trending topics, threads para hilos de conversación, Spaces para audio en vivo, y monetización para creadores. Sus deficiencias incluyen toxicidad en conversaciones, moderación inconsistente, y cambios frecuentes de políticas.

**LinkedIn:** Ofrece networking profesional, sistema de endorsements y recomendaciones, LinkedIn Learning, y job board integrado. Sus problemas son contenido spam, interfaz anticuada, y exceso de mensajes de ventas.

**YouTube:** Proporciona videos de formato largo y corto, sistema de suscripciones, monetización robusta, y live streaming. Sufre de algoritmo opaco, demonetización arbitraria, y competencia con TikTok.

**WhatsApp:** Destaca por mensajería cifrada end-to-end, llamadas de voz y video, grupos grandes, y estados efímeros. Sus limitaciones son falta de funciones sociales, dependencia de número telefónico, y problemas de spam.

**Telegram:** Ofrece canales de difusión masivos, bots programables, grupos hasta 200k miembros, y archivos grandes. Sus deficiencias incluyen moderación laxa, uso por grupos extremistas, y interfaz compleja.

**Discord:** Proporciona servidores para comunidades, canales de voz y texto, bots e integraciones, y streaming de pantalla. Sus problemas son curva de aprendizaje alta, moderación descentralizada, y problemas de privacidad.

**Reddit:** Se caracteriza por comunidades (subreddits), sistema de upvotes/downvotes, anonimato, y AMA (Ask Me Anything). Sufre de toxicidad en algunos subreddits, moderación inconsistente, y interfaz confusa para nuevos usuarios.

**Pinterest:** Ofrece boards para colecciones visuales, búsqueda visual, shopping integrado, y contenido inspiracional. Sus limitaciones son enfoque muy nicho, menos interacción social, y problemas de copyright.

**Snapchat:** Destaca por mensajes efímeros, filtros AR innovadores, Snap Map, y Spotlight para contenido viral. Sus deficiencias incluyen pérdida de usuarios ante Instagram, interfaz confusa, y menos funciones sociales.

**Twitch:** Proporciona live streaming de gaming, sistema de suscripciones, chat en vivo, y clips virales. Sus problemas son dependencia de gaming, toxicidad en chat, y competencia con YouTube.

### Tabla Comparativa de Características

| Plataforma | Feed | Stories | Videos Cortos | Mensajería | Grupos | Marketplace | Live | Matching |
|------------|------|---------|---------------|------------|--------|-------------|------|----------|
| Facebook | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| TikTok | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Instagram | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Tinder | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Twitter/X | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **PetAmigos** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Soluciones Innovadoras a Problemas Comunes

**Problema: Interfaz Sobrecargada**  
**Solución:** Implementar UI minimalista con navegación por pestañas clara, modo "Focus" para reducir distracciones, personalización del feed (cronológico vs algorítmico), y onboarding progresivo que no abruma al usuario nuevo.

**Problema: Algoritmos Opacos**  
**Solución:** Dashboard de "Por qué ves esto" con explicaciones claras, controles de usuario sobre el algoritmo de recomendación, opción de feed cronológico puro sin algoritmo, y métricas transparentes para creadores sobre alcance y engagement.

**Problema: Privacidad y Seguridad**  
**Solución:** Cifrado end-to-end por defecto en mensajes privados, control granular de privacidad por tipo de contenido, datos almacenados localmente cuando sea posible, auditorías de seguridad públicas, y verificación de identidad opcional (no obligatoria).

**Problema: Monetización Agresiva**  
**Solución:** Modelo híbrido freemium con funcionalidades básicas robustas, publicidad no intrusiva y relevante, revenue share transparente con creadores (70/30), microtransacciones opcionales (treats, boosts), y suscripción premium sin ads con beneficios reales.

**Problema: Salud Mental y Adicción**  
**Solución:** Recordatorios de tiempo de uso cada 30 minutos, modo "Mindful" con límites de sesión configurables, pausas automáticas cada 30 minutos de uso continuo, dashboard de bienestar digital con estadísticas, y contenido positivo priorizado por el algoritmo.

**Problema: Spam y Contenido Inapropiado**  
**Solución:** AI de moderación en tiempo real con múltiples modelos, sistema de reputación de usuarios basado en comportamiento, verificación opcional de identidad con badges, reportes comunitarios con transparencia en acciones, y shadowban transparente con sistema de apelaciones.

**Problema: Interacciones Superficiales**  
**Solución:** Sistema de "Círculos" para diferenciar amigos cercanos de conocidos, eventos virtuales y presenciales integrados, grupos temáticos con moderación activa, gamificación de interacciones significativas (no solo likes), y badges de "Buen Ciudadano Digital" por comportamiento positivo.

---

## 3. ARQUITECTURA TÉCNICA ESCALABLE

### Visión General de la Arquitectura

La arquitectura de PetAmigos Global está diseñada para escalar horizontalmente desde cero hasta millones de usuarios concurrentes, utilizando una arquitectura de microservicios distribuida, bases de datos relacionales y NoSQL complementarias, caching multinivel, y CDN global para entrega de contenido. El sistema está optimizado para funcionar con herramientas open source en la fase inicial, con un plan claro de migración a infraestructura cloud cuando se generen ganancias.

### Principios de Diseño

**Escalabilidad Horizontal:** Todos los servicios están diseñados para ser stateless (sin estado) y poder replicarse horizontalmente. El balanceo de carga se realiza mediante Nginx o Traefik, y el auto-scaling se basa en métricas de CPU y memoria.

**Desacoplamiento:** Los microservicios se comunican mediante APIs REST y eventos asíncronos, permitiendo que cada servicio evolucione independientemente. El patrón de circuit breaker previene fallos en cascada.

**Resiliencia:** El sistema implementa retry logic con exponential backoff, graceful degradation cuando un servicio falla, health checks en todos los servicios, y backups automáticos diarios de bases de datos.

**Performance:** Se utiliza caching multinivel (in-memory, Redis, CDN), lazy loading de datos, pagination eficiente (cursor-based), compresión Gzip/Brotli, y HTTP/2 para multiplexing.

### Arquitectura de Microservicios

El sistema se divide en 20 microservicios especializados, cada uno con su propia base de datos y responsabilidad única:

**Servicios de Autenticación y Usuario (Puertos 5001-5002):** El auth-service maneja registro, login, JWT tokens, OAuth2, 2FA y verificación de email/SMS. El user-service gestiona perfiles, configuración de privacidad, bloqueos, reportes y verificación de cuentas.

**Servicios Sociales (Puertos 5003-5005):** El social-service es el corazón de la plataforma, gestionando el feed principal, posts, comentarios y reacciones. El story-service maneja stories efímeras de 24 horas con vistas y highlights. El reel-service gestiona videos cortos verticales con algoritmo de recomendación.

**Servicios de Comunicación (Puertos 5006, 5010):** El chat-service proporciona mensajería 1-a-1, grupos, mensajes de voz, videollamadas y cifrado E2E opcional. El notification-service gestiona notificaciones push, in-app, email y SMS.

**Servicios de Matching y Comunidad (Puertos 5007-5008):** El match-service implementa el sistema de matching tipo Tinder con algoritmo de compatibilidad y DNA matching. El group-service gestiona grupos, comunidades, roles, permisos y eventos.

**Servicios de Comercio y Eventos (Puertos 5009, 5018):** El marketplace-service maneja listados de productos, búsqueda, filtros y ratings. El event-service gestiona creación de eventos, RSVP, eventos virtuales y recordatorios.

**Servicios de Infraestructura (Puertos 5011-5014, 5017):** El search-service proporciona búsqueda global con MeiliSearch. El media-service procesa imágenes y videos. El analytics-service recopila métricas y genera insights. El moderation-service implementa detección de contenido inapropiado con IA. El recommendation-service ejecuta el algoritmo de feed personalizado.

**Servicios de Monetización y Soporte (Puertos 5015-5016, 5019-5020):** El payment-service integra PayPal, Mercado Pago y transferencias bancarias. El helpdesk-service proporciona chatbot IA 24/7. El live-service gestiona transmisiones en vivo. El i18n-service maneja traducciones automáticas.

### Arquitectura de Base de Datos

**PostgreSQL 16 - Base de Datos Principal:** Se utiliza como base de datos relacional principal para usuarios, posts, comentarios, reacciones, friendships, messages, stories, reels y matches. PostgreSQL ofrece JSONB para flexibilidad tipo NoSQL, full-text search integrado, particionamiento horizontal para escalar, y soporte para pgvector para búsqueda de embeddings.

**Redis 7 - Cache y Tiempo Real:** Redis se utiliza para cache de feeds y queries frecuentes, rate limiting, pub/sub para notificaciones en tiempo real, leaderboards y contadores, y sesiones de usuario.

**MongoDB - Logs y Analytics:** MongoDB almacena datos no estructurados, time-series data, eventos de usuario, y logs de aplicación.

**MinIO - Object Storage:** MinIO proporciona almacenamiento compatible con S3 para fotos de perfil, posts con imágenes, videos cortos, y archivos de chat.

### Estrategia de Caching

**L1 Cache (In-Memory):** Cada instancia de servicio mantiene un cache en memoria para datos de sesión y configuración.

**L2 Cache (Redis):** Cache compartido entre todas las instancias para feeds de usuario (`feed:{user_id}`), trending hashtags, usuarios online, y notificaciones.

**L3 Cache (CDN):** Cloudflare CDN cachea assets estáticos, imágenes optimizadas, y videos transcodificados en 200+ ubicaciones globales.

### Procesamiento de Media

**Imágenes:** El media-service utiliza Sharp para redimensionar, comprimir a WebP con fallback a JPEG, generar thumbnails (small, medium, large), y aplicar watermarks opcionales.

**Videos:** El sistema encola trabajos en BullMQ, usa FFmpeg para transcodificar a H.264, genera múltiples calidades (480p, 720p, 1080p), extrae thumbnails, y comprime para streaming adaptativo.

### Sistema de Búsqueda

**MeiliSearch:** Motor de búsqueda ultra-rápido para búsqueda de usuarios, posts, hashtags y autocompletado. Ofrece búsqueda typo-tolerant, filtros facetados, y ranking personalizable.

**PostgreSQL Full-Text Search:** Búsqueda de texto completo para contenido de posts y comentarios con soporte para múltiples idiomas.

### Seguridad y Autenticación

**Autenticación:** JWT tokens con refresh tokens, OAuth2 para Google, Facebook y Apple, 2FA con TOTP y QR codes, y verificación de email/SMS.

**Autorización:** RBAC (Role-Based Access Control) con roles (user, moderator, admin), permisos granulares por recurso, y validación de ownership en cada request.

**Protección:** Rate limiting por IP y por usuario, CORS con whitelist de dominios, Helmet.js para headers de seguridad, sanitización de inputs contra XSS, prepared statements contra SQL injection, y CSRF tokens para formularios.

---

## 4. STACK TECNOLÓGICO OPEN SOURCE

### Backend Core

**Node.js 20+ LTS:** Runtime JavaScript de alto rendimiento con soporte a largo plazo.

**Fastify:** Framework web ultra-rápido, 2x más rápido que Express, con validación de esquemas integrada y soporte para plugins.

**NestJS:** Framework empresarial con TypeScript para microservicios, arquitectura modular y dependency injection.

### Bases de Datos y Storage

**PostgreSQL 16:** Base de datos relacional con JSONB, full-text search, pgvector para embeddings, y particionamiento.

**Redis 7:** Cache en memoria con pub/sub, streams, y soporte para JSON.

**MongoDB:** Base de datos NoSQL para logs y analytics.

**MinIO:** Object storage compatible con S3, auto-hospedado.

### Procesamiento de Media

**FFmpeg:** Transcodificación y procesamiento de video.

**Sharp:** Procesamiento de imágenes en Node.js.

**Owncast:** Live streaming open source.

**Kurento:** WebRTC media server para videollamadas.

**Jitsi:** Videollamadas grupales open source.

### Búsqueda y Recomendación

**MeiliSearch:** Motor de búsqueda ultra-rápido con typo-tolerance.

**Sentence Transformers:** Embeddings para recomendaciones.

**Ollama:** Ejecutar LLMs localmente (Llama 3, Mistral).

### Mensajería y Tiempo Real

**Socket.io 4:** WebSockets para chat y notificaciones.

**BullMQ:** Sistema de colas con Redis para jobs asíncronos.

**Centrifugo:** Real-time messaging server escalable.

### AI y Machine Learning

**Llama 3.1 8B:** Modelo open source para chat IA.

**Qwen 2.5:** Modelo multilingüe open source.

**@xenova/transformers:** Sentence Transformers en JavaScript.

**TensorFlow.js:** ML en el navegador.

### Helpdesk y Soporte

**Chatwoot:** Plataforma de soporte open source con chat en vivo, email support, chatbot IA integrado, y API REST completa.

### Frontend

**Next.js 15:** Framework React con SSR y SSG.

**React 19:** Biblioteca UI con Server Components.

**TailwindCSS 4:** Estilos utility-first.

**Framer Motion:** Animaciones fluidas.

**SWR:** Data fetching y cache.

**Zustand:** State management ligero.

### Mobile

**React Native:** Apps iOS/Android nativas.

**Expo:** Toolchain para React Native.

**Capacitor:** Alternativa a Cordova.

### CDN y Edge

**Cloudflare:** CDN global gratuito con R2 storage.

**BunnyCDN:** CDN económico para video.

### Monitoreo y Logs

**Grafana:** Dashboards de métricas.

**Prometheus:** Sistema de métricas.

**Loki:** Agregación de logs.

**Jaeger:** Distributed tracing.

**Sentry:** Error tracking.

### DevOps

**Docker:** Containerización de servicios.

**Docker Compose:** Orquestación para desarrollo.

**GitHub Actions:** CI/CD gratuito.

**K3s:** Kubernetes ligero para producción.

### Pagos

**PayPal SDK:** Integración PayPal.

**Mercado Pago SDK:** Integración Mercado Pago.

---

## 5. IDIOMAS Y LOCALIZACIÓN

### Top 20 Idiomas Implementados

La plataforma soportará los siguientes idiomas basados en número de hablantes y poder adquisitivo:

**Idiomas Tier 1 (Mercados Principales):**
1. Inglés (EN) - 1,528M hablantes - Lengua franca global
2. Español (ES) - 559M hablantes - América Latina + España
3. Chino Mandarín (ZH) - 1,184M hablantes - Mercado asiático
4. Francés (FR) - 310M hablantes - Europa + África
5. Portugués (PT) - 264M hablantes - Brasil + Portugal

**Idiomas Tier 2 (Mercados Emergentes):**
6. Árabe (AR) - 274M hablantes - Medio Oriente + Norte África
7. Hindi (HI) - 609M hablantes - India
8. Ruso (RU) - 258M hablantes - Europa del Este
9. Alemán (DE) - 134M hablantes - Europa Central
10. Japonés (JA) - 125M hablantes - Alto poder adquisitivo

**Idiomas Tier 3 (Expansión Global):**
11. Bengalí (BN) - 272M hablantes - Bangladesh + India
12. Coreano (KO) - 82M hablantes - Alto poder adquisitivo
13. Italiano (IT) - 68M hablantes - Italia
14. Turco (TR) - 88M hablantes - Turquía
15. Indonesio (ID) - 199M hablantes - Indonesia

**Idiomas Tier 4 (Nichos Estratégicos):**
16. Urdu (UR) - 231M hablantes - Pakistán
17. Tailandés (TH) - 61M hablantes - Tailandia
18. Polaco (PL) - 41M hablantes - Polonia
19. Neerlandés (NL) - 25M hablantes - Países Bajos
20. Vietnamita (VI) - 85M hablantes - Vietnam

### Variantes Regionales

**Español:** ES (España), MX (México), AR (Argentina), CL (Chile), CO (Colombia)  
**Inglés:** US (USA), GB (Reino Unido), AU (Australia), CA (Canadá)  
**Francés:** FR (Francia), CA (Canadá)  
**Portugués:** BR (Brasil), PT (Portugal)  
**Chino:** CN (Simplificado), TW (Tradicional)

### Sistema de Traducción

**Detección Automática:** El sistema detecta el idioma del usuario basándose en la configuración del navegador, ubicación geográfica, y preferencias de perfil.

**Traducción de Contenido:** El i18n-service utiliza LibreTranslate (auto-hospedado) o Google Translate API para traducir contenido generado por usuarios cuando sea necesario.

**Base de Conocimientos Multiidioma:** El AI Helpdesk tiene 150 FAQs traducidas en los 20 idiomas, con embeddings generados para cada idioma.

---

## 6. PLAN DE IMPLEMENTACIÓN - ETAPA 1: FACEBOOK

### Objetivo de la Etapa

Implementar las funcionalidades principales de una red social tipo Facebook: feed de posts, comentarios, reacciones, sistema de amigos, grupos, marketplace y eventos. Esta etapa establece la fundación social de la plataforma.

### Microservicios a Implementar

**1-auth-service (Puerto 5001):** Gestiona registro, login, JWT tokens, OAuth2 (Google, Facebook, Apple), 2FA con TOTP, verificación de email/SMS, y password reset.

**2-user-service (Puerto 5002):** Maneja perfiles de usuario, configuración de privacidad, sistema de amigos (solicitudes, aceptación, bloqueo), búsqueda de usuarios, y verificación de cuentas.

**3-social-service (Puerto 5003):** El servicio más complejo, gestiona el feed principal (timeline), posts (texto, imágenes, videos), comentarios anidados, reacciones (like, love, wow, haha, sad, angry), compartir posts, menciones y tags.

**8-group-service (Puerto 5008):** Administra grupos y comunidades, roles y permisos (admin, moderator, member), posts de grupo, reglas y moderación.

**9-marketplace-service (Puerto 5009):** Maneja listados de productos, categorías, búsqueda y filtros, mensajería vendedor-comprador, y sistema de ratings.

**10-notification-service (Puerto 5010):** Gestiona notificaciones push, notificaciones in-app, email notifications, SMS notifications, y preferencias de notificación.

**18-event-service (Puerto 5018):** Administra creación de eventos, RSVP y asistencia, eventos virtuales, calendario, y recordatorios.

### Estructura de Carpetas Detallada

```
petamigos-global/
├── services/
│   ├── 1-auth-service/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/auth.routes.ts
│   │   │   ├── controllers/auth.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── token.service.ts
│   │   │   │   ├── password.service.ts
│   │   │   │   └── email.service.ts
│   │   │   └── validators/auth.validator.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── 2-user-service/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── user.routes.ts
│   │   │   │   └── friendship.routes.ts
│   │   │   ├── controllers/
│   │   │   │   ├── user.controller.ts
│   │   │   │   └── friendship.controller.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       └── friendship.model.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── 3-social-service/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── feed.routes.ts
│   │   │   │   ├── post.routes.ts
│   │   │   │   ├── comment.routes.ts
│   │   │   │   └── reaction.routes.ts
│   │   │   ├── controllers/
│   │   │   │   ├── feed.controller.ts
│   │   │   │   ├── post.controller.ts
│   │   │   │   ├── comment.controller.ts
│   │   │   │   └── reaction.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── feed.service.ts
│   │   │   │   └── cache.service.ts
│   │   │   └── models/
│   │   │       ├── post.model.ts
│   │   │       ├── comment.model.ts
│   │   │       └── reaction.model.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── [otros servicios...]
│
├── packages/
│   ├── db-main/
│   │   ├── schema.sql
│   │   └── migrations/
│   │       └── 001-initial-schema.js
│   ├── config-main/
│   │   ├── .env.example
│   │   └── index.ts
│   └── types-main/
│       └── src/
│           ├── user.types.ts
│           ├── post.types.ts
│           └── index.ts
│
├── client/
│   └── src/
│       ├── components/
│       │   └── feed/
│       │       ├── Feed.tsx
│       │       ├── Post.tsx
│       │       ├── Comment.tsx
│       │       └── CreatePost.tsx
│       └── lib/api/
│           ├── auth.ts
│           ├── user.ts
│           └── social.ts
│
└── docker-compose.yml
```

### Esquema de Base de Datos - Tablas Principales

**users:** id (UUID, PK), username (VARCHAR, UNIQUE), email (VARCHAR, UNIQUE), password_hash (VARCHAR), phone (VARCHAR), avatar_url (VARCHAR), cover_url (VARCHAR), bio (TEXT), location (GEOGRAPHY), language (VARCHAR), timezone (VARCHAR), verified (BOOLEAN), premium (BOOLEAN), created_at (TIMESTAMP), updated_at (TIMESTAMP), last_active_at (TIMESTAMP)

**posts:** id (UUID, PK), user_id (UUID, FK), type (ENUM: text, image, video, poll), content (TEXT), media_urls (JSONB), visibility (ENUM: public, friends, private), location (GEOGRAPHY), hashtags (TEXT[]), mentions (UUID[]), likes_count (INTEGER), comments_count (INTEGER), shares_count (INTEGER), created_at (TIMESTAMP), updated_at (TIMESTAMP)

**comments:** id (UUID, PK), post_id (UUID, FK), user_id (UUID, FK), parent_id (UUID, FK, nullable), content (TEXT), likes_count (INTEGER), created_at (TIMESTAMP)

**reactions:** id (UUID, PK), user_id (UUID, FK), target_id (UUID), target_type (ENUM: post, comment), type (ENUM: like, love, wow, haha, sad, angry), created_at (TIMESTAMP), UNIQUE(user_id, target_id, target_type)

**friendships:** id (UUID, PK), user_id (UUID, FK), friend_id (UUID, FK), status (ENUM: pending, accepted, blocked), created_at (TIMESTAMP), updated_at (TIMESTAMP), UNIQUE(user_id, friend_id)

### Componentes de Frontend

**Feed.tsx:** Componente principal que obtiene y renderiza el feed del usuario. Implementa infinite scroll con intersection observer, pull-to-refresh, y skeleton loading.

**Post.tsx:** Componente para renderizar un post individual con imagen/video, texto, reacciones, contador de comentarios, botón de compartir, y menú de opciones (editar, eliminar, reportar).

**Comment.tsx:** Componente para un comentario con soporte para respuestas anidadas (hasta 3 niveles), reacciones, y opciones de edición/eliminación.

**CreatePost.tsx:** Formulario para crear posts con editor de texto rico, upload de imágenes/videos, selector de visibilidad, y preview antes de publicar.

### Instrucciones para Kimi.com

1. **Framework Backend:** Utilizar Fastify en lugar de Express para todos los servicios nuevos. Configurar con TypeScript estricto.

2. **Base de Datos:** Usar el driver `pg` para PostgreSQL. Implementar connection pooling con PgBouncer. Todas las queries deben usar prepared statements.

3. **Validación:** Usar `zod` para validación de esquemas en todas las rutas. Validar tanto en frontend como backend.

4. **Caching:** Implementar caching con Redis en el social-service. Cachear feeds con TTL de 5 minutos. Invalidar cache al crear nuevo post.

5. **Autenticación:** Todos los endpoints (excepto login/register) deben requerir JWT token válido. Implementar middleware de autenticación.

6. **Paginación:** Usar cursor-based pagination para feeds y listas largas. Limit de 20 items por página.

7. **Tests:** Generar tests unitarios para cada servicio usando Jest. Coverage mínimo del 70%.

---

## 7. PLAN DE IMPLEMENTACIÓN - ETAPA 2: TIKTOK & INSTAGRAM

### Objetivo de la Etapa

Agregar funcionalidades de contenido multimedia efímero (stories) y videos cortos virales (reels) con algoritmo de recomendación, similar a TikTok e Instagram. Esta etapa transforma la plataforma en un hub de entretenimiento visual.

### Microservicios a Implementar

**4-story-service (Puerto 5004):** Gestiona stories efímeras de 24 horas, vistas de stories, respuestas a stories, y highlights permanentes.

**5-reel-service (Puerto 5005):** Administra videos cortos verticales, algoritmo de recomendación, duets y stitches, efectos y filtros, y sounds library.

**12-media-service (Puerto 5012):** Centraliza upload de imágenes/videos, procesamiento de imágenes con Sharp, transcodificación de video con FFmpeg, generación de thumbnails, y compresión optimizada.

**17-recommendation-service (Puerto 5017):** Implementa el algoritmo de feed para reels, recomendación de usuarios, recomendación de contenido, trending content, y personalización basada en ML.

### Estructura de Carpetas Detallada

```
petamigos-global/
├── services/
│   ├── 4-story-service/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/story.routes.ts
│   │   │   ├── controllers/story.controller.ts
│   │   │   ├── models/story.model.ts
│   │   │   ├── services/story.service.ts
│   │   │   └── jobs/story.cleanup.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── 5-reel-service/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/reel.routes.ts
│   │   │   ├── controllers/
│   │   │   │   ├── reel.controller.ts
│   │   │   │   └── feed.controller.ts
│   │   │   ├── models/reel.model.ts
│   │   │   └── services/reel.service.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── 12-media-service/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/upload.routes.ts
│   │   │   ├── controllers/upload.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── image.service.ts
│   │   │   │   ├── video.service.ts
│   │   │   │   └── storage.service.ts
│   │   │   └── workers/video.worker.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── 17-recommendation-service/
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/recommend.routes.ts
│       │   ├── controllers/recommend.controller.ts
│       │   ├── services/
│       │   │   ├── recommendation.service.ts
│       │   │   └── feature.service.ts
│       │   └── models/
│       ├── package.json
│       └── Dockerfile
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── stories/
│       │   │   ├── StoryViewer.tsx
│       │   │   └── StoryTray.tsx
│       │   └── reels/
│       │       ├── ReelPlayer.tsx
│       │       └── Reel.tsx
│       └── app/
│           └── (main)/
│               ├── reels/page.tsx
│               └── stories/[userId]/page.tsx
│
└── docker-compose.yml
```

### Esquema de Base de Datos - Tablas Adicionales

**stories:** id (UUID, PK), user_id (UUID, FK), media_url (VARCHAR), type (ENUM: image, video), views_count (INTEGER), expires_at (TIMESTAMP), created_at (TIMESTAMP)

**story_views:** id (UUID, PK), story_id (UUID, FK), viewer_id (UUID, FK), viewed_at (TIMESTAMP), UNIQUE(story_id, viewer_id)

**reels:** id (UUID, PK), user_id (UUID, FK), video_url (VARCHAR), thumbnail_url (VARCHAR), caption (TEXT), sound_id (UUID, FK), hashtags (TEXT[]), views_count (INTEGER), likes_count (INTEGER), comments_count (INTEGER), shares_count (INTEGER), created_at (TIMESTAMP)

**reel_interactions:** id (UUID, PK), reel_id (UUID, FK), user_id (UUID, FK), interaction_type (ENUM: view, like, share, comment), watch_time (INTEGER), created_at (TIMESTAMP)

### Algoritmo de Recomendación para Reels

**Fase 1: Obtención de Candidatos**  
El sistema obtiene reels candidatos de las últimas 48 horas que no han sido vistos por el usuario. Filtra por idioma del usuario y excluye usuarios bloqueados.

**Fase 2: Extracción de Features**  
Para cada reel candidato, se extraen features: hashtags, caption (convertido a embedding), sonido usado, creador del reel, y métricas de engagement (likes/views ratio).

Para el usuario, se extraen features: hashtags de reels que le gustaron, creadores que sigue, tiempo promedio de visualización, y horario de uso.

**Fase 3: Cálculo de Score**  
Se calcula un score de relevancia para cada reel usando la fórmula:

```
score = (0.4 * similitud_hashtags) + 
        (0.3 * similitud_embedding) + 
        (0.2 * engagement_rate) + 
        (0.1 * freshness_score)
```

**Fase 4: Ranking y Diversificación**  
Los reels se ordenan por score descendente. Se aplica diversificación para evitar mostrar múltiples reels del mismo creador consecutivamente. Se inyectan reels de creadores nuevos (cold start) cada 10 reels.

### Procesamiento de Video

**Upload:** El usuario sube un video al media-service. El servicio valida formato (MP4, MOV), duración (15s-10min), y tamaño (max 500MB). El video se guarda temporalmente y se encola un job en BullMQ.

**Transcodificación:** El video.worker toma el job y usa FFmpeg para transcodificar a H.264 con diferentes calidades (480p, 720p, 1080p). Genera un thumbnail extrayendo un frame a los 2 segundos. Comprime el audio a AAC 128kbps.

**Almacenamiento:** Los videos transcodificados se suben a MinIO en la carpeta `reels/{userId}/{reelId}/`. Se genera un manifest HLS para streaming adaptativo. El estado del reel en la DB cambia de `PROCESSING` a `READY`.

### Componentes de Frontend

**StoryViewer.tsx:** Componente fullscreen que muestra stories con barras de progreso en la parte superior. Tap izquierdo/derecho para navegar. Swipe down para cerrar. Muestra contador de vistas y respuestas.

**StoryTray.tsx:** Barra horizontal en la parte superior del feed que muestra avatares de usuarios con stories activas. Anillo de color indica story no vista. Primer avatar es "Tu Story" para crear nueva.

**ReelPlayer.tsx:** Componente fullscreen que implementa scroll vertical infinito de reels. Cada video se reproduce automáticamente al entrar en viewport. Precarga el siguiente y el anterior. Muestra botones de like, comment, share en el lado derecho.

**Reel.tsx:** Componente individual de reel con video, caption, hashtags, información del creador, y botones de interacción. Implementa double-tap para like.

### Instrucciones para Kimi.com

1. **Procesamiento de Video:** El media-service debe usar FFmpeg instalado en el contenedor Docker. Usar el worker pattern con BullMQ para procesamiento asíncrono.

2. **Algoritmo de Recomendación:** Implementar primero una versión simple basada en popularidad. En v2, agregar embeddings con Sentence Transformers.

3. **Optimización Frontend:** El ReelPlayer debe usar react-window para virtualización. Implementar preloading de videos con `<link rel="prefetch">`.

4. **Stories Cleanup:** El job de limpieza debe ejecutarse cada hora usando node-cron. Eliminar stories con `expires_at < NOW()`.

5. **Métricas:** Registrar todas las interacciones en `reel_interactions` para entrenar el algoritmo de recomendación.

---

## 8. SISTEMA AI HELPDESK 24/7

### Objetivo del Sistema

Proporcionar soporte al cliente automatizado 24/7 en los 20 idiomas de la plataforma, capaz de responder automáticamente a las 150 preguntas más frecuentes con alta precisión, escalar tickets complejos a agentes humanos, y aprender de nuevas interacciones para mejorar continuamente.

### Arquitectura del Sistema

El sistema se compone de tres elementos principales:

**Chatwoot:** Plataforma open source de soporte al cliente que proporciona la interfaz de chat, gestión de tickets, panel de administración, y sistema de asignación a agentes.

**Helpdesk-AI-Service:** Microservicio personalizado que contiene la lógica de NLP, búsqueda en la base de conocimientos, generación de respuestas con LLM, y aprendizaje automático.

**Knowledge Base:** Repositorio estructurado de 150 FAQs en 20 idiomas con embeddings pre-generados para búsqueda semántica eficiente.

### Microservicios a Implementar

**16-helpdesk-service (Puerto 5016):** Gestiona chatbot IA 24/7, tickets de soporte, base de conocimientos, FAQ multiidioma, y escalación a humanos.

**20-i18n-service (Puerto 5020):** Maneja traducciones automáticas, gestión de idiomas, detección de idioma, y localización de contenido.

### Flujo de Trabajo del Chatbot

**Paso 1: Recepción de Mensaje**  
El usuario envía un mensaje en el chat de la plataforma. El frontend envía el mensaje a Chatwoot mediante su API. Chatwoot dispara un webhook al helpdesk-service con el evento `message_created`.

**Paso 2: Procesamiento del Mensaje**  
El helpdesk-service recibe el webhook y extrae el texto del mensaje y el idioma del usuario. Si el idioma no está en los 20 soportados, traduce la pregunta al inglés usando el i18n-service.

**Paso 3: Búsqueda en Knowledge Base**  
El sistema genera el embedding del vector de la pregunta usando Sentence Transformers (modelo `all-MiniLM-L6-v2`). Calcula la similitud coseno con todos los embeddings de las preguntas en la KB del idioma correspondiente. Obtiene la pregunta más similar y su score de confianza.

**Paso 4: Decisión de Respuesta**  
Si la confianza es alta (> 85%), responde automáticamente con la respuesta de la KB y marca el ticket como `auto-resolved`. Si la confianza es media (60-85%), responde con "¿Te refieres a...?" y muestra 2-3 opciones de preguntas similares. Si la confianza es baja (< 60%), escala el ticket a un agente humano con el mensaje "Un agente te atenderá pronto".

**Paso 5: Generación de Respuesta con LLM (Fallback)**  
Si no hay respuesta en la KB pero la confianza es media, el sistema usa Llama 3.1 8B a través de Ollama para generar una respuesta contextual. La respuesta se valida antes de enviarla al usuario.

**Paso 6: Registro y Aprendizaje**  
Todas las interacciones se registran en la tabla `helpdesk_interactions` con los campos: pregunta, respuesta, fue_útil, score_confianza, idioma, resuelto_automáticamente, escalado_a_humano.

### Base de Conocimientos

La KB consiste en 20 archivos JSON (uno por idioma) con 150 preguntas frecuentes cada uno. Cada entrada tiene la estructura:

```json
{
  "id": "faq-001",
  "question": "¿Cómo creo una cuenta?",
  "answer": "Para crear una cuenta, haz clic en...",
  "category": "account",
  "tags": ["registro", "cuenta", "email"],
  "embedding": [0.123, 0.456, ...]
}
```

Las categorías incluyen: account (cuenta), privacy (privacidad), posts (publicaciones), security (seguridad), payments (pagos), technical (técnico), community (comunidad), y moderation (moderación).

### Aprendizaje Automático

**Recopilación de Datos:** Cada interacción se registra con feedback del usuario (thumbs up/down para "¿Fue útil esta respuesta?").

**Análisis de Tickets Escalados:** Un job recurrente (cada 24 horas) analiza los tickets que fueron escalados a humanos. Extrae las preguntas y las respuestas dadas por los agentes. Usa clustering (K-Means) para agrupar preguntas similares.

**Sugerencia de Nuevas FAQs:** Si un cluster tiene más de 10 preguntas similares, el sistema sugiere agregar una nueva entrada a la KB. Un administrador revisa y aprueba la sugerencia en el panel de administración.

**Actualización de la KB:** Las nuevas FAQs aprobadas se agregan a los archivos JSON. Los embeddings se regeneran automáticamente. El sistema se recarga sin downtime.

### Integración con Chatwoot

**Instalación:** Chatwoot se ejecuta como contenedor Docker con PostgreSQL y Redis. Se configura con las variables de entorno necesarias.

**Configuración del Webhook:** En el panel de Chatwoot, se crea un webhook con la URL `http://helpdesk-service:5016/webhook/chatwoot` y se seleccionan los eventos `message_created` y `conversation_created`.

**Respuesta Automática:** El helpdesk-service usa la API de Chatwoot para enviar mensajes de respuesta mediante `POST /api/v1/accounts/{accountId}/conversations/{conversationId}/messages`.

**Asignación a Agente:** Si el ticket se escala, el servicio asigna el ticket a un agente disponible mediante `POST /api/v1/accounts/{accountId}/conversations/{conversationId}/assignments`.

### Instrucciones para Kimi.com

1. **Modelo de IA:** Usar Llama 3.1 8B Instruct a través de Ollama. Ollama debe ejecutarse en un contenedor Docker separado con GPU si está disponible.

2. **Embeddings:** Usar `@xenova/transformers` con el modelo `all-MiniLM-L6-v2` para generar embeddings de 384 dimensiones.

3. **Base de Datos de Vectores:** Instalar la extensión `pgvector` en PostgreSQL para almacenar embeddings. Crear índice HNSW para búsqueda eficiente.

4. **Generación de KB:** Generar el archivo `es.json` con 150 FAQs en español. Usar Google Translate API o DeepL para traducir a los otros 19 idiomas. Los embeddings se generan al iniciar el servicio.

5. **Panel de Administración:** Crear una página en el frontend (`/admin/helpdesk`) donde los administradores puedan ver interacciones recientes, aprobar nuevas FAQs sugeridas, y editar la KB.

---

## 9. SISTEMA DE PAGOS

### Objetivo del Sistema

Implementar un sistema de pagos flexible y seguro que soporte PayPal (global), Mercado Pago (América Latina), y transferencias bancarias SPEI (México), eliminando la dependencia de Stripe y Vercel según los requerimientos del cliente.

### Métodos de Pago

**PayPal:** Método de pago global ampliamente usado en América del Norte, Europa y Asia. Soporta pagos únicos y suscripciones recurrentes. Integración mediante SDK oficial de PayPal.

**Mercado Pago:** Método de pago dominante en América Latina (México, Argentina, Brasil, Chile, Colombia). Soporta tarjetas de crédito/débito, efectivo en tiendas, y transferencias bancarias. Integración mediante SDK oficial de Mercado Pago.

**SPEI (México):** Sistema de Pagos Electrónicos Interbancarios de México. Permite transferencias bancarias en tiempo real. Requiere generar una CLABE interbancaria única por transacción. Integración mediante proveedor como Conekta u Openpay.

### Microservicio a Implementar

**15-payment-service (Puerto 5015):** Gestiona integración PayPal, integración Mercado Pago, transferencias bancarias SPEI, suscripciones premium, y sistema de treats (moneda virtual).

### Flujo de Pago con PayPal

**Paso 1: Crear Orden**  
El usuario selecciona un plan de suscripción y hace clic en "Pagar con PayPal". El frontend llama a `POST /api/paypal/create-order` con el `planId`. El payment-service crea una orden en PayPal usando el SDK y devuelve el `orderId`.

**Paso 2: Aprobar Pago**  
El frontend abre el popup de PayPal con el `orderId`. El usuario inicia sesión en PayPal y aprueba el pago. PayPal redirige de vuelta a la aplicación.

**Paso 3: Capturar Pago**  
El frontend llama a `POST /api/paypal/capture-order` con el `orderId`. El payment-service captura el pago en PayPal. Actualiza el estado del pago en la DB a `COMPLETED`. Activa la suscripción del usuario. Envía notificación de confirmación.

**Paso 4: Webhook**  
PayPal envía un webhook al endpoint `POST /api/webhooks/paypal` con el evento `PAYMENT.CAPTURE.COMPLETED`. El servicio verifica la firma del webhook. Actualiza el estado del pago si aún no se había procesado (idempotencia).

### Flujo de Pago con Mercado Pago

**Paso 1: Crear Preferencia**  
El usuario selecciona un plan y hace clic en "Pagar con Mercado Pago". El frontend llama a `POST /api/mercadopago/create-preference` con el `planId`. El payment-service crea una preferencia de pago en Mercado Pago con los detalles del producto y las URLs de callback. Devuelve el `initPoint` (URL del checkout).

**Paso 2: Checkout**  
El frontend redirige al usuario al `initPoint` de Mercado Pago. El usuario selecciona su método de pago (tarjeta, efectivo, transferencia) y completa el pago.

**Paso 3: Callback**  
Mercado Pago redirige al usuario a la URL de success o failure. El frontend llama a `GET /api/mercadopago/success?payment_id={id}`. El payment-service obtiene los detalles del pago desde Mercado Pago. Actualiza el estado del pago en la DB. Activa la suscripción del usuario.

**Paso 4: Webhook**  
Mercado Pago envía un webhook al endpoint `POST /api/webhooks/mercadopago` con el evento `payment`. El servicio verifica la firma del webhook. Obtiene los detalles del pago. Actualiza el estado del pago si aún no se había procesado.

### Flujo de Pago con SPEI

**Paso 1: Generar Referencia**  
El usuario selecciona un plan y hace clic en "Transferencia SPEI". El frontend llama a `POST /api/spei/generate-reference` con el `planId`. El payment-service genera una CLABE interbancaria única y una referencia de pago. Devuelve la CLABE, el monto, la referencia, y las instrucciones de pago.

**Paso 2: Realizar Transferencia**  
El usuario copia la CLABE y la referencia. Ingresa a su banca en línea y realiza la transferencia. El pago se procesa en 24-48 horas.

**Paso 3: Verificación Manual (v1)**  
Un administrador verifica manualmente que el pago fue recibido en la cuenta bancaria. Llama a `POST /api/spei/verify-payment` con la referencia. El payment-service actualiza el estado del pago a `COMPLETED`. Activa la suscripción del usuario.

**Paso 4: Verificación Automática (v2)**  
En producción, se integra con un proveedor como Conekta u Openpay que proporciona webhooks automáticos cuando se recibe una transferencia SPEI. El webhook actualiza el estado del pago automáticamente.

### Esquema de Base de Datos

**payments:** id (UUID, PK), user_id (UUID, FK), amount (DECIMAL(10, 2)), currency (VARCHAR(3)), method (VARCHAR(50)), status (VARCHAR(20)), external_id (VARCHAR(255)), metadata (JSONB), created_at (TIMESTAMP), updated_at (TIMESTAMP)

**subscriptions:** id (UUID, PK), user_id (UUID, FK), plan_id (VARCHAR(50)), status (VARCHAR(20)), payment_method (VARCHAR(50)), current_period_start (TIMESTAMP), current_period_end (TIMESTAMP), cancel_at_period_end (BOOLEAN), created_at (TIMESTAMP), updated_at (TIMESTAMP)

**transactions:** id (UUID, PK), user_id (UUID, FK), payment_id (UUID, FK), type (VARCHAR(50)), amount (DECIMAL(10, 2)), currency (VARCHAR(3)), description (TEXT), created_at (TIMESTAMP)

### Planes de Suscripción

| Plan | Precio USD | Precio MXN | Características |
|------|------------|------------|-----------------|
| Free | $0 | $0 | Funcionalidades básicas, con anuncios |
| Basic | $4.99 | $99 | Sin anuncios, 2x treats mensuales |
| Premium | $9.99 | $199 | Basic + verificación, badges, analytics |
| Pro | $19.99 | $399 | Premium + prioridad en soporte, API access |

### Seguridad

**Verificación de Webhooks:** Siempre verificar la firma de los webhooks usando las claves secretas de PayPal/Mercado Pago para asegurar que provienen de la fuente legítima.

**HTTPS:** Todos los endpoints de pago deben usar HTTPS obligatoriamente. Configurar certificados SSL/TLS con Let's Encrypt.

**Idempotencia:** Los pagos deben ser idempotentes. Si un webhook se recibe dos veces, no se debe procesar dos veces. Usar `external_id` como clave de idempotencia.

**Logs:** Registrar todas las transacciones en la tabla `transactions` para auditoría. Incluir timestamp, monto, método, y estado.

**Validación de Montos:** Siempre validar que el monto recibido en el webhook coincida con el monto esperado en la DB. Si no coincide, marcar como `FRAUD_SUSPECTED`.

### Instrucciones para Kimi.com

1. **SDKs Oficiales:** Usar `@paypal/checkout-server-sdk` para PayPal y `mercadopago` para Mercado Pago. No usar librerías de terceros.

2. **Variables de Entorno:** Todas las credenciales deben estar en `.env`: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_PUBLIC_KEY`.

3. **Modo Sandbox:** Implementar primero en modo sandbox/test para ambas plataformas. Cambiar a producción solo cuando todo esté probado y aprobado.

4. **Renovación Automática:** Implementar un job recurrente con `node-cron` que se ejecute diariamente a las 00:00 UTC para renovar suscripciones que vencen ese día.

5. **SPEI en Producción:** Para SPEI en producción, integrar con Conekta (https://conekta.com) o Openpay (https://openpay.mx) que proporcionan APIs para generar CLABEs y webhooks automáticos.

---

## 10. ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Fundación (Semanas 1-2)

**Objetivo:** Establecer la infraestructura base y migrar de MongoDB a PostgreSQL.

**Tareas:**
- Configurar Docker Compose con PostgreSQL, Redis, MinIO, MeiliSearch
- Migrar esquema de MongoDB a PostgreSQL
- Implementar auth-service con JWT y 2FA
- Implementar user-service con perfiles y amigos
- Setup de CI/CD con GitHub Actions
- Configurar Cloudflare CDN

**Entregables:** Infraestructura base funcionando, autenticación completa, perfiles de usuario.

### Fase 2: Social Core (Semanas 3-4)

**Objetivo:** Implementar las funcionalidades principales de red social tipo Facebook.

**Tareas:**
- Implementar social-service (posts, comentarios, reacciones)
- Implementar notification-service
- Implementar feed algorítmico básico (cronológico)
- Desarrollar componentes de frontend (Feed, Post, Comment)
- Integrar Socket.io para notificaciones en tiempo real

**Entregables:** Feed social funcionando, sistema de posts y comentarios, notificaciones en tiempo real.

### Fase 3: Multimedia (Semanas 5-6)

**Objetivo:** Agregar soporte para contenido multimedia efímero y videos cortos.

**Tareas:**
- Implementar story-service con cleanup automático
- Implementar reel-service con feed de descubrimiento
- Implementar media-service con procesamiento de imágenes y videos
- Integrar FFmpeg para transcodificación de video
- Setup de BunnyCDN para delivery de video
- Desarrollar componentes de frontend (StoryViewer, ReelPlayer)

**Entregables:** Stories funcionando, reels con feed de descubrimiento, procesamiento de video optimizado.

### Fase 4: Comunicación (Semanas 7-8)

**Objetivo:** Mejorar el sistema de mensajería y agregar videollamadas.

**Tareas:**
- Mejorar chat-service con grupos y mensajes de voz
- Integrar Jitsi para videollamadas
- Implementar cifrado E2E opcional
- Implementar group-service para comunidades
- Desarrollar componentes de frontend (Chat, VideoCall)

**Entregables:** Mensajería robusta, videollamadas funcionando, grupos y comunidades.

### Fase 5: Discovery (Semanas 9-10)

**Objetivo:** Implementar búsqueda avanzada y algoritmo de recomendación.

**Tareas:**
- Implementar search-service con MeiliSearch
- Implementar recommendation-service con embeddings
- Implementar algoritmo de feed personalizado
- Implementar trending content y hashtags
- Desarrollar componentes de frontend (SearchBar, Trending)

**Entregables:** Búsqueda global funcionando, recomendaciones personalizadas, trending topics.

### Fase 6: Monetización (Semanas 11-12)

**Objetivo:** Implementar sistema de pagos y suscripciones.

**Tareas:**
- Implementar payment-service con PayPal y Mercado Pago
- Integrar SPEI para México
- Implementar sistema de suscripciones
- Implementar marketplace-service básico
- Desarrollar componentes de frontend (PaymentModal, Pricing)

**Entregables:** Pagos funcionando, suscripciones activas, marketplace básico.

### Fase 7: Soporte (Semanas 13-14)

**Objetivo:** Implementar AI Helpdesk 24/7 multiidioma.

**Tareas:**
- Implementar helpdesk-service con Chatwoot
- Integrar Ollama con Llama 3.1 8B
- Generar base de conocimientos en 20 idiomas
- Implementar i18n-service para traducciones
- Desarrollar panel de administración de helpdesk

**Entregables:** Chatbot IA funcionando, soporte 24/7 en 20 idiomas, panel de administración.

### Fase 8: Optimización y Lanzamiento (Semanas 15-16)

**Objetivo:** Optimizar performance, realizar pruebas de carga y lanzar a producción.

**Tareas:**
- Performance tuning de queries y APIs
- Load testing con k6 o Artillery
- Security audit completo
- Setup de monitoreo con Grafana y Prometheus
- Deployment a producción (Render + Netlify inicialmente)
- Campaña de lanzamiento

**Entregables:** Plataforma optimizada, pruebas de carga completadas, lanzamiento público.

---

## 11. ESTIMACIÓN DE COSTOS

### Escenario 1: Primer Mes (0-10,000 usuarios) - Open Source Total

**Objetivo:** Costo $0 usando solo herramientas gratuitas y open source.

**Infraestructura:**
- Render.com: $0 (free tier con limitaciones de 512MB RAM)
- Netlify: $0 (free tier con 100GB bandwidth)
- Supabase: $0 (free tier con 500MB DB, 1GB storage)
- Cloudflare: $0 (free tier con CDN ilimitado)
- Redis Cloud: $0 (free tier con 30MB)

**Limitaciones:** Servicios dormirán después de 15 minutos de inactividad, latencia más alta, sin auto-scaling.

**Total:** **$0/mes** ✅

### Escenario 2: Crecimiento Inicial (10,000-50,000 usuarios) - VPS Económico

**Objetivo:** Migrar a VPS auto-gestionado cuando se generen primeras ganancias.

**Infraestructura:**
- Hetzner CPX31 (4 vCPU, 8GB RAM, 160GB SSD): €13.00/mes
- Hetzner CPX21 (3 vCPU, 4GB RAM, 80GB SSD) x2: €9.00/mes x2 = €18.00/mes
- Cloudflare R2: $0.015/GB storage + $0/GB egress ≈ €5/mes
- BunnyCDN: $0.01/GB para video ≈ €20/mes
- Backups: €5/mes

**Total:** **€61/mes (~$65 USD/mes)**

### Escenario 3: Escalamiento (50,000-100,000 usuarios) - Cloud Híbrido

**Objetivo:** Combinar VPS para servicios core y cloud para servicios que necesitan auto-scaling.

**Infraestructura:**
- Hetzner CPX51 (16 vCPU, 32GB RAM): €45.00/mes
- Render Pro: $25/mes por servicio x 3 = $75/mes
- Supabase Pro: $25/mes
- Cloudflare R2: ~$50/mes
- BunnyCDN: ~$100/mes
- Redis Cloud: $10/mes

**Total:** **€45 + $260 = ~$310/mes**

### Escenario 4: Escalamiento Masivo (100,000+ usuarios) - Full Cloud

**Objetivo:** Infraestructura cloud completamente escalable.

**Infraestructura:**
- AWS/GCP/Azure: $500-1000/mes (instancias, DB, storage)
- Cloudflare R2: $200/mes
- BunnyCDN: $500/mes
- Redis Enterprise: $100/mes
- Monitoring (Datadog): $100/mes

**Total:** **$1,400-1,900/mes**

### ROI Proyectado

**Ingresos Esperados (Mes 3):**
- 50,000 usuarios activos
- 5% conversión a Basic ($4.99) = 2,500 x $4.99 = $12,475/mes
- 1% conversión a Premium ($9.99) = 500 x $9.99 = $4,995/mes
- 0.5% conversión a Pro ($19.99) = 250 x $19.99 = $4,997.50/mes
- **Total Ingresos:** $22,467.50/mes
- **Costos Infraestructura:** $310/mes
- **Ganancia Neta:** $22,157.50/mes
- **ROI:** 7,147%

---

## 12. MÉTRICAS DE ÉXITO

### KPIs Técnicos

**Latencia API:** < 200ms p95 (percentil 95). Medido con Prometheus. Alerta si supera 300ms.

**Uptime:** > 99.9% (menos de 43 minutos de downtime al mes). Medido con UptimeRobot. Alerta inmediata si cae.

**Error Rate:** < 0.1% de requests. Medido con Sentry. Alerta si supera 0.5%.

**Time to First Byte (TTFB):** < 100ms. Medido con Lighthouse. Optimizar con CDN y caching.

**Page Load Time:** < 2s para primera carga, < 500ms para navegación. Medido con Web Vitals.

**Database Query Time:** < 50ms p95. Medido con query logs de PostgreSQL. Optimizar con índices.

**Video Processing Time:** < 2 minutos para video de 1 minuto. Medido con BullMQ metrics.

### KPIs de Negocio

**DAU (Daily Active Users):** Meta 10,000 en el primer mes, 50,000 en el tercer mes.

**MAU (Monthly Active Users):** Meta 30,000 en el primer mes, 150,000 en el tercer mes.

**Retention D1:** > 60% (usuarios que vuelven al día siguiente).

**Retention D7:** > 40% (usuarios que vuelven a la semana).

**Retention D30:** > 25% (usuarios que vuelven al mes).

**Engagement Rate:** > 60% de usuarios activos publican al menos 1 post por semana.

**Tiempo en Plataforma:** > 30 minutos/día promedio por usuario activo.

**Conversión a Premium:** > 5% de usuarios activos se suscriben a un plan de pago.

**NPS (Net Promoter Score):** > 50 (usuarios satisfechos que recomendarían la plataforma).

**Viral Coefficient:** > 1.2 (cada usuario invita a más de 1 nuevo usuario).

### KPIs de Contenido

**Posts por Usuario:** > 5 posts/mes promedio.

**Comentarios por Post:** > 3 comentarios promedio.

**Reels Views:** > 100,000 views totales por día.

**Stories Views:** > 50,000 views totales por día.

**Matches Exitosos:** > 1,000 matches por día.

### KPIs de Soporte

**Tickets Resueltos Automáticamente:** > 70% de tickets resueltos por el chatbot IA sin intervención humana.

**Tiempo de Respuesta Promedio:** < 30 segundos para respuestas automáticas, < 5 minutos para agentes humanos.

**Satisfacción del Usuario:** > 4.5/5 estrellas en encuestas post-soporte.

---

## 13. INSTRUCCIONES PARA KIMI.COM

### Contexto General

Kimi.com debe generar el código completo para cada microservicio, componente de frontend, y archivo de configuración especificado en este documento. El código debe ser production-ready, con manejo de errores robusto, logging adecuado, y tests unitarios.

### Estándares de Código

**Lenguaje:** TypeScript para todo el código (backend y frontend). Configuración estricta de TypeScript con `strict: true`.

**Framework Backend:** Fastify para todos los microservicios nuevos. Configurar con plugins para CORS, Helmet, y rate limiting.

**Framework Frontend:** Next.js 15 con App Router. React 19 con Server Components donde sea posible.

**Estilos:** TailwindCSS 4 con configuración personalizada. Usar componentes reutilizables.

**Validación:** Zod para validación de esquemas en backend y frontend.

**Testing:** Jest para tests unitarios. Coverage mínimo del 70%. Generar tests para cada controller y service.

**Linting:** ESLint con configuración de Airbnb. Prettier para formateo automático.

**Commits:** Conventional Commits (feat:, fix:, docs:, etc.).

### Estructura de Cada Microservicio

Cada microservicio debe tener la siguiente estructura:

```
service-name/
├── src/
│   ├── index.ts          # Punto de entrada
│   ├── routes/           # Definición de rutas
│   ├── controllers/      # Lógica de negocio
│   ├── services/         # Servicios auxiliares
│   ├── models/           # Modelos de datos
│   ├── validators/       # Esquemas de validación
│   └── utils/            # Utilidades
├── tests/                # Tests unitarios
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

### Configuración de Base de Datos

**PostgreSQL:** Generar el archivo `schema.sql` con todas las tablas definidas en este documento. Usar tipos UUID para IDs, TIMESTAMP para fechas, y JSONB para datos flexibles.

**Migraciones:** Usar `node-pg-migrate` para migraciones. Generar una migración inicial con todas las tablas.

**Connection Pooling:** Configurar PgBouncer con pool size de 20 conexiones por servicio.

**Índices:** Crear índices en todas las columnas de búsqueda frecuente (user_id, post_id, created_at, etc.).

### Configuración de Redis

**Estructura de Claves:** Usar namespaces para organizar claves: `feed:{userId}`, `trending:hashtags`, `session:{token}`.

**TTL:** Configurar TTL apropiado para cada tipo de dato: feeds (5 minutos), sessions (7 días), rate limits (1 hora).

**Serialización:** Usar JSON.stringify/parse para almacenar objetos complejos.

### Manejo de Errores

**Errores HTTP:** Usar códigos de estado apropiados: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error).

**Formato de Error:** Devolver errores en formato JSON consistente:
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "El email es inválido",
    "details": { "field": "email" }
  }
}
```

**Logging:** Usar `pino` para logging estructurado. Loggear todos los errores con stack trace.

### Autenticación y Autorización

**JWT:** Usar access tokens con expiración de 15 minutos y refresh tokens con expiración de 7 días.

**Middleware:** Crear middleware de autenticación que valide el JWT en cada request protegido.

**Permisos:** Implementar RBAC con roles: user, moderator, admin. Validar permisos en cada endpoint.

### Documentación

**README:** Cada servicio debe tener un README con descripción, instalación, configuración, y ejemplos de uso.

**API Docs:** Generar documentación de API con Swagger/OpenAPI para cada servicio.

**Comentarios:** Agregar JSDoc comments a todas las funciones públicas.

### Docker y Deployment

**Dockerfile:** Usar multi-stage builds para reducir tamaño de imagen. Imagen base: `node:20-alpine`.

**Docker Compose:** Generar `docker-compose.yml` con todos los servicios, PostgreSQL, Redis, MinIO, MeiliSearch, y Chatwoot.

**Environment Variables:** Todas las configuraciones deben ser via variables de entorno. Generar `.env.example` con todas las variables necesarias.

### Prioridades de Implementación

1. **Alta Prioridad (Semanas 1-4):** auth-service, user-service, social-service, notification-service, frontend básico.

2. **Media Prioridad (Semanas 5-8):** story-service, reel-service, media-service, chat-service, group-service.

3. **Baja Prioridad (Semanas 9-12):** search-service, recommendation-service, marketplace-service, event-service.

4. **Última Prioridad (Semanas 13-16):** payment-service, helpdesk-service, i18n-service, live-service.

### Notas Finales

- El código debe ser modular y reutilizable.
- Seguir principios SOLID y DRY.
- Optimizar para performance desde el inicio.
- Pensar en escalabilidad horizontal.
- Documentar todas las decisiones de arquitectura.

---

## CONCLUSIÓN

Este documento maestro proporciona una hoja de ruta completa y detallada para transformar PetAmigos en una plataforma social global multifacética 10x superior a la competencia. La arquitectura está diseñada para escalar de cero a millones de usuarios utilizando herramientas open source, con un plan claro de migración a infraestructura cloud cuando se generen ganancias.

El proyecto combina las mejores características de Facebook (red social completa), TikTok (videos virales), Instagram (contenido visual), y Tinder (matching avanzado), mientras soluciona los problemas comunes de estas plataformas mediante innovaciones en transparencia algorítmica, privacidad, bienestar digital, y monetización justa.

Con soporte para 20 idiomas, AI Helpdesk 24/7, y un sistema de pagos flexible que incluye PayPal, Mercado Pago y transferencias bancarias, la plataforma está posicionada para dominar mercados globales desde América Latina hasta Asia.

**El éxito del proyecto depende de:**
1. Implementación rigurosa siguiendo este documento
2. Pruebas exhaustivas en cada fase
3. Iteración rápida basada en feedback de usuarios
4. Enfoque en performance y escalabilidad desde el día uno
5. Construcción de comunidad antes que monetización agresiva

**Próximos Pasos Inmediatos:**
1. Kimi.com genera el código para la Fase 1 (auth-service, user-service)
2. El agente Antigravity en VS Code integra el código al proyecto
3. Deployment inicial en Render + Netlify
4. Pruebas de integración y ajustes
5. Inicio de Fase 2

---

**Documento generado por:** Manus AI  
**Fecha:** Diciembre 28, 2025  
**Versión:** 1.0  
**Contacto:** Kosovo9 - https://github.com/Kosovo9/PetAmigos-Backend

---

*Este documento es confidencial y propiedad de Kosovo9. Todos los derechos reservados.*
