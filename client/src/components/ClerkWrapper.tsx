import React from 'react';
import { ClerkProvider as CP, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
    console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY. Clerk auth will be disabled.");
}

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
    if (!publishableKey) return <>{children}</>;

    return (
        <CP
            publishableKey={publishableKey}
            appearance={{ baseTheme: dark }}
        >
            {children}
        </CP>
    );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!publishableKey) return <>{children}</>;

    return (
        <>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};
