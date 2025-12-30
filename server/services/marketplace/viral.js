const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// const { Web3 } = require('web3'); // Uncomment when Web3 provider is available

class MarketplaceViral {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
        // this.setupDatabase(); // Mongoose connection is ideally handled in server.js
    }

    setupRoutes() {
        // Affiliate management
        this.router.post('/affiliates/register', this.registerAffiliate.bind(this));
        this.router.get('/affiliates/:code', this.getAffiliateInfo.bind(this));
        this.router.post('/affiliates/:code/refer', this.trackReferral.bind(this));
        this.router.get('/affiliates/:code/dashboard', this.getDashboard.bind(this));

        // Commission management
        this.router.get('/commissions/pending', this.getPendingCommissions.bind(this));
        this.router.post('/commissions/withdraw', this.withdrawCommissions.bind(this));

        // Gamification
        this.router.get('/leaderboard', this.getLeaderboard.bind(this));
    }

    async registerAffiliate(req, res) {
        try {
            const { userId, email } = req.body;
            const code = `PET${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

            // Mock saving to DB
            console.log('Registering affiliate:', userId, code);

            res.json({
                success: true,
                code,
                welcomeTokens: 100
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAffiliateInfo(req, res) {
        const { code } = req.params;
        res.json({ code, level: 1, userId: 'mock-user-id' });
    }

    async trackReferral(req, res) {
        const { code } = req.params;
        const { userId, action, amount } = req.body;
        res.json({ success: true, referralId: uuidv4(), commission: amount * 0.2 });
    }

    async getDashboard(req, res) {
        res.json({
            affiliate: {
                code: req.params.code,
                level: 1,
                totalEarnings: 1500,
                pendingEarnings: 200,
                performance: { conversions: 50, revenue: 5000 }
            },
            stats: {},
            leaderboardPosition: 5
        });
    }

    async getPendingCommissions(req, res) {
        res.json({ pending: 200, available: 150 });
    }

    async withdrawCommissions(req, res) {
        res.json({ success: true, withdrawalId: uuidv4() });
    }

    async getLeaderboard(req, res) {
        res.json({
            leaderboard: [
                { rank: 1, name: 'TopUser', earnings: 5000 },
                { rank: 2, name: 'SecondUser', earnings: 3000 }
            ]
        });
    }
}

module.exports = new MarketplaceViral().router;
