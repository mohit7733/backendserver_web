const express = require('express');
const router = express.Router();
const { GotdWinner, GotmWinner, GotyWinner } = require('../models/aword_winner');
const Website = require('../models/website');
const Category = require('../models/categories');
const Color = require('../models/colors');
const Tag = require('../models/tags');
const Country = require('../models/countries');

router.get('/gotd_winner', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const winner = await GotdWinner.findOne({ award_date: today });
        const gotmWinner = await GotmWinner.findOne({ award_month: today });
        const gotyWinner = await GotyWinner.findOne({ award_year: today });
        if (!winner) {
            return res.status(200).json({
                success: false,
                message: 'No winner found for today'
            });
        }
        const website = await Website.findOne({
            website_id: winner.website_id,
            status: 1
        });
        const websitemonth = await Website.findOne({
            website_id: gotmWinner?.website_id,
            status: 1
        });
        const websiyear = await Website.findOne({
            website_id: gotyWinner?.website_id,
            status: 1
        });
        if (!website) {
            return res.status(200).json({
                success: false,
                message: 'No website found for winner'
            });
        }
        
        return res.status(200).json({
            success: true,
            website: website || null,
            websitemonth: websitemonth || null,
            websiyear: websiyear || null
        });

    } catch (error) {
        console.error('Error fetching GOTD winner:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.get('/got_winner/:count/:page/:winnertype', async (req, res) => {
    try {
        const { count, page, winnertype } = req.params;
        const limit = parseInt(count, 10);
        const currentPage = parseInt(page, 10);
        const startIndex = (currentPage - 1) * limit;
        const endIndex = currentPage * limit;

        // Validate winnertype
        const validTypes = ['gotd', 'gotm', 'goty'];
        if (!validTypes.includes(winnertype)) {
            return res.status(404).json({
                success: false,
                message: 'Not Found'
            });
        }

        // Get all required data in parallel
        const [websites, gotdWinners, gotmWinners, gotyWinners] = await Promise.all([
            Website.find().sort({ submit_date: -1 }),
            GotdWinner.find(),
            GotmWinner.find(),
            GotyWinner.find()
        ]);

        // Map for quick lookup
        const winnerMaps = {
            gotd: new Map(gotdWinners.map(w => [w.website_id, w])),
            gotm: new Map(gotmWinners.map(w => [w.website_id, w])),
            goty: new Map(gotyWinners.map(w => [w.website_id, w]))
        };

        // Filter and map winners based on type
        const filteredWebsites = websites.filter(
            website => website.status === 1 && website.duplicate_website === 0
        ).filter(website => winnerMaps[winnertype].has(website.website_id));

        // Sort by award_date descending
        const sortedWebsites = filteredWebsites
            .map(website => ({
                ...website.toObject(),
                winner: winnerMaps[winnertype].get(website.website_id)
            }))
            .sort((a, b) => {
                const aDate = a.winner && a.winner.award_date ? new Date(a.winner.award_date) : new Date(0);
                const bDate = b.winner && b.winner.award_date ? new Date(b.winner.award_date) : new Date(0);
                return bDate - aDate;
            });

        // Paginate
        const paginated = sortedWebsites.slice(startIndex, endIndex);

        if (paginated.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Not Found'
            });
        }

        res.status(200).json({
            winnerlist: paginated,
            pages: Math.ceil(sortedWebsites.length / limit),
            ok: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching websites',
            error: error.message
        });
    }
});
router.get('/filter_winners', async (req, res) => {
    try {
        // Get all winners and websites in parallel
        const [gotdWinners, gotmWinners, gotyWinners, websites] = await Promise.all([
            GotdWinner.find(),
            GotmWinner.find(),
            GotyWinner.find(),
            Website.find().sort({ submit_date: -1 })
        ]);

        // Filter approved websites
        const approvedWebsites = websites.filter(website =>
            website.status === 1 && website.duplicate_website === 0
        );

        // Helper function to process winners
        const processWinners = (websites, winners) => {
            return websites
                .filter(website => winners.some(w => w.website_id === website.website_id))
                .map(website => ({
                    ...website.toObject(),
                    winner: winners.find(w => w.website_id === website.website_id)
                }))
                .sort((a, b) => new Date(b.winner.award_date) - new Date(a.winner.award_date));
        };

        // Process each winner type
        const winnerlistgotd = processWinners(approvedWebsites, gotdWinners);
        const winnerlistgotm = processWinners(approvedWebsites, gotmWinners);
        const winnerlistgoty = processWinners(approvedWebsites, gotyWinners);
        const categories = await Category.find();
        const categorycount = categories.map(category => ({
            category: category.category_name,
            count: websites.filter(website => website.categories.includes(category.category_name)).length
        }));
        const colors = await Color.find();
        const colorcount = colors.map(color => ({
            color: color.color_name,
            count: websites.filter(website => website.colors.includes(color.color_name)).length
        }));
        const tags = await Tag.find();
        const tagcount = tags.map(tag => ({
            tag: tag.tag_name,
            count: websites.filter(website => website.tags.includes(tag.tag_name)).length
        }));

        res.status(200).json({
            winnerlistgotd,
            winnerlistgotm,
            winnerlistgoty,
            categorycount,
            colorcount,
            tagcount
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching websites',
            error: error.message
        });
    }
});

router.get('/filterbytag/:count/:page/:tag/:type', async (req, res) => {
    try {
        const { count, page, tag, type } = req.params;
        const limit = parseInt(count);
        const currentPage = parseInt(page);
        const startIndex = (currentPage - 1) * limit;

        // Build query based on type
        let query = {};
        if (type === 'tag') {
            query = { tags: { $regex: new RegExp(tag, 'i') } };
        } else if (type === 'colors') {
            query = { colors: { $regex: new RegExp(tag, 'i') } };
        } else if (type === 'category') {
            query = { categories: { $regex: new RegExp(tag, 'i') } };
        } else if (type === 'country') {
            const country = await Country.findOne({ slug: tag });
            query = { country_id: country.country_id };
        }

        // Get total count for pagination
        const totalCount = await Website.countDocuments(query);

        // Fetch filtered websites with pagination
        let filteredWebsites = await Website.find(query)
            .sort({ submit_date: -1 })
            .limit(limit)
            .skip(startIndex);

        // if (type === 'search') {
        //     filteredWebsites = filteredWebsites.filter(website => {
        //         const tagLower = tag ? tag.toLowerCase() : '';
        //         return (
        //             (website.website_name && website.website_name.toLowerCase().includes(tagLower)) ||
        //             (website.description && website.description.toLowerCase().includes(tagLower))
        //         )
        //     });
        // }


        if (filteredWebsites.length === 0) {
            return res.status(200).json({
                success: false,
                message: `No websites found for this ${type}`
            });
        }

        res.status(200).json({
            filteredWebsites,
            pages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching websites',
            error: error.message
        });
    }
});





module.exports = router;
