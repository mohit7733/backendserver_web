const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    contact_id: {
        type: Number,
        required: true
    },
    contact_name: { 
        type: String,
        required: true
    },
    contact_email: {
        type: String,
        required: true
    },
    contact_url: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    contact_type: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

