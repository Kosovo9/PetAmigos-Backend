import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale
});

const isProtectedRoute = createRouteMatcher([
    '/admin(.*)',
    '/my-pet(.*)',
    '/chat(.*)'
]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect();

    return intlMiddleware(req);
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
};
