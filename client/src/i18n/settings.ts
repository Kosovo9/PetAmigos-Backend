export const locales = [
    'en', // English (Global)
    'es', // Spanish (LATAM/Spain)
    'fr', // French (Europe/Canada)
    'de', // German (High purchasing power)
    'pt', // Portuguese (Brazil - Huge social market)
    'ja', // Japanese (Premium pet culture)
    'it', // Italian (Fashion & Style)
    'zh', // Chinese (Massive market)
    'ru', // Russian (Strong community)
    'ko'  // Korean (Trendsetters)
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export async function getRequestConfig(locale: Locale) {
    return {
        messages: (await import(`../../messages/${locale}.json`)).default
    };
}
