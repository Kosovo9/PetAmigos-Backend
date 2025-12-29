/**
 * Motor Universal Cross-Platform para PetAmigos
 * Compatible: Mac, Linux, Windows, iOS, Android, Web
 */

class UniversalEngine {
    constructor() {
        this.platform = this.detectPlatform();
        // Default config values to avoid undefined access
        this.config = {
            isMobile: this.platform.isMobile,
            performanceMode: this.platform.isMobile ? 'battery_saver' : 'high_performance'
        };
    }

    detectPlatform() {
        // Check if running in browser environment
        if (typeof navigator === 'undefined') {
            return {
                isMobile: false,
                isServer: true,
                isDesktop: true
            };
        }

        const userAgent = navigator?.userAgent || '';
        return {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isIOS: /iPhone|iPad|iPod/i.test(userAgent),
            isAndroid: /Android/i.test(userAgent),
            isMac: /Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent),
            isWindows: /Windows NT|Win64|Win32|Win16/i.test(userAgent),
            isLinux: /Linux|X11/i.test(userAgent),
            isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
        };
    }

    initPerformance() {
        // Adaptive Performance based on device
        return {
            cacheStrategy: this.platform.isMobile ? 'aggressive' : 'balanced',
            imageQuality: this.platform.isMobile ? 'medium' : 'high',
            batchSize: this.platform.isMobile ? 10 : 50,
            timeout: this.platform.isMobile ? 10000 : 30000,
            compression: {
                images: true,
                data: true,
                level: this.platform.isMobile ? 6 : 9
            }
        };
    }

    initSecurity() {
        return {
            encryption: 'AES-256-GCM',
            keyRotation: 3600000, // 1 hour
            sessionTimeout: this.platform.isMobile ? 86400000 : 604800000, // 1 day vs 1 week
            biometric: this.platform.isMobile,
            twoFactor: true
        };
    }
}

module.exports = UniversalEngine;
