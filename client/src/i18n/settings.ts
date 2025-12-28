export const locales = [
    'en', 'es', 'fr', 'de', 'pt', 'ja', 'it', 'zh', 'ru', 'ko', 'ar',
    'en-US', 'en-GB', 'en-CA', 'en-AU',
    'es-MX', 'es-ES', 'es-AR', 'es-CO', 'es-CL',
    'pt-BR', 'pt-PT',
    'fr-FR', 'fr-CA',
    'de-DE', 'it-IT', 'ja-JP', 'ko-KR', 'ru-RU', 'zh-CN', 'ar-SA'
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export async function getRequestConfig(locale: Locale) {
    return {
        messages: (await import(`../../messages/${locale}.json`)).default
    };
}
