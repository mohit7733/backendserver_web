const express = require('express');
const router = express.Router();
const Color = require('../models/colors');
const auth = require('../middleware/auth');
// Get all colors
router.get('/colors', async (req, res) => {
    try {
        const colors = await Color.find();
        res.status(200).json(colors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching colors', error: error.message });
    }
});

// Create new color
router.post('/colors', auth, async (req, res) => {
    try {
        const color = new Color(req.body);
        await color.save();
        res.status(201).json(color);
    } catch (error) {
        res.status(400).json({ message: 'Error creating color', error: error.message });
    }
});

// Update color by ID
router.post('/colors/:id', auth, async (req, res) => {
    try {
        const color = await Color.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!color) {
            return res.status(404).json({ message: 'Color not found' });
        }
        res.status(200).json(color);
    } catch (error) {
        res.status(400).json({ message: 'Error updating color', error: error.message });
    }
});

// Delete color by ID
router.delete('/colors/:id', auth, async (req, res) => {
    try {
        const color = await Color.findByIdAndDelete(req.params.id);
        if (!color) {
            return res.status(404).json({ message: 'Color not found' });
        }
        res.status(200).json({ message: 'Color deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting color', error: error.message });
    }
});

module.exports = router;