const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts');

router.post('/contacts', async (req, res) => {
    try {
        const { contact_name, contact_email, contact_url, message, contact_type } = req.body;
        const id = await Contact.find().sort({ contact_id: -1 }).limit(1);
        const contact = new Contact({ contact_id: (id[0].contact_id || 0) + 1, contact_name, contact_email, contact_url, message, contact_type });
        await contact.save();
        res.status(201).json({ message: 'Contact created successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

router.get('/contacts/:type', async (req, res) => {
    try {
        const contacts = await Contact.find({ contact_type: req.params.type });
        res.status(200).json({ contacts, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});



module.exports = router;
