
// server/models/SecurityLog.js
import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        enum: ['blocked_content', 'rate_limited', 'amber_alert', 'user_reported', 'login_failed'],
        required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: { type: Object },
    ip: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SecurityLog', securityLogSchema);
