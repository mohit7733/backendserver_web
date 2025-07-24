const express = require('express');
const router = express.Router();
const { GotdWinner, GotmWinner, GotyWinner } = require('../models/aword_winner');
router.post('/awords', async (req, res) => {
    try {
        const { website_id, gotd_date, gotm_date, goty_date, mail_gotd, mail_gotm, mail_goty } = req.body;

        // Validate required fields
        if (!website_id) {
            return res.status(400).json({
                success: false,
                message: 'Website ID is required'
            });
        }

        // Find existing winners
        const [gotdWinner, gotmWinner, gotyWinner] = await Promise.all([
            GotdWinner.findOne({ website_id }),
            GotmWinner.findOne({ website_id }),
            GotyWinner.findOne({ website_id })
        ]);

        // Prevent multiple websites from having the same award date/month/year

        // Check for duplicate GOTD (day) award
        if (gotd_date) {
            const duplicateGotd = await GotdWinner.findOne({
                award_date: gotd_date,
                website_id: { $ne: website_id }
            });
            if (duplicateGotd) {
                return res.status(200).json({
                    success: false,
                    message: 'Another website has already been awarded GOTD for this date.'
                });
            }
        }

        // Check for duplicate GOTM (month) award
        if (gotm_date) {
            const duplicateGotm = await GotmWinner.findOne({
                award_month: gotm_date,
                website_id: { $ne: website_id }
            });
            if (duplicateGotm) {
                return res.status(200).json({
                    success: false,
                    message: 'Another website has already been awarded GOTM for this month.'
                });
            }
        }

        // Check for duplicate GOTY (year) award
        if (goty_date) {
            const duplicateGoty = await GotyWinner.findOne({
                award_year: goty_date,
                website_id: { $ne: website_id }
            });
            if (duplicateGoty) {
                return res.status(200).json({
                    success: false,
                    message: 'Another website has already been awarded GOTY for this year.'
                });
            }
        }

        // Update or create winners based on provided dates
        const updates = [];

        if (gotd_date) {
            if (gotdWinner) {
                gotdWinner.award_date = gotd_date;
                gotdWinner.mail_sent = mail_gotd ?? gotdWinner.mail_sent;
                updates.push(gotdWinner.save());
            } else {
                updates.push(new GotdWinner({
                    website_id,
                    award_date: gotd_date,
                    mail_sent: mail_gotd ?? 0
                }).save());
            }
        } else {
            await GotdWinner.deleteOne({ website_id });
        }

        if (gotm_date) {
            if (gotmWinner) {
                gotmWinner.award_month = gotm_date;
                gotmWinner.mail_sent = mail_gotm ?? gotmWinner.mail_sent;
                updates.push(gotmWinner.save());
            } else {
                updates.push(new GotmWinner({
                    website_id,
                    award_month: gotm_date,
                    mail_sent: mail_gotm ?? 0
                }).save());
            }
        } else {
            await GotmWinner.deleteOne({ website_id });
        }

        if (goty_date) {
            if (gotyWinner) {
                gotyWinner.award_year = goty_date;
                gotyWinner.mail_sent = mail_goty ?? gotyWinner.mail_sent;
                updates.push(gotyWinner.save());
            } else {
                updates.push(new GotyWinner({
                    website_id,
                    award_year: goty_date,
                    mail_sent: mail_goty ?? 0
                }).save());
            }
        } else {
            await GotyWinner.deleteOne({ website_id });
        }

        // Execute all updates in parallel
        await Promise.all(updates);

        res.status(200).json({
            success: true,
            message: 'Award winner(s) updated successfully'
        });

    } catch (error) {
        console.error('Error updating award winners:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating award winners',
            error: error.message
        });
    }
});

router.get('/awords/:website_id', async (req, res) => {
    try {
        const { website_id } = req.params;

        // Fetch all award winners in parallel for better performance
        const [gotdWinner, gotmWinner, gotyWinner] = await Promise.all([
            GotdWinner.findOne({ website_id }),
            GotmWinner.findOne({ website_id }),
            GotyWinner.findOne({ website_id })
        ]);

        // Return consistent response structure regardless of results
        res.status(200).json({
            success: true,
            data: {
                gotdWinner: gotdWinner?.award_date || null,
                gotmWinner: gotmWinner?.award_month || null,
                gotyWinner: gotyWinner?.award_year || null
            }
        });
    } catch (error) {
        console.error('Error fetching award winners:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching award winners',
            error: error.message
        });
    }
});





module.exports = router;
