// Configuración de seguridad mejorada del cliente
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { sanitizeObject } from './validation';

// Cliente HTTP seguro con retry y sanitización
class SecureHttpClient {
    private axiosInstance;
    private maxRetries = 3;
    private retryDelay = 1000;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
            timeout: 30000, // 30 segundos
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        // Request interceptor - sanitizar datos
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Sanitizar body
                if (config.data) {
                    config.data = sanitizeObject(config.data);
                }

                // Sanitizar query params
                if (config.params) {
                    config.params = sanitizeObject(config.params);
                }

                // Agregar CSRF token si existe
                const csrfToken = this.getCSRFToken();
                if (csrfToken) {
                    config.headers['X-CSRF-Token'] = csrfToken;
                }

                // Agregar auth token
                const authToken = this.getAuthToken();
                if (authToken) {
                    config.headers['Authorization'] = `Bearer ${authToken}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - manejo de errores
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const config = error.config as AxiosRequestConfig & { _retry?: number };

                // Retry logic para errores de red
                if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
                    config._retry = (config._retry || 0) + 1;

                    if (config._retry <= this.maxRetries) {
                        await this.sleep(this.retryDelay * config._retry);
                        return this.axiosInstance(config);
                    }
                }

                // Manejo de errores 401 - redirigir a login
                if (error.response?.status === 401) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('current_user');
                        window.location.href = '/login';
                    }
                }

                // Manejo de errores 429 - rate limit
                if (error.response?.status === 429) {
                    const retryAfter = error.response.headers['retry-after'] || 5;
                    await this.sleep(parseInt(retryAfter) * 1000);
                    return this.axiosInstance(config);
                }

                return Promise.reject(error);
            }
        );
    }

    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;

        try {
            const user = localStorage.getItem('current_user');
            if (user) {
                const parsed = JSON.parse(user);
                return parsed.token || null;
            }
        } catch {
            return null;
        }

        return null;
    }

    private getCSRFToken(): string | null {
        if (typeof window === 'undefined') return null;

        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrf_token') {
                return decodeURIComponent(value);
            }
        }

        return null;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Métodos públicos
    async get<T = any>(url: string, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return response.data;
    }
}

// Exportar instancia única
export const httpClient = new SecureHttpClient();

// API helpers seguros
export const api = {
    // Auth
    auth: {
        login: (email: string, password: string) =>
            httpClient.post('/auth/login', { email, password }),
        register: (data: any) =>
            httpClient.post('/auth/register', data),
        logout: () =>
            httpClient.post('/auth/logout'),
        getProfile: () =>
            httpClient.get('/auth/profile')
    },

    // Pets
    pets: {
        list: (filters?: any) =>
            httpClient.get('/pets', { params: filters }),
        get: (id: string) =>
            httpClient.get(`/pets/${id}`),
        create: (data: any) =>
            httpClient.post('/pets', data),
        update: (id: string, data: any) =>
            httpClient.put(`/pets/${id}`, data),
        delete: (id: string) =>
            httpClient.delete(`/pets/${id}`)
    },

    // Matches
    matches: {
        getPotential: (petId: string) =>
            httpClient.get(`/matches/potential/${petId}`),
        like: (matchId: string) =>
            httpClient.post(`/matches/${matchId}/like`),
        pass: (matchId: string) =>
            httpClient.post(`/matches/${matchId}/pass`)
    },

    // Payments
    payments: {
        create: (data: any) =>
            httpClient.post('/payments', data),
        getHistory: () =>
            httpClient.get('/payments/history')
    },

    // Admin
    admin: {
        getMetrics: (timeframe?: string) =>
            httpClient.get('/admin/metrics', { params: { timeframe } }),
        getAdvertisers: () =>
            httpClient.get('/admin/advertisers'),
        getShelters: () =>
            httpClient.get('/admin/shelters')
    },

    // Advertiser
    advertiser: {
        getDashboard: () =>
            httpClient.get('/advertiser/dashboard'),
        getCampaigns: () =>
            httpClient.get('/advertiser/campaigns'),
        createCampaign: (data: any) =>
            httpClient.post('/advertiser/campaigns', data)
    },

    // Shelter
    shelter: {
        getDashboard: () =>
            httpClient.get('/shelter/dashboard'),
        getProjects: () =>
            httpClient.get('/shelter/projects'),
        createProject: (data: any) =>
            httpClient.post('/shelter/projects', data)
    }
};
