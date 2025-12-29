'use client';

import { useState, useEffect } from 'react';
import { User, getCurrentUser, setCurrentUser, login as authLogin, logout as authLogout } from '@/lib/auth';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = (email: string, password: string) => {
        const loggedUser = authLogin(email, password);
        if (loggedUser) {
            setUser(loggedUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        authLogout();
        setUser(null);
    };

    const hasRole = (role: string) => {
        return user?.role === role || user?.role === 'admin';
    };

    return {
        user,
        loading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!user
    };
}
