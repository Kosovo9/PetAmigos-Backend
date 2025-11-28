import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en-US', 'es-MX', 'ja-JP', 'en-CA', 'es-CL', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ko-KR', 'zh-CN', 'ru-RU', 'ar-SA', 'es-ES', 'es-CO', 'es-AR', 'fr-CA', 'pt-PT', 'en-AU', 'en-GB'] as const;
const defaultLocale = 'en-US';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale as any)) {
        locale = defaultLocale;
    }

    return {
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
