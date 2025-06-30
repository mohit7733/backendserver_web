const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscribers');


router.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscriber_id: -1 });
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/subscribers', async (req, res) => {
    const { email } = req.body;
    try {
        const existingSubscriber = await Subscriber.findOne({ subscriber_email: email });
        const id = await Subscriber.find().sort({ subscriber_id: -1 }).limit(1);
        if (existingSubscriber) {
            return res.status(400).json({ message: 'You are already subscribed', success: false });
        }
        const subscriber = new Subscriber({
            subscriber_email: email,
            status: 0,
            unsubscribe: 0,
            unsubscribe_date: null,
            created_at: new Date(),
            subscriber_id: id[0]?.subscriber_id + 1 || 1
        });
        await subscriber.save();
        res.json({ message: 'Thank you for subscribing', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

router.post('/subscribers/:id', async (req, res) => {
    try {
        const subscriber = await Subscriber.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Subscriber status updated successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

module.exports = router;