// Configuración PWA optimizada
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development', // Deshabilitar en dev para evitar caching agresivo
    sw: 'sw.js'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            'res.cloudinary.com',
            'lh3.googleusercontent.com',
            'platform-lookaside.fbsbx.com',
            'images.unsplash.com',
            'ui-avatars.com'
        ],
    },
    experimental: {
        // Turbopack optimizations
        optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
    },
    // Headers de seguridad y cache
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    }
                ]
            },
            // Cache agresiva para assets estáticos
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Cache para imágenes optimizadas
            {
                source: '/_next/image(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, must-revalidate',
                    },
                ],
            }
        ];
    }
};

module.exports = withPWA(nextConfig);
