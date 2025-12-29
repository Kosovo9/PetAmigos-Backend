
// Mock hooks for Dashboard
export const useAdminStats = () => ({
    stats: {
        monthlyRevenue: 15420,
        activeUsers: 12500,
        growthRate: 15,
        realtimeActivity: 128,
        revenueData: Array.from({ length: 12 }, (_, i) => ({ month: `Month ${i + 1}`, revenue: Math.random() * 10000, projection: Math.random() * 12000 })),
        userGrowth: [],
        realtimeActivities: []
    },
    loading: false
});
