/**
 * Adaptador UI Universal
 * Responsive automático para todos los dispositivos
 * (Lógica de servidor para SSR o configuración)
 */

class UniversalAdapter {
    static getBreakpoints() {
        return {
            quantum: { min: 0, max: 320, columns: 1, scale: 0.8 },
            nano: { min: 321, max: 480, columns: 1, scale: 0.9 },
            micro: { min: 481, max: 768, columns: 2, scale: 1.0 },
            mini: { min: 769, max: 1024, columns: 3, scale: 1.1 },
            small: { min: 1025, max: 1280, columns: 4, scale: 1.2 },
            medium: { min: 1281, max: 1440, columns: 5, scale: 1.3 },
            large: { min: 1441, max: 1920, columns: 6, scale: 1.4 },
            xlarge: { min: 1921, max: 2560, columns: 8, scale: 1.5 },
            xxlarge: { min: 2561, max: 3840, columns: 12, scale: 1.6 },
            quantumX: { min: 3841, max: Infinity, columns: 16, scale: 2.0 }
        };
    }

    static getThemeConfig(mode = 'light') {
        const themes = {
            light: {
                primary: '#007AFF',
                background: '#FFFFFF',
                text: '#000000'
            },
            dark: {
                primary: '#0A84FF',
                background: '#000000',
                text: '#FFFFFF'
            },
            amoled: {
                primary: '#00FF9D',
                background: '#000000',
                text: '#FFFFFF'
            }
        };
        return themes[mode] || themes.light;
    }
}

module.exports = UniversalAdapter;
