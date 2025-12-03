import { getRequestConfig } from 'next-intl/server';
import { locales } from '../../i18n';

export { locales };

export default getRequestConfig(async ({ locale }) => ({
    messages: (await import(`../../messages/${locale}.json`)).default
}));
