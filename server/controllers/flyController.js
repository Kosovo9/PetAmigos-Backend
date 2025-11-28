const AirlinePolicy = require('../models/AirlinePolicy');

// @desc    Get all airline policies
// @route   GET /api/fly
// @access  Public
exports.getAllPolicies = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, country } = req.query;

        let query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (country) {
            query.country = country;
        }

        const policies = await AirlinePolicy.find(query)
            .sort('airline')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await AirlinePolicy.countDocuments(query);

        res.status(200).json({
            success: true,
            data: policies,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Error fetching policies:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single policy
// @route   GET /api/fly/:id
// @access  Public
exports.getPolicyById = async (req, res) => {
    try {
        const policy = await AirlinePolicy.findById(req.params.id);

        if (!policy) {
            return res.status(404).json({
                success: false,
                error: 'Policy not found'
            });
        }

        res.status(200).json({
            success: true,
            data: policy
        });
    } catch (error) {
        console.error('Error fetching policy:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new policy (Admin)
// @route   POST /api/fly
// @access  Private/Admin
exports.createPolicy = async (req, res) => {
    try {
        const policy = await AirlinePolicy.create(req.body);

        res.status(201).json({
            success: true,
            data: policy
        });
    } catch (error) {
        console.error('Error creating policy:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Airline already exists'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update policy (Admin)
// @route   PUT /api/fly/:id
// @access  Private/Admin
exports.updatePolicy = async (req, res) => {
    try {
        const policy = await AirlinePolicy.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!policy) {
            return res.status(404).json({
                success: false,
                error: 'Policy not found'
            });
        }

        res.status(200).json({
            success: true,
            data: policy
        });
    } catch (error) {
        console.error('Error updating policy:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Delete policy (Admin)
// @route   DELETE /api/fly/:id
// @access  Private/Admin
exports.deletePolicy = async (req, res) => {
    try {
        const policy = await AirlinePolicy.findByIdAndDelete(req.params.id);

        if (!policy) {
            return res.status(404).json({
                success: false,
                error: 'Policy not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting policy:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
