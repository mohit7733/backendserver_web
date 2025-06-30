const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    country_id: {
        type: Number,
        required: true,
        unique: true
    },
    country_name: {
        type: String,
        required: true,
        unique: true
    },
    country_code: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

const Country = mongoose.model('countries', countrySchema);

module.exports = Country;
