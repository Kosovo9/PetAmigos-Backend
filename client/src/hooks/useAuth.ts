import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState<{ credits: number; email: string; role: string } | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Load from localStorage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken) setToken(storedToken);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        }
    }, []);

    const refreshUser = (userData: any) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return { user, token, refreshUser };
}
