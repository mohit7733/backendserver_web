const express = require('express');
const router = express.Router();
const Website = require('../models/website');
const { LikeView, ViewView } = require('../models/like_view');
const auth = require('../middleware/auth');
const { GotdWinner, GotmWinner, GotyWinner } = require('../models/aword_winner');
const { Blog } = require('../models/blogs');
const { emailTemplateapproved, emailTemplatesubmited, emailverification } = require('../middleware/emailtemplate');
const { sendEmail } = require('../controllers/emailsender');
const { SignupModel } = require('../models/login');

// get all websites with like/view counts and gotdWinner
router.get('/websites', async (req, res) => {
    try {
        const { filter, month, day, year } = req.query;
        let query = {};
        // const newdate = new Date()
        const award_date = (year || "2015") + "-" + (month || "01") + "-" + (day || "01");
        if (filter === 'GOTD') {
            query.award_date = award_date;
        } else if (filter === 'GOTM') {
            query.award_month = award_date;
        }

        const [websites, likeViews, viewViews, gotdWinners, gotmWinners, gotyWinners] = await Promise.all([
            Website.find().sort({ submit_date: -1 }),
            LikeView.find(),
            ViewView.find(),
            GotdWinner.find(year && month && day ? { award_date: award_date } : {}),
            GotmWinner.find(),
            GotyWinner.find()
        ]);

        const likeMap = {};
        likeViews.forEach(lv => {
            if (!likeMap[lv.website_id]) likeMap[lv.website_id] = 0;
            if (lv.like_count > 0) likeMap[lv.website_id]++;
        });

        const viewMap = {};
        viewViews.forEach(vv => {
            if (!viewMap[vv.website_id]) viewMap[vv.website_id] = 0;
            if (vv.view_count > 0) viewMap[vv.website_id]++;
        });

        const gotdMap = {};
        if (filter === 'GOTD' || !filter) {
            gotdWinners.filter(gw => {
                if (year && !month) {
                    return (new Date(gw.award_date).getFullYear() === new Date(award_date).getFullYear())
                } else if (month && !year) {
                    return (new Date(gw.award_date).getMonth() === new Date(award_date).getMonth())
                } else if (year && month) {
                    return (new Date(gw.award_date).getFullYear() === new Date(award_date).getFullYear() && new Date(gw.award_date).getMonth() === new Date(award_date).getMonth())
                } else {
                    return true
                }
            }).forEach(gw => {
                gotdMap[gw.website_id] = gw;
            });
        }

        const gotmMap = {};
        if (filter === 'GOTM') {
            gotmWinners.filter(gw => {
                if (year) {
                    return new Date(gw.award_month).getFullYear() === new Date(award_date).getFullYear()
                } else {
                    return true
                }
            }).forEach(gw => {
                gotmMap[gw.website_id] = gw;
            });
        }


        const gotyMap = {};
        if (filter === 'GOTY') {
            gotyWinners.filter(gw => {
                if (year) {
                    return new Date(gw.award_year).getFullYear() === new Date(award_date).getFullYear()
                } else {
                    return true
                }
            }).forEach(gw => {
                gotyMap[gw.website_id] = gw;
            });
        }

        let updatedWebsites = websites.map(website => {
            const websiteObj = website.toObject();
            return {
                ...websiteObj,
                real_like_count: likeMap[website.website_id] || 0,
                real_view_count: viewMap[website.website_id] || 0,
                gotdWinner: gotdMap[website.website_id] || null,
                gotmWinner: gotmMap[website.website_id] || null,
                gotyWinner: gotyMap[website.website_id] || null
            };
        });

        if (filter === 'GOTD') {
            updatedWebsites = updatedWebsites.filter(website => website.gotdWinner);
        } else if (filter === 'GOTM') {
            updatedWebsites = updatedWebsites.filter(website => website.gotmWinner);
        } else if (filter === 'GOTY') {
            updatedWebsites = updatedWebsites.filter(website => website.gotyWinner);
        }

        res.status(200).json(updatedWebsites);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching websites', error: error.message });
    }
});


