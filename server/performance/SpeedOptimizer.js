/**
 * Optimizador de Velocidad 200X
 * Cache Strategy & Compression
 */

const compression = require('compression');

class SpeedOptimizer {
    static applyMiddleware(app) {
        // 1. Compresión Brotli/Gzip agresiva
        app.use(compression({
            level: 9, // Máxima compresión
            threshold: 0, // Comprimir todo
            filter: (req, res) => {
                if (req.headers['x-no-compression']) return false;
                return compression.filter(req, res);
            }
        }));

        // 2. Cache Headers agresivos
        app.use((req, res, next) => {
            // Static assets: 1 year cache
            if (req.url.match(/\.(css|js|jpg|png|webp|svg|woff2)$/)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
            // API responses: 5 min cache default (adjustable)
            else if (req.url.startsWith('/api/')) {
                res.setHeader('Cache-Control', 'private, no-cache'); // Default safe
            }
            next();
        });
    }
}

module.exports = SpeedOptimizer;
