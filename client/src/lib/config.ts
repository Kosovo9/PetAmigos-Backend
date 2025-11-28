// Configuración centralizada del cliente
export const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'www.petmatch.fun',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

// Helper para construir URLs de API
export const apiEndpoint = (path: string) => {
    return `${config.apiUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
