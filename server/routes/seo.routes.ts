import { Router } from "express";

const router = Router();

// Generar sitemap dinámico (puedes extender con usuarios públicos, posts, etc.)
router.get('/sitemap.xml', (req, res) => {
    const pages = [
        { url: '/', priority: 1.0, changefreq: 'daily' },
        { url: '/about', priority: 0.8, changefreq: 'monthly' },
        { url: '/faq', priority: 0.9, changefreq: 'weekly' },
        { url: '/login', priority: 0.8, changefreq: 'monthly' },
        { url: '/register', priority: 0.8, changefreq: 'monthly' },
        // Add more dynamic routes here (e.g., fetch from DB)
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
            .map((page) => {
                return `
    <url>
      <loc>https://petmatch-global.netlify.app${page.url}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `;
            })
            .join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
});

export default router;
