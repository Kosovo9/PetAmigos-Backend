
// Mock hooks for Security
export const useSecurityMetrics = () => ({
    metrics: {
        blockedAttempts: 45,
        suspiciousLogins: 12,
        revokedTokens: 5,
        mitigatedAttacks: 120,
        geographicThreats: []
    },
    events: [],
    loading: false
});
