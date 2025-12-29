
// Mock hooks for Valuation
export const useValuation = () => ({
    valuation: {
        adjusted_valuation: 15450000,
        user_metrics: { total_users: 125000 },
        monthly_progression: [1, 2, 3, 5, 8, 12, 18, 25, 35, 50, 75, 100].map(v => v * 100000),
        methodology: {
            revenue: 4500000, users: 5500000, engagement: 2000000, dcf: 3000000, report: "Full report...\n- Item 1\n- Item 2"
        }
    },
    loading: false
});
