export const locales = ['en', 'es', 'pt', 'de', 'it', 'zh', 'ja', 'fr', 'ru', 'ko'] as const;
export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number];
