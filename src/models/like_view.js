const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    website_id: {
        type: Number,
        required: true,
    },
    like_count: {
        type: Number,
        default: 0,
    },
    // view_count: {
    //     type: Number,
    //     default: 0,
    // },
    ip_address: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const viewSchema = new mongoose.Schema({
    website_id: {
        type: Number,
        required: true,
    },
    view_count: {
        type: Number,
        default: 0,
    },
    ip_address: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const LikeView = mongoose.model('LikeView', likeSchema);
const ViewView = mongoose.model('ViewView', viewSchema);

module.exports = { LikeView, ViewView };
