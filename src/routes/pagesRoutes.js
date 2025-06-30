const express = require('express');
const Page = require('../models/pages');
const router = express.Router();

// Fetch all pages
router.get('/pages', async (req, res) => {
    try {
        const pages = await Page.find();  // Fetch all pages from MongoDB
        res.status(200).json(pages);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pages', error: err });
    }
});

// Fetch a specific page by slug
router.get('/pages/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const page = await Page.findOne({ page_slug: slug });  // Find page by slug
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.status(200).json(page);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching page', error: err });
    }
});

// Create a new page
router.post('/pages', async (req, res) => {
    const { page_slug, page_name, page_title, page_content, page_meta_keywords, page_meta_description, page_edit } = req.body;

    try {
        const newPage = new Page({
            page_slug,
            page_name,
            page_title,
            page_content,
            page_meta_keywords,
            page_meta_description,
            page_edit,
        });
        await newPage.save();  // Save the new page to MongoDB
        res.status(201).json(newPage);
    } catch (err) {
        res.status(500).json({ message: 'Error creating page', error: err });
    }
});

// Update a specific page
router.post('/pages/:id', async (req, res) => {
    const { id } = req.params;
    const { page_title, page_content, page_meta_keywords, page_meta_description, page_edit } = req.body;
    console.log(req.body);

    try {
        const updatedPage = await Page.findByIdAndUpdate(id, {
            page_title,
            page_content,
            page_meta_keywords,
            page_meta_description,
            page_edit,
        }, { new: true });  // Return the updated document
        await updatedPage.save();
        if (!updatedPage) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.status(200).json(updatedPage);
    } catch (err) {
        res.status(500).json({ message: 'Error updating page', error: err });
    }
});



module.exports = router;
