const express = require('express');
const router = express.Router();
const { LikeView, ViewView } = require('../models/like_view');
const Website = require('../models/website');
const { GotdWinner, GotmWinner, GotyWinner } = require('../models/aword_winner');
// Get all like views

router.get('/like/:website_id', async (req, res) => {
    try {
        const likeViews = await LikeView.find({ website_id: req.params.website_id });
        if (likeViews.length > 0) {
            const likeCount = likeViews.filter((item) => item.like_count > 0).length;
            res.status(200).json({ likeCount });
        } else {
            res.status(200).json({ likeCount: 0 });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching like views', error: err });
    }
});

router.get('/likeuser/:ip_address', async (req, res) => {
    try {
        const likeViews = await LikeView.find({ ip_address: req.params.ip_address });
        if (likeViews.length > 0) {
            res.status(200).json({ likeViews: likeViews });
        } else {
            res.status(200).json({ likeViews: [] });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching like views', error: err });
    }
});

// Create a new like view
router.post('/like-view', async (req, res) => {
    const { website_id, ip_address, like_count, view_count } = req.body;
    console.log(req.body);
    try {
        const existingLikeView = await LikeView.findOne({ website_id, ip_address });
        const existingViewView = await ViewView.findOne({ website_id, ip_address });
        if (existingLikeView && like_count) {
            like_count && (existingLikeView.like_count = existingLikeView.like_count + like_count);
            await existingLikeView.save();
        } else if (like_count) {
            const likeView = new LikeView({ website_id, ip_address, like_count });
            await likeView.save();
        }
        if (existingViewView && view_count) {
            view_count && (existingViewView.view_count = existingViewView.view_count + view_count);
            await existingViewView.save();
        } else if (view_count) {
            const viewView = new ViewView({ website_id, ip_address, view_count });
            await viewView.save();
        }

        res.status(201).json({ message: 'Like view created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating like view', error: err });
    }
});

// get Leaderboard recored
router.get('/leaderboard', async (req, res) => {
    try {
        // Get all LikeViews and all Websites
        const [likeViews, websites, gotdWinners, gotmWinners, gotyWinners] = await Promise.all([
            LikeView.find(),
            Website.find(),
            GotdWinner.find(),
            GotmWinner.find(),
            GotyWinner.find(),
        ]);
        console.log(websites);

        // Count likes per website_id (only count if like_count > 0)
        const likeCountMap = {};
        likeViews.forEach(lv => {
            if (lv.like_count >= 0) {
                if (!likeCountMap[lv.website_id]) {
                    likeCountMap[lv.website_id] = 0;
                }
                likeCountMap[lv.website_id] += 1;
            }
        });
        // Build leaderboard array, only for websites with status == 1 (approved)
        let leaderboardArray = Object.entries(likeCountMap)
            .map(([website_id, like_count]) => {
                const website = websites.find(w => w.website_id == website_id);
                if (website && website.status === 1) {
                    return {
                        website_id,
                        like_count,
                        website_name: website.title || null,
                        slug: website.slug || null,
                        weblike_count: website.like_count || 0,
                    };
                }
                return null;
            })
            .filter(Boolean)
            .sort((a, b) => b.like_count - a.like_count)
        const gotd = gotdWinners.map(winner => winner.website_id);
        const gotm = gotmWinners.map(winner => winner.website_id);
        const goty = gotyWinners.map(winner => winner.website_id);
        // Separate leaderboard into three arrays: gotd, gotm, and the rest (not in gotd or gotm)
        // Use Set for faster and more reliable lookups instead of includes
        const gotdSet = new Set(gotd.map(String));
        const gotmSet = new Set(gotm.map(String));
        const gotySet = new Set(goty.map(String));
        let gotdArray = leaderboardArray.filter(item => gotdSet.has(String(item.website_id)) && !gotmSet.has(String(item.website_id)) && !gotySet.has(String(item.website_id))).slice(0, 5);
        let gotmArray = leaderboardArray.filter(item => gotmSet.has(String(item.website_id)) && !gotySet.has(String(item.website_id))).slice(0, 5);
        let restArray = leaderboardArray.filter(item => !gotdSet.has(String(item.website_id)) && !gotmSet.has(String(item.website_id)) && !gotySet.has(String(item.website_id))).slice(0, 5);
        leaderboardArray = restArray;

        res.status(200).json({ leaderboard: leaderboardArray, goty: gotmArray, gotm: gotdArray });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: err.message || err });
    }
});

module.exports = router;
