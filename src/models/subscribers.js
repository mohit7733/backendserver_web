const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    subscriber_id: {
        type: Number,
        required: true,
        unique: true
    },
    subscriber_email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Number,
        default: 0
    },
    unsubscribe: {
        type: Number,
        default: 0
    },
    unsubscribe_date: {
        type: Date,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
