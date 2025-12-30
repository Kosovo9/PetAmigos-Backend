/**
 * Adaptador Universal para TODAS las tablets del mundo
 * Versión Backend Node.js
 */

const userAgentParser = require('ua-parser-js');

class UniversalTabletAdapter {
    constructor(req) {
        this.userAgent = req.headers['user-agent'] || '';
        this.parser = new userAgentParser(this.userAgent);
        this.device = this.parser.getDevice();
        this.os = this.parser.getOS();
    }

    detectTabletBrand() {
        const ua = this.userAgent;

        return {
            // Apple
            isIPad: /iPad|Macintosh/i.test(ua) && /Macintosh/i.test(ua) ? (req.headers['sec-ch-ua-platform'] === '"macOS"' && req.headers['sec-ch-ua-mobile'] === '?0' ? false : true) : /iPad/i.test(ua), // Simple detection for backend

            // Samsung
            isGalaxyTab: /SM-T|SAMSUNG.*Tablet|GT-P|SCH-I|SHW-M/i.test(ua),

            // Microsoft
            isSurface: /Surface|Microsoft/i.test(ua),

            // Amazon
            isKindleFire: /Kindle Fire|KF/i.test(ua),

            // Generic Android Tablet
            isAndroidTablet: /Android/i.test(ua) && !/Mobile/i.test(ua)
        };
    }

    getOptimizationHeaders() {
        const brand = this.detectTabletBrand();

        // Headers específicos para optimizar carga en tablets
        const headers = {
            'Vary': 'User-Agent',
            'X-UA-Device': this.device.type || 'desktop'
        };

        if (brand.isIPad) {
            headers['X-Tablet-Optimization'] = 'iPad-ProMotion';
        } else if (brand.isGalaxyTab) {
            headers['X-Tablet-Optimization'] = 'Samsung-DeX';
        } else if (brand.isKindleFire) {
            headers['X-Tablet-Optimization'] = 'Silk-LowBandwidth';
        }

        return headers;
    }
}

module.exports = UniversalTabletAdapter;
