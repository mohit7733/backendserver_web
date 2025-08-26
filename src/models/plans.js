const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    monthlyPrice: {
        type: Number,
        required: true,
    },
    annualPrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
        required: true,
    },
    popular: {
        type: Boolean,
        default: false,
    },
    features: [
        {
            name: {
                type: String,
                required: true,
            },
            value: {
                type: String,
                required: true,
            },
            included: {
                type: Boolean,
                required: true,
            },
        }
    ],
    credit: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Plans = mongoose.model('Plans', planSchema);

module.exports = Plans; 
