const mongoose = require('mongoose');

const gotd_winnerSchema = new mongoose.Schema({
    website_id: {
        type: Number,
        required: true
    },
    award_date: {
        type: String,
        default: null
    },    
    mail_sent: {
        type: Number,
        default: 0
    },    
    created_at: {
        type: Date,
        default: Date.now
    }
})


const gotm_winnerSchema = new mongoose.Schema({
    website_id: {
        type: Number,
        required: true
    },
    award_month: {
        type: String,
        default: null
    },
    mail_sent: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const goty_winnerSchema = new mongoose.Schema({
    website_id: {
        type: Number,
        required: true
    },
    award_year: {
        type: String,
        default: null
    },
    mail_sent: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const GotmWinner = mongoose.model('GotmWinner', gotm_winnerSchema);
const GotdWinner = mongoose.model('GotdWinner', gotd_winnerSchema);
const GotyWinner = mongoose.model('GotyWinner', goty_winnerSchema);

module.exports = { GotdWinner, GotmWinner, GotyWinner };
