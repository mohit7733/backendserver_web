const express = require('express');
const router = express.Router();
const Adspace = require('../models/adspace');
const auth = require('../middleware/auth');
const Ads = require('../models/Ads');
const Add_view = require('../models/ad_views');


router.post('/adspace', auth, async (req, res) => {
    try {
        const count = await Adspace.find().sort({ adspace_id: -1 }).limit(1);
        const adspace_id = count[0].adspace_id + 1;
        const { title, image_width, image_height, available_space, validity_days, price, status } = req.body;
        if (!title || !image_width || !image_height || !available_space || !validity_days || !price) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const adspace = new Adspace({ adspace_id, title, image_width, image_height, available_space, validity_days, price, status });
        await adspace.save();
        return res.status(201).json({ adspace, message: 'Adspace created successfully', status: 200 });
    } catch (error) {
        console.error('Error creating adspace:', error);
        res.status(500).json({
            message: 'Error creating adspace',
            error: error.message
        });
    }
});

router.get('/alladspace', async (req, res) => {
    try {
        const adspace = await Adspace.find().sort({ adspace_id: -1 });
        if (!adspace) {
            return res.status(404).json({ message: 'Adspace not found' });
        }
        res.status(200).json({ adspace, message: 'Adspace fetched successfully' });
    } catch (error) {
        console.error('Error fetching adspace:', error);
        res.status(500).json({
            message: 'Error fetching adspace',
            error: error.message
        });
    }
});

router.get('/adspace/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const adspace = await Adspace.findById(id);
        if (!adspace) {
            return res.status(404).json({ message: 'Adspace not found' });
        }
        res.status(200).json({ adspace, message: 'Adspace fetched successfully', status: 200 });
    } catch (error) {
        console.error('Error fetching adspace:', error);
        res.status(500).json({
            message: 'Error fetching adspace',
            error: error.message
        });
    }
});

router.post('/statusAdspace/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const adspace = await Adspace.findByIdAndUpdate(id, { status });
        if (!adspace) {
            return res.status(404).json({ message: 'Adspace not found' });
        }
        res.status(200).json({ adspace, message: 'Adspace updated successfully', status: 200 });
    } catch (error) {
        console.error('Error updating adspace:', error);
        res.status(500).json({
            message: 'Error updating adspace',
            error: error.message
        });
    }
});

router.post('/editAdspace/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { adspace_id, title, image_width, image_height, available_space, validity_days, price, status } = req.body;
    try {
        const adspace = await Adspace.findByIdAndUpdate(id, { adspace_id, title, image_width, image_height, available_space, validity_days, price, status });
        if (!adspace) {
            return res.status(404).json({ message: 'Adspace not found' });
        }
        res.status(200).json({ adspace, message: 'Adspace updated successfully', status: 200 });
    } catch (error) {
        console.error('Error updating adspace:', error);
        res.status(500).json({
            message: 'Error updating adspace',
            error: error.message
        });
    }
});

router.delete('/adspace/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const adspace = await Adspace.findByIdAndDelete(id);
        if (!adspace) {
            return res.status(404).json({ message: 'Adspace not found' });
        }
        res.status(200).json({ adspace, message: 'Adspace deleted successfully', status: 200 });
    } catch (error) {
        console.error('Error deleting adspace:', error);
        res.status(500).json({ message: 'Error deleting adspace', error: error.message });
    }
});

// ads add route

router.post('/addads', async (req, res) => {
    try {
        const multer = require('multer');
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/ads/');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });

        const upload = multer({ storage: storage }).fields([
            { name: 'ad_image', maxCount: 1 },
        ]);

        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error uploading files', error: err.message });
            }
            const count = await Ads.find().sort({ ad_id: -1 }).limit(1);
            const ad_id = (count[0]?.ad_id ? count[0]?.ad_id : 0) + 1;
            const { adspace_id,
                alt_text,
                title_text,
                link,
                email } = req.body;
            const ad_image = req.files['ad_image'] ? req.files['ad_image'][0].path : null;
            const ads = new Ads({
                ad_id,
                adspace_id,
                ad_image,
                alt_text,
                title_text,
                link,
                email
            });
            await ads.save();
            res.status(200).json({ ads, message: 'Ads created successfully', status: 200 });
        })
    } catch (error) {
        console.error('Error submitting ads:', error);
        res.status(500).json({
            message: 'Error submitting ads',
            error: error.message
        });
    }
});

router.get('/allads', auth, async (req, res) => {
    try {
        const ads = await Ads.find();
        const addspace = await Adspace.find()
        const view = await Add_view.find()
        res.status(200).json({ ads, view, addspace, message: 'Ads fetched successfully', status: 200 });
    } catch (error) {
        console.error('Error get add:', error);
        res.status(500).json({
            message: 'Error get ads',
            error: error.message
        });
    }
});

router.get('/ads/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const ads = await Ads.findById(id);
        if (!ads) {
            return res.status(404).json({ message: 'Ads not found' });
        }
        res.status(200).json({ ads, message: 'Ads fetched successfully', status: 200 });
    } catch (error) {
        console.error('Error get add:', error);
        res.status(500).json({
            message: 'Error get ads',
            error: error.message
        });
    }
});

router.post('/statusads/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const ads = await Ads.findByIdAndUpdate(id, { status });
        res.status(200).json({ ads, message: 'Ads updated successfully', status: 200 });
    } catch (error) {
        console.error('Error status add:', error);
        res.status(500).json({
            message: 'Error status ads',
            error: error.message
        });
    }
});

router.post('/editads/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { alt_text, title_text, link, start_date, end_date, status } = req.body;
        const ads = await Ads.findByIdAndUpdate(id, { alt_text, title_text, link, start_date, end_date, status });
        res.status(200).json({ ads, message: 'Ads updated successfully', status: 200 });
    } catch (error) {
        console.error('Error status add:', error);
        res.status(500).json({
            message: 'Error status ads',
            error: error.message
        });
    }
});

router.delete('/ads/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const ads = await Ads.findByIdAndDelete(id);
        res.status(200).json({ ads, message: 'Ads deleted successfully', status: 200 });
    } catch (error) {
        console.error('Error status add:', error);
        res.status(500).json({
            message: 'Error status ads',
            error: error.message
        });
    }
});

router.get('/addwebsite/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ads = await Ads.find({ adspace_id: id, status: 1 }).limit(4);
        if (!ads) {
            return res.status(404).json({ message: 'Ads not found' });
        }
        res.status(200).json({ ads, message: 'Ads fetched successfully', status: 200 });
    } catch (error) {
        console.error('Error status add:', error);
        res.status(500).json({
            message: 'Error status ads',
            error: error.message
        });
    }
})

router.post('/adsview', async (req, res) => {
    const { ad_id, user_ip, view_date } = req.body;
    console.log(req.body);
    try {
        const existingViewView = await Add_view.findOne({ ad_id, user_ip });
        if (existingViewView && view_date) {
            view_date && (existingViewView.view_date = existingViewView.view_date + view_date);
            await existingViewView.save();
        } else if (view_date) {
            const viewView = new Add_view({ ad_id, user_ip, view_date });
            await viewView.save();
        }

        res.status(201).json({ message: 'View created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating like view', error: err });
    }
});



module.exports = router;



