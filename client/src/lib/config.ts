// Configuración centralizada del cliente
export const config = {
    apiUrl: import.meta.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    domain: import.meta.env.VITE_DOMAIN || process.env.NEXT_PUBLIC_DOMAIN || 'www.petmatch.fun',
    isDevelopment: import.meta.env.MODE === 'development',
    isProduction: import.meta.env.MODE === 'production',
};

// Helper para construir URLs de API
export const apiEndpoint = (path: string) => {
    return `${config.apiUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
