const mongoose = require('mongoose');

const adspaceSchema = new mongoose.Schema({
    adspace_id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image_width: {
        type: String,
        required: true
    },
    image_height: {
        type: String,
        required: true
    },
    available_space: {
        type: String,
    },
    validity_days: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Adspace', adspaceSchema);

