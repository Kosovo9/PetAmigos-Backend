
// Mock hooks for Ads
export const useAdsStats = () => ({
    stats: {
        roas: 4.5,
        totalSpend: 12500,
        impressions: 450000,
        ctr: 2.8,
        analytics: []
    },
    campaigns: []
});

export const useCampaignCreator = () => ({
    createCampaign: async (data: any) => { console.log('Creating campaign', data); },
    loading: false
});
