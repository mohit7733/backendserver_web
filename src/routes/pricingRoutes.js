const express = require('express');
const router = express.Router();
const Plans = require('../models/plans');

router.get('/subscription-plans', async (req, res) => {
    try {
        const plans = (await Plans.find({})).reverse();
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


router.post('/subscription-plans', async (req, res) => {
    try {
        const plan = await Plans.create(req.body);
        res.status(200).json({ plan, success: true, message: 'Subscription plan created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating subscription plan', error: error.message });
    }
});

router.post('/subscription-plans/:id', async (req, res) => {
    try {
        const plan = await Plans.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ plan, success: true, message: 'Subscription plan updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating subscription plan', error: error.message });
    }
}); 

router.delete('/subscription-plans/:id', async (req, res) => {
    try {
        await Plans.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Subscription plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription plan', error: error.message });
    }
}); 

module.exports = router;