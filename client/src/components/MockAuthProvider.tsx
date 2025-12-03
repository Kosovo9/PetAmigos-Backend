'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MockUser {
    firstName: string;
    lastName: string;
    imageUrl: string;
}

interface MockAuthContextType {
    isSignedIn: boolean;
    user: MockUser | null;
    signIn: () => void;
    signOut: () => void;
}

const MockAuthContext = createContext<MockAuthContextType>({
    isSignedIn: false,
    user: null,
    signIn: () => { },
    signOut: () => { }
});

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<MockUser | null>(null);

    useEffect(() => {
        // Check local storage for persistence
        const stored = localStorage.getItem('mock_auth_status');
        if (stored === 'signed_in') {
            setIsSignedIn(true);
            setUser({
                firstName: 'Pet',
                lastName: 'Lover',
                imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
            });
        }
    }, []);

    const signIn = () => {
        setIsSignedIn(true);
        setUser({
            firstName: 'Pet',
            lastName: 'Lover',
            imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        });
        localStorage.setItem('mock_auth_status', 'signed_in');
    };

    const signOut = () => {
        setIsSignedIn(false);
        setUser(null);
        localStorage.removeItem('mock_auth_status');
    };

    return (
        <MockAuthContext.Provider value={{ isSignedIn, user, signIn, signOut }}>
            {children}
        </MockAuthContext.Provider>
    );
};

export const useMockAuth = () => useContext(MockAuthContext);
