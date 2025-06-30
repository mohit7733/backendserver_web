const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailsender');
const { websiteadditionalinfo, guruofday } = require('../middleware/emailtemplate');
const { GotdWinner, GotmWinner, GotyWinner } = require('../models/aword_winner');
router.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    const emailContent = await websiteadditionalinfo(subject, text);
    const result = await sendEmail(to, subject, emailContent);
    console.log(result);
    res.status(200).json({ message: 'Email sent successfully', result });
});

router.post('/send-guruofday-email', async (req, res) => {
    const { to, recipientName, websiteSlug, badgeId, mailType } = req.body;
    const emailContent = await guruofday(recipientName, websiteSlug, badgeId, mailType);
    const result = await sendEmail(to, mailType === "gotd" ? "Guru of the Day - Web Guru Awards" : mailType === "gotm" ? "Guru of the Month - Web Guru Awards" : "Guru of the Year - Web Guru Awards", emailContent);
    const [gotdWinner, gotmWinner, gotyWinner] = await Promise.all([
        GotdWinner.findOne({ website_id: badgeId }),
        GotmWinner.findOne({ website_id: badgeId }),
        GotyWinner.findOne({ website_id: badgeId })
    ]);
    if (gotdWinner && mailType === "gotd") {
        gotdWinner.mail_sent = 1;
        await gotdWinner.save();
    }
    if (gotmWinner && mailType === "gotm") {
        gotmWinner.mail_sent = 1;
        await gotmWinner.save();
    }
    if (gotyWinner && mailType === "goty") {
        gotyWinner.mail_sent = 1;
        await gotyWinner.save();
    }
    res.status(200).json({ message: 'Email sent successfully', result });
});

module.exports = router;
