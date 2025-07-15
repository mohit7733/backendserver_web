const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    newsletter_id: {
        type: String,
        required: true
    },
    newsletter_type: {
        type: String,
        required: true
    },
    gotm_year: {
        type: String,
        default: null
    },
    newsletter_title: {
        type: String,
        required: true
    },
    newsletter_text: {
        type: String,
        required: true
    },
    newsletter_date: {
        type: String,
        required: true
    },
    newsletter_subject: {
        type: String,
        default: ""
    },
    newsletter_sent: {
        type: String,
        default: "0"
    },
    updated_at: {
        type: String,
        default: new Date().toISOString()
    }
})
const Newsletter = mongoose.model('Newsletter', newsletterSchema);
module.exports = Newsletter;