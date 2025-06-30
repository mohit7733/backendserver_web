const express = require('express');
const router = express.Router();
const Tag = require('../models/tags');
const auth = require('../middleware/auth');
// Get all tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tags', error: error.message });
    }
});

// Create new tag
router.post('/tags', auth, async (req, res) => {
    try {
        const tag = new Tag(req.body);
        await tag.save();
        res.status(201).json(tag);
    } catch (error) {
        res.status(400).json({ message: 'Error creating tag', error: error.message });
    }
});

// Update tag by ID
router.post('/tags/:id', auth, async (req, res) => {
    try {
        const tag = await Tag.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json(tag);
    } catch (error) {
        res.status(400).json({ message: 'Error updating tag', error: error.message });
    }
});

// Delete tag by ID
router.delete('/tags/:id', auth, async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tag', error: error.message });
    }
});

module.exports = router;