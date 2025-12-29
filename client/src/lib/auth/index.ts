// Sistema de autenticación simple y funcional
export type UserRole = 'user' | 'admin' | 'advertiser' | 'shelter';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    metadata?: {
        company?: string;
        shelter_name?: string;
        verification_status?: string;
    };
}

// Simular auth (en producción usar NextAuth o similar)
const MOCK_USERS: Record<string, User> = {
    'admin@petmatch.com': {
        id: 'admin-1',
        email: 'admin@petmatch.com',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=1'
    },
    'advertiser@example.com': {
        id: 'adv-1',
        email: 'advertiser@example.com',
        name: 'Veterinaria Central',
        role: 'advertiser',
        avatar: 'https://i.pravatar.cc/150?img=2',
        metadata: {
            company: 'Veterinaria Central',
            verification_status: 'verified'
        }
    },
    'shelter@example.com': {
        id: 'shelter-1',
        email: 'shelter@example.com',
        name: 'Refugio Los Amigos',
        role: 'shelter',
        avatar: 'https://i.pravatar.cc/150?img=3',
        metadata: {
            shelter_name: 'Refugio Los Amigos',
            verification_status: 'verified'
        }
    }
};

export function getCurrentUser(): User | null {
    // En desarrollo, simular usuario logueado
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('current_user');
        if (stored) {
            return JSON.parse(stored);
        }
    }
    return null;
}

export function setCurrentUser(user: User | null) {
    if (typeof window !== 'undefined') {
        if (user) {
            localStorage.setItem('current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('current_user');
        }
    }
}

export function login(email: string, password: string): User | null {
    const user = MOCK_USERS[email];
    if (user && password === 'demo123') {
        setCurrentUser(user);
        return user;
    }
    return null;
}

export function logout() {
    setCurrentUser(null);
}

export function requireRole(allowedRoles: UserRole[]): boolean {
    const user = getCurrentUser();
    if (!user) return false;
    return allowedRoles.includes(user.role);
}
