const PhotoGeneration = require('../models/PhotoGeneration');
const User = require('../models/User');

// 🎯 GENERATION COMMAND CENTER - Real-Time Dashboard
// Monitors: Speed, Tools Used, Quality, Total Count, Size

/**
 * @desc    Get real-time generation statistics
 * @route   GET /api/admin/generation/dashboard
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const { timeRange = '24h' } = req.query;

        // Calculate time filter
        let startDate = new Date();
        switch (timeRange) {
            case '1h':
                startDate.setHours(startDate.getHours() - 1);
                break;
            case '24h':
                startDate.setHours(startDate.getHours() - 24);
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case 'all':
                startDate = new Date(0); // Unix epoch
                break;
        }

        // Get all generations in time range
        const generations = await PhotoGeneration.find({
            createdAt: { $gte: startDate },
            status: 'completed'
        }).sort({ createdAt: -1 });

        // Calculate metrics
        const stats = {
            // TOTAL COUNT
            totalGenerations: generations.length,

            // SPEED METRICS
            averageGenerationTime: calculateAverageTime(generations),
            fastestGeneration: calculateFastestTime(generations),
            slowestGeneration: calculateSlowestTime(generations),

            // TOOLS USAGE
            toolsUsage: calculateToolsUsage(generations),

            // IMAGE SIZE
            averageImageSize: calculateAverageSize(generations),
            totalStorageUsed: calculateTotalStorage(generations),

            // QUALITY METRICS
            qualityDistribution: calculateQualityDistribution(generations),
            averageQualityScore: calculateAverageQuality(generations),

            // ENGINES PERFORMANCE
            enginePerformance: calculateEnginePerformance(generations),

            // RECENT ACTIVITY
            recentGenerations: generations.slice(0, 10).map(g => ({
                id: g._id,
                userId: g.userId,
                engine: g.engine,
                quality: g.quality,
                size: formatBytes(g.imageSize),
                generationTime: `${g.generationTime}ms`,
                timestamp: g.createdAt,
                status: g.status,
                hasWatermark: g.hasWatermark
            })),

            // HOURLY BREAKDOWN (Last 24 hours)
            hourlyBreakdown: calculateHourlyBreakdown(generations),

            // SUCCESS RATE
            successRate: calculateSuccessRate(startDate)
        };

        res.json({
            success: true,
            timeRange,
            stats,
            lastUpdate: new Date()
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
};

/**
 * @desc    Get live generation queue
 * @route   GET /api/admin/generation/queue
 * @access  Private/Admin
 */
exports.getGenerationQueue = async (req, res) => {
    try {
        const pending = await PhotoGeneration.find({ status: 'pending' })
            .sort({ createdAt: 1 })
            .limit(50);

        const processing = await PhotoGeneration.find({ status: 'processing' })
            .sort({ createdAt: 1 });

        const failed = await PhotoGeneration.find({ status: 'failed' })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            queue: {
                pending: pending.map(formatQueueItem),
                processing: processing.map(formatQueueItem),
                failed: failed.map(formatQueueItem)
            },
            counts: {
                pending: pending.length,
                processing: processing.length,
                failed: failed.length
            }
        });
    } catch (error) {
        console.error('Error in getGenerationQueue:', error);
        res.status(500).json({ error: 'Error fetching generation queue' });
    }
};

/**
 * @desc    Get engine health status
 * @route   GET /api/admin/generation/health
 * @access  Private/Admin
 */
exports.getEngineHealth = async (req, res) => {
    try {
        const last100 = await PhotoGeneration.find()
            .sort({ createdAt: -1 })
            .limit(100);

        const engines = {
            'google-ai': { total: 0, success: 0, failed: 0, avgTime: 0 },
            'higgsfield': { total: 0, success: 0, failed: 0, avgTime: 0 },
            'huggingface': { total: 0, success: 0, failed: 0, avgTime: 0 }
        };

        last100.forEach(gen => {
            if (engines[gen.engine]) {
                engines[gen.engine].total++;
                if (gen.status === 'completed') {
                    engines[gen.engine].success++;
                } else if (gen.status === 'failed') {
                    engines[gen.engine].failed++;
                }
            }
        });

        // Calculate success rates
        Object.keys(engines).forEach(engine => {
            const data = engines[engine];
            data.successRate = data.total > 0 ? ((data.success / data.total) * 100).toFixed(2) : 0;
            data.status = data.successRate > 90 ? 'healthy' : data.successRate > 70 ? 'degraded' : 'critical';
        });

        res.json({
            success: true,
            engines,
            overallHealth: calculateOverallHealth(engines)
        });
    } catch (error) {
        console.error('Error in getEngineHealth:', error);
        res.status(500).json({ error: 'Error fetching engine health' });
    }
};

