const express = require('express');
const router = express.Router();
const Newsletters = require('../models/newsletters');
const auth = require('../middleware/auth');
const Subscriber = require('../models/subscribers');
const Contact = require('../models/contacts');
const Ads = require('../models/Ads');
const { GotyWinner, GotmWinner, GotdWinner } = require('../models/aword_winner');
const Website = require('../models/website');


// router.post('/newsletters', async (req, res) => {
//     const { email } = req.body;
//     const newsletter = new Newsletters({ email });
//     await newsletter.save();
//     res.status(200).json(newsletter);
// });

router.get('/newsletterslist', auth, async (req, res) => {
    try {
        const newsletters = await Newsletters.find().sort({ updated_at: -1 });
        if (newsletters.length === 0) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.status(200).json({ status: 200, newsletters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/newsletters', auth, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const skip = (page - 1) * limit;
        const newsletters = await Newsletters.find().sort({ updated_at: -1 }).skip(skip).limit(limit);
        const total = await Newsletters.countDocuments();
        const totalPages = Math.ceil(total / limit);
        if (newsletters.length === 0) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.status(200).json({ status: 200, newsletters, totalPages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/newsletters', auth, async (req, res) => {
    try {
        const newsletter_ids = req.body.newsletter_id;
        if (!Array.isArray(newsletter_ids) || newsletter_ids.length === 0) {
            return res.status(400).json({ message: 'No newsletter IDs provided' });
        }

        const result = await Newsletters.deleteMany({ _id: { $in: newsletter_ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No newsletters found to delete' });
        }

        res.status(200).json({ message: 'Newsletters deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/newsletters/add', auth, async (req, res) => {
    try {
        const {
            newsletter_type,
            gotm_year,
            newsletter_title,
            newsletter_text,
            newsletter_date,
            newsletter_subject,
            newsletter_sent } = req.body;
        let newsletter_id = await Newsletters.find();
        newsletter_id = newsletter_id.reduce((max, item) => Math.max(max, item.newsletter_id), 0) + 1;
        const newsletter = new Newsletters({
            newsletter_id,
            newsletter_type,
            gotm_year,
            newsletter_title,
            newsletter_text,
            newsletter_date,
            newsletter_subject,
            newsletter_sent
        });
        await newsletter.save();
        res.status(200).json({ message: 'Newsletter added successfully', newsletter });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/newsletters/:id', auth, async (req, res) => {
    try {
        const newsletter = await Newsletters.findById(req.params.id);
        res.status(200).json({ status: 200, newsletter });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/admin/getmails/:type', auth, async (req, res) => {
    try {
        if (req.params.type === 'subscriber') {
            const mails = await Subscriber.find();
            const mail_list = mails.map(mail => mail.subscriber_email);
            res.status(200).json({ status: 200, mail_list });
        } else if (req.params.type === 'contact') {
            const mails = await Contact.find();
            const mail_list = mails.map(mail => mail.contact_email);
            res.status(200).json({ status: 200, mail_list });
        } else if (req.params.type === 'advertiser') {
            const mails = await Ads.find();
            const mail_list = mails.map(mail => mail.email);
            res.status(200).json({ status: 200, mail_list });
        } else if (req.params.type === 'goty') {
            const gotyWinners = await GotyWinner.find({}, 'website_id');
            const winnerWebsiteIds = gotyWinners.map(w => w.website_id);
            const websites = await Website.find({ website_id: { $in: winnerWebsiteIds } }, 'user_email');
            const mail_list = websites.map(site => site.user_email).filter(Boolean);
            res.status(200).json({ status: 200, mail_list });
        } else if (req.params.type === 'gotm') {
            const gotmWinners = await GotmWinner.find({}, 'website_id');
            const winnerWebsiteIds = gotmWinners.map(w => w.website_id);
            const websites = await Website.find({ website_id: { $in: winnerWebsiteIds } }, 'user_email');
            const mail_list = websites.map(site => site.user_email).filter(Boolean);
            res.status(200).json({ status: 200, mail_list });
        } else if (req.params.type === 'gotd') {
            const gotdWinners = await GotdWinner.find({}, 'website_id');
            const winnerWebsiteIds = gotdWinners.map(w => w.website_id);
            const websites = await Website.find({ website_id: { $in: winnerWebsiteIds } }, 'user_email');
            const mail_list = websites.map(site => site.user_email).filter(Boolean);
            res.status(200).json({ status: 200, mail_list });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;