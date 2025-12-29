
// Mock hooks for Affiliate
export const useAffiliateSystem = () => ({
    affiliateLink: 'https://petmatch.fun/ref/u123',
    referrals: { total: 45, active: 32, recent: [{ id: 1, name: 'John Doe', email: 'j@d.com', status: 'Active', date: '2023-10-01' }] },
    earnings: { total: 1250.50, conversionRate: 15.2 },
    generateLink: () => { },
    copyLink: () => alert('Link Copied!'),
    shareOnSocial: (platform: string) => alert(`Sharing on ${platform}`)
});
