const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Jobs = require('../models/jobs');

router.get('/alljobs', async (req, res) => {
    try {
        const jobs = await Jobs.find().sort({ created_at: -1 });
        res.status(200).json({
            success: true,
            jobs: jobs || []
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
});
router.post('/savejob', auth, async (req, res) => {
    try {
        const {
            title,
            email,
            skills,
            company_name,
            workplace_type,
            job_type,
            location,
            hdyh,
            url,
            job_description,
            file,
            status
        } = req.body;

        const newJob = new Jobs({
            title,
            email,
            skills,
            company_name,
            workplace_type,
            job_type,
            location,
            hdyh,
            url,
            job_description,
            file,
            status
        });

        const multer = require('multer');
        const path = require('path');

        // Configure multer storage
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads/');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname));
            }
        });

        // Create multer upload instance
        const upload = multer({ 
            storage: storage,
            fileFilter: function (req, file, cb) {
                // Accept only specific file types
                const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = filetypes.test(file.mimetype);

                if (extname && mimetype) {
                    return cb(null, true);
                } else {
                    cb('Error: Invalid file type!');
                }
            }
        }).single('file');

        // Handle file upload
        upload(req, res, function(err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Error uploading file',
                    error: err
                });
            }
            
            // Update file path in newJob
            if (req.file) {
                newJob.file = req.file.path;
            }
        });

        const savedJob = await newJob.save();

        res.status(201).json({
            success: true,
            message: 'Job saved successfully',
            job: savedJob
        });
    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving job',
            error: error.message
        });
    }
});



module.exports = router;