// ===== HELPER FUNCTIONS =====

function calculateAverageTime(generations) {
    if (generations.length === 0) return 0;
    const total = generations.reduce((sum, g) => sum + (g.generationTime || 0), 0);
    return Math.round(total / generations.length);
}

function calculateFastestTime(generations) {
    if (generations.length === 0) return 0;
    return Math.min(...generations.map(g => g.generationTime || Infinity));
}

function calculateSlowestTime(generations) {
    if (generations.length === 0) return 0;
    return Math.max(...generations.map(g => g.generationTime || 0));
}

function calculateToolsUsage(generations) {
    const usage = {};
    generations.forEach(g => {
        const engine = g.engine || 'unknown';
        usage[engine] = (usage[engine] || 0) + 1;
    });

    // Convert to percentage
    const total = generations.length;
    Object.keys(usage).forEach(key => {
        usage[key] = {
            count: usage[key],
            percentage: ((usage[key] / total) * 100).toFixed(2)
        };
    });

    return usage;
}

function calculateAverageSize(generations) {
    if (generations.length === 0) return 0;
    const total = generations.reduce((sum, g) => sum + (g.imageSize || 0), 0);
    return formatBytes(total / generations.length);
}

function calculateTotalStorage(generations) {
    const total = generations.reduce((sum, g) => sum + (g.imageSize || 0), 0);
    return formatBytes(total);
}

function calculateQualityDistribution(generations) {
    const distribution = {
        '4K': 0,
        '8K': 0,
        'HD': 0,
        'Standard': 0
    };

    generations.forEach(g => {
        const quality = g.quality || 'Standard';
        if (distribution[quality] !== undefined) {
            distribution[quality]++;
        }
    });

    return distribution;
}

function calculateAverageQuality(generations) {
    // Quality score: 8K=4, 4K=3, HD=2, Standard=1
    const scores = { '8K': 4, '4K': 3, 'HD': 2, 'Standard': 1 };
    if (generations.length === 0) return 0;

    const total = generations.reduce((sum, g) => {
        return sum + (scores[g.quality] || 1);
    }, 0);

    return (total / generations.length).toFixed(2);
}

function calculateEnginePerformance(generations) {
    const performance = {};

    generations.forEach(g => {
        const engine = g.engine || 'unknown';
        if (!performance[engine]) {
            performance[engine] = {
                count: 0,
                totalTime: 0,
                totalSize: 0,
                avgTime: 0,
                avgSize: 0
            };
        }

        performance[engine].count++;
        performance[engine].totalTime += g.generationTime || 0;
        performance[engine].totalSize += g.imageSize || 0;
    });

    // Calculate averages
    Object.keys(performance).forEach(engine => {
        const data = performance[engine];
        data.avgTime = Math.round(data.totalTime / data.count);
        data.avgSize = formatBytes(data.totalSize / data.count);
    });

    return performance;
}

function calculateHourlyBreakdown(generations) {
    const hours = Array(24).fill(0);

    generations.forEach(g => {
        const hour = new Date(g.createdAt).getHours();
        hours[hour]++;
    });

    return hours.map((count, hour) => ({
        hour: `${hour}:00`,
        count
    }));
}

async function calculateSuccessRate(startDate) {
    try {
        const total = await PhotoGeneration.countDocuments({
            createdAt: { $gte: startDate }
        });

        const successful = await PhotoGeneration.countDocuments({
            createdAt: { $gte: startDate },
            status: 'completed'
        });

        return total > 0 ? ((successful / total) * 100).toFixed(2) : 0;
    } catch (error) {
        return 0;
    }
}

function formatQueueItem(gen) {
    return {
        id: gen._id,
        userId: gen.userId,
        engine: gen.engine,
        status: gen.status,
        createdAt: gen.createdAt,
        error: gen.errorMessage
    };
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function calculateOverallHealth(engines) {
    const rates = Object.values(engines).map(e => parseFloat(e.successRate));
    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;

    return {
        avgSuccessRate: avgRate.toFixed(2),
        status: avgRate > 90 ? 'healthy' : avgRate > 70 ? 'degraded' : 'critical'
    };
}
