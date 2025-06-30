const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema({
    ad_id: {
        type: Number,
        default: null
    },
    adspace_id: {
        type: String,
        required: true
    },
    ad_image: {
        type: String,
        required: true
    },
    alt_text: {
        type: String,
        required: true
    },
    title_text: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Ads', adsSchema);
