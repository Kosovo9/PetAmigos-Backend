# AEO + SEO Optimization Guide – PetAmigos

## ✅ Actions Completed for Antigravity Agent
1. **Robots.txt**: Created at `client/public/robots.txt` allowing indexing but disallowing admin routes.
2. **Static Sitemap**: Created `client/public/sitemap.xml` for initial indexing.
3. **SeoHead Component**: Created `client/src/components/SeoHead.tsx` using `react-helmet-async` for managing meta tags across the app.
4. **FAQ Page**: Created `client/src/pages/Faq.tsx` with structured JSON-LD schema for Answer Engine Optimization (AEO).
5. **Backend SEO Routes**: Created `server/routes/seo.routes.ts` to serve a dynamic `sitemap.xml`.
6. **Redirects**: Configured `client/netlify.toml` to redirect `/sitemap.xml` to the backend API.

## 🚀 Next Steps
1. **Verify `og-image.jpg`**: Ensure an image named `og-image.jpg` (1200x630) exists in `client/public/`.
2. **Backend Registration**: Ensure `seo.routes.ts` is registered in `server/_core/index.ts`.
3. **Frontend Integration**: Wrap your main App component with `HelmetProvider` from `react-helmet-async`.
4. **Testing**: 
    - Validate schema using [Schema.org Validator](https://validator.schema.org).
    - Check AEO performance on Perplexity.ai.

## AEO Strategy
We use `JSON-LD` structured data in the FAQ page to help AI engines (Google SGE, Perplexity) directly parse and answer user questions using our content.