// get websites nominees
router.get('/websites-nominees/:count/:page/:winnertype', async (req, res) => {
    try {
        const websites = await Website.find().sort({ submit_date: -1 })
        const winner = await GotdWinner.find();
        const winnermonth = await GotmWinner.find();
        let nominee_websitesslice;
        if (req.params.winnertype === 'gotd') {
            nominee_websitesslice = websites.filter(website => website.status === 1 && website.duplicate_website === 0 && !winner.find(winner => winner.website_id === website.website_id));
        } else if (req.params.winnertype === 'gotm') {
            nominee_websitesslice = websites.filter(website => website.status === 1 && website.duplicate_website === 0 && winner.find(winner => winner.website_id === website.website_id));
        } else if (req.params.winnertype === 'goty') {
            nominee_websitesslice = websites.filter(website => website.status === 1 && website.duplicate_website === 0 && winnermonth.find(winner => winner.website_id === website.website_id));
        } else {
            nominee_websitesslice = websites.filter(website => website.status === 1 && website.duplicate_website === 0);
        }
        // let nominee_websitesslice = websites.filter(website => website.status === 1 && website.duplicate_website === 0);
        if (nominee_websitesslice.length === 0) {
            res.status(200).json({ nominee_websites: [], pages: 0, ok: true });
            return;
        }
        const page = req.params.page;
        const limit = req.params.count;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const nominee_websites = nominee_websitesslice.slice(startIndex, endIndex);
        res.status(200).json({ nominee_websites, pages: Math.ceil(nominee_websitesslice.length / req.params.count), ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching websites', error: error.message, ok: false });
    }
});
// Submit a new website
router.post('/submit-site', async (req, res) => {
    try {
        const multer = require('multer');
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads/');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname.replace(/ /g, '-'));
            }
        });

        const upload = multer({ storage: storage }).fields([
            { name: 'website_banner_image', maxCount: 1 },
            { name: 'website_image', maxCount: 1 }
        ]);

        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error uploading files', error: err.message });
            }

            const {
                title,
                website_url,
                designed_by,
                designer_url,
                user_email,
                country_id,
                website_description,
                colors,
                categories,
                tags,
                facebook_url,
                twitter_url,
                instagram_url,
                linkedin_url,
                youtube_url,
                behance_url,
                dribbble_url,
                tiktok_url,
                slug
            } = req.body;

            // Validate required fields
            const requiredFields = ['title', 'website_url', 'designed_by', 'designer_url', 'user_email', 'website_description'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} is required` });
                }
            }

            // Get file paths if files were uploaded
            const website_banner_image = req.files['website_banner_image'] ? req.files['website_banner_image'][0].path : null;
            const website_image = req.files['website_image'] ? req.files['website_image'][0].path : null;
            const websites = await Website.find()
            // Create new website document
            const website = new Website({
                title,
                website_url,
                designed_by,
                designer_url,
                user_email,
                country_id,
                website_description,
                website_banner_image,
                website_image,
                colors: JSON.parse(colors || '[]'),
                categories: JSON.parse(categories || '[]'),
                tags: JSON.parse(tags || '[]'),
                facebook_url,
                twitter_url,
                instagram_url,
                linkedin_url,
                youtube_url,
                behance_url,
                dribbble_url,
                tiktok_url,
                website_id: websites.sort((a, b) => b.website_id - a.website_id)[0]?.website_id + 1,
                slug,
                image_rand: Math.random().toString(36).substring(2, 15),
                duplicate_website: 0,
                like_count: 0,
                view_count: 0,
                plan_id: 0,
                status: 0,
                submit_date: new Date(),
                approve_date: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            });

            await website.save();
            const emailContent = await emailTemplatesubmited(website?.designed_by, website?.title, website?.slug);
            const result = await sendEmail(
                website?.user_email,
                'Website Submitted',
                emailContent
            );

            const user = await SignupModel.findOne({ email: user_email });
            if (!user) {
                return res.status(400).json({ message: "User not found", success: false });
            }
            if (user.credit > 0) {
                user.credit = user.credit - 1;
                await user.save();
            } else {
                return res.status(400).json({ message: "You have no credit. Please purchase a plan.", success: false });
            }

            res.status(201).json({
                message: 'Website submitted successfully',
                website: website,
                result
            });
        });
    } catch (error) {
        console.error('Error submitting website:', error);
        res.status(500).json({
            message: 'Error submitting website',
            error: error.message
        });
    }
});
router.post("/user/submitemailverification", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required", success: false });
    }
    try {
        const user = await SignupModel.findOne({ email });
        const website = await Website.find({ user_email: email });

        console.log(user, website.length == 0);


        if (!user && website.length == 0) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const emailTemplate = emailverification("user", otp);
            await sendEmail(email, "Email Verification - Web Guru Awards", emailTemplate);
            return res.status(200).json({ message: "OTP sent to your email", success: true, otp });
        } else if (user && (!user?.credit || user?.credit == 0)) {
            return res.status(400).json({ message: "You have no credit. Please purchase a plan.", success: false });
        } else {
            return res.status(200).json({ message: "Nothing to do" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Failed to send OTP", error: error.message, success: false });
    }
});
// check if title is available
router.get('/title-check/:slug', async (req, res) => {
    try {
        if (req.params.slug == "undefined") {
            return res.status(400).json({ message: "Invalid slug", success: false });
        }
        const website = await Website.findOne({ slug: req.params.slug });
        if (website) {
            res.status(200).json({ message: 'Title already exists', success: false });
        } else {
            res.status(200).json({ message: 'Title is available', success: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching websites', error: error.message });
    }
});

// admin get website by id
router.get('/websites/:id', async (req, res) => {
    try {
        const website = await Website.findOne({ _id: req.params.id });
        res.status(200).json(website);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching website', error: error.message });
    }
});
// get website by slug
router.get('/single-website/:slug', async (req, res) => {
    try {
        const website = await Website.findOne({ slug: req.params.slug, status: 1 });
        const [gotd, gotm, goty] = await Promise.all([
            GotdWinner.findOne({ website_id: website.website_id }),
            GotmWinner.findOne({ website_id: website.website_id }),
            GotyWinner.findOne({ website_id: website.website_id })
        ]);

        const user = await SignupModel.findOne({ email: website.user_email });


        const websitedata = {
            website,
            gotd,
            gotm,
            goty,
            user
        }
        res.status(200).json(websitedata);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching website', error: error.message });
    }
});
// admin update website
router.post('/websites/:slug', auth, async (req, res) => {
    try {
        const multer = require('multer');
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads/');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname.replace(/ /g, '-'));
            }
        });

        const upload = multer({ storage: storage }).fields([
            { name: 'website_banner_image', maxCount: 1 },
            { name: 'website_image', maxCount: 1 }
        ]);

        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error uploading files', error: err.message });
            }

            // Get existing website data
            const existingWebsite = await Website.findOne({ _id: req.params.slug });
            if (!existingWebsite) {
                return res.status(404).json({ message: 'Website not found' });
            }

            const {
                title,
                slug,
                website_url,
                website_description,
                user_email,
                like_count,
                view_count,
                facebook_url,
                twitter_url,
                youtube_url,
                instagram_url,
                linkedin_url,
                designed_by,
                designer_url,
                country_id,
                categories,
                colors,
                tags,
                status,
                duplicate_website
            } = req.body;

            // Get file paths if files were uploaded
            let website_banner_image = existingWebsite.website_banner_image;
            let website_image = existingWebsite.website_image;

            if (req?.files?.website_banner_image) {
                // Delete old banner image if exists
                if (existingWebsite.website_banner_image) {
                    const fs = require('fs');
                    try {
                        fs.unlinkSync(existingWebsite.website_banner_image);
                    } catch (err) {
                        console.error('Error deleting old banner image:', err);
                    }
                }
                website_banner_image = req.files['website_banner_image'][0].path;
            }

            // if (req?.files?.website_image) {
            //     // Delete old website image if exists
            //     if (existingWebsite.website_image) {
            //         const fs = require('fs');
            //         try {
            //             fs.unlinkSync(existingWebsite.website_image);
            //         } catch (err) {
            //             console.error('Error deleting old website image:', err);
            //         }
            //     }
            //     website_image = req.files['website_image'][0].path;
            // }

            // Create update data object with only provided fields
            const updateData = {};

            if (title) updateData.title = title;
            if (website_url) updateData.website_url = website_url;
            if (designed_by) updateData.designed_by = designed_by;
            if (designer_url) updateData.designer_url = designer_url;
            if (user_email) updateData.user_email = user_email;
            if (country_id) updateData.country_id = country_id;
            if (website_description) updateData.website_description = website_description;
            if (website_banner_image) updateData.website_banner_image = website_banner_image;
            if (website_image) updateData.website_image = website_image;
            if (colors) updateData.colors = JSON.parse(colors || '[]');
            if (categories) updateData.categories = JSON.parse(categories || '[]');
            if (tags) updateData.tags = JSON.parse(tags || '[]');
            if (facebook_url) updateData.facebook_url = facebook_url;
            if (twitter_url) updateData.twitter_url = twitter_url;
            if (instagram_url) updateData.instagram_url = instagram_url;
            if (linkedin_url) updateData.linkedin_url = linkedin_url;
            if (youtube_url) updateData.youtube_url = youtube_url;
            if (slug) updateData.slug = slug;
            if (like_count) updateData.like_count = like_count;
            if (view_count) updateData.view_count = view_count;
            if (status) updateData.status = status;
            if (duplicate_website) updateData.duplicate_website = duplicate_website;
            updateData.updated_at = new Date();
            let result;
            if (status == 1 && existingWebsite?.status == 0) {
                const emailContent = await emailTemplateapproved(existingWebsite?.designed_by, existingWebsite?.title, existingWebsite?.slug, "badge");
                result = await sendEmail(
                    existingWebsite?.user_email,
                    'Website Approved',
                    emailContent
                );
            }

            const website = await Website.findOneAndUpdate(
                { _id: req.params.slug },
                updateData,
                { new: true }
            );

            res.status(200).json({ message: 'Website updated successfully', website, result });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating website', error: error.message });
    }
});
// admin delete website
router.delete('/websites/:slug', auth, async (req, res) => {
    try {
        const website = await Website.findOneAndDelete({ _id: req.params.slug });
        res.status(200).json({ message: 'Website deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting website', error: error.message });
    }
});

router.get('/websites-count', auth, async (req, res) => {
    try {
        // Fetch all counts in parallel for efficiency
        const [
            websitesCount,
            gotdCount,
            gotmCount,
            gotyCount,
            blogsCount
        ] = await Promise.all([
            (Website && typeof Website.countDocuments === 'function') ? Website.countDocuments() : 0,
            (GotdWinner && typeof GotdWinner.countDocuments === 'function') ? GotdWinner.countDocuments() : 0,
            (GotmWinner && typeof GotmWinner.countDocuments === 'function') ? GotmWinner.countDocuments() : 0,
            (GotyWinner && typeof GotyWinner.countDocuments === 'function') ? GotyWinner.countDocuments() : 0,
            (Blog && Blog.find())
        ]);
        res.status(200).json({
            websites: websitesCount,
            gotd: gotdCount,
            gotm: gotmCount,
            goty: gotyCount,
            blogs: blogsCount?.length || 0
        });
    } catch (error) {
        console.error('Error fetching websites count:', error);
        res.status(500).json({
            message: 'Error fetching websites count',
            error: error.message
        });
    }
});





module.exports = router;
