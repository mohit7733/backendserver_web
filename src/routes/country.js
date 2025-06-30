const express = require('express');
const router = express.Router();
const Country = require('../models/countries');
const Website = require('../models/website');

router.get('/countries', async (req, res) => {
    try {
        const countries = await Country.find();
        const websiteCount = await Website.find();
        const countryCount = countries.map(country => {
            const countryObj = country.toObject ? country.toObject() : country;
            const count = websiteCount.filter(website => {
                return String(website.country_id) === String(countryObj.country_id);
            }).length;
            return {
                ...countryObj,
                count
            };
        });
        res.status(200).json({ countries: countryCount, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

module.exports = router;
