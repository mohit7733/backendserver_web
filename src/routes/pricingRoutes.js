const express = require('express');
const router = express.Router();
const Plans = require('../models/plans');

router.get('/subscription-plans', async (req, res) => {
    try {
        const plans = await Plans.find({});
        res.status(200).json({ plans, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscription plans', error: error.message });
    }
});

router.get('/subscription-plans/:id', async (req, res) => {
    try {
        const plan = await Plans.findById(req.params.id);
        res.status(200).json({ plan, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscription plan', error: error.message });
    }
});

module.exports = router;