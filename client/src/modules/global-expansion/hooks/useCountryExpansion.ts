
// Mock hook for Country Expansion
export const useCountryExpansion = () => ({
    countries: [
        { code: 'MX', name: 'México', currency: 'MXN', language: 'es', status: 'active', vat: 0.16, timezone: 'GMT-6', payment_methods: ['Stripe', 'OXXO'], marketSize: 2500000000, growthRate: 0.12, requirements: [] },
        { code: 'US', name: 'USA', currency: 'USD', language: 'en', status: 'active', vat: 0.08, timezone: 'GMT-5', payment_methods: ['Stripe', 'PayPal'], marketSize: 261000000000, growthRate: 0.08, requirements: [] },
        { code: 'BR', name: 'Brasil', currency: 'BRL', language: 'pt', status: 'launching', vat: 0.18, timezone: 'GMT-3', payment_methods: ['Pix'], marketSize: 8500000000, growthRate: 0.15, requirements: [] },
    ],
    selectedCountry: null,
    selectCountry: (code: string) => console.log('Selected', code)
});
