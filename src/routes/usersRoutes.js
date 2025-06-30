const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Website = require("../models/website");
const { GotdWinner, GotmWinner, GotyWinner } = require("../models/aword_winner");
const { ViewView } = require("../models/like_view");
const router = express.Router();

router.get("/user/profile", async (req, res) => {
    try {
        const userEmail = req.query.user;
        if (!userEmail) {
            return res.status(400).json({ message: "User email is required", status: 400 });
        }

        // Fetch all relevant data in parallel
        const [websites, gotdWinners, gotmWinners, gotyWinners, viewViews] = await Promise.all([
            Website.find({ user_email: userEmail }).sort({ submit_date: -1 }),
            GotdWinner.find(),
            GotmWinner.find(),
            GotyWinner.find(),
            ViewView.find()
        ]);

        let totalAwards = 0;
        let totalViews = 0;

        if (websites && websites.length > 0) {
            websites.forEach(site => {
                if (site.status == 1) {
                    const siteAwards =
                        gotdWinners.filter(w => w.website_id === site.website_id).length +
                        gotmWinners.filter(w => w.website_id === site.website_id).length +
                        gotyWinners.filter(w => w.website_id === site.website_id).length;
                    const siteViews = viewViews.filter(v => v.website_id === site.website_id).length + site.like_count;
                    totalAwards += siteAwards;
                    totalViews += siteViews;
                } else {
                    totalAwards += 0;
                    totalViews += 0;
                }
            });
        }

        const data = {
            websites,
            awards: totalAwards,
            views: totalViews
        };

        return res.status(200).json({
            data,
            message: "User profile fetched successfully",
            status: 200
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            message: "Error fetching user profile",
            error: error.message,
            status: 500
        });
    }
});


module.exports = router;
