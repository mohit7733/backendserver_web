const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Jobs = require('../models/jobs');
const { JobView } = require('../models/like_view');

router.get('/alljobs', async (req, res) => {
    try {
        // Faster run: use aggregation to join jobs and job views in the database
        const jobsWithViews = await Jobs.find().sort({ created_at: -1 });
        const jobViews = await JobView.find();
        const jobViewsMap = {};
        jobViews.forEach(view => {
            if (!jobViewsMap[view.job_id]) jobViewsMap[view.job_id] = 0;
            jobViewsMap[view.job_id]++;
        });

        const updatedJobs = jobsWithViews.map(job => {
            const jobObj = job.toObject();
            return {
                ...jobObj,
                view_count: jobViewsMap[job.id] || 0
            }
        });
        res.status(200).json({
            success: true,
            jobs: updatedJobs || []
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

router.get('/alljobsweb', async (req, res) => {
    try {
        // Faster run: use aggregation to join jobs and job views in the database
        const jobsWithViews = await Jobs.find({ status: 1 }).sort({ created_at: -1 });
        res.status(200).json({
            success: true,
            jobs: jobsWithViews || []
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
        upload(req, res, function (err) {
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

router.post('/editJobs/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Jobs.findByIdAndUpdate(id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            job: job
        });
    } catch (error) {
        // Enhanced error logging for ECONNRESET
        if (error.code === 'ECONNRESET') {
            console.error('Error updating job: Error: read ECONNRESET');
            console.error(error);
        } else {
            console.error('Error updating job:', error);
        }
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
});

router.post('/viewjob', async (req, res) => {
    try {
        const { job_id, ip_address } = req.body;
        const job = await Jobs.find({ id: job_id });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if job has already been viewed by this IP
        const existingView = await JobView.findOne({ ip_address: ip_address, job_id: job_id });

        if (existingView) {
            existingView.view_count = existingView.view_count + 1
            await existingView.save();
            return res.status(200).json({
                success: true,
                message: 'Job viewed updated'
            });
        }
        // Create new view record
        const newView = new JobView({
            job_id,
            ip_address
        });
        await newView.save();
        res.status(200).json({
            success: true,
            message: 'Job viewed successfully'
        });
    } catch (error) {
        console.error('Error viewing job:', error);
        res.status(500).json({
            success: false,
            message: 'Error viewing job',
            error: error.message
        });
    }
});

router.delete('/deleteJobs/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Jobs.findByIdAndDelete(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
});

router.get('/getjob/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Jobs.findOne({ id: Number(id) });
        const jobrecent = await Jobs.find({ status: 1 }).sort({ created_at: -1 }).limit(5);
        res.status(200).json({
            success: true,
            job,
            jobrecent
        });
    } catch (error) {
        console.error('Error getting job:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting job',
            error: error.message
        });
    }
});
router.get('/singlegetjob/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Jobs.findOne({ id: Number(id) });
        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        console.error('Error getting job:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting job',
            error: error.message
        });
    }
});

router.post('/submit-job', async (req, res) => {
    try {
        const multer = require('multer');
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/job_images/');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname.replace(/ /g, '-'));
            }
        });
        const upload = multer({ storage: storage }).single('company_logo');
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error uploading files', error: err.message });
            }
            const company_logo = req.file.path;
            const {
                title,
                email,
                company_name,
                url,
                workplace_type,
                job_type,
                location,
                skills,
                hdyh,
                job_description,

            } = req.body;
            const jobs = await Jobs.find({}).sort({ id: -1 }).limit(1);
            const id = jobs[0].id + 1;

            const newJob = new Jobs({
                id: id,
                title,
                email,
                company_name,
                url,
                workplace_type,
                job_type,
                location,
                skills,
                hdyh,
                job_description,
                file: company_logo
            });
            await newJob.save();
            res.status(200).json({
                success: true,
                status: 200,
                message: 'Job submitted successfully'
            });
        });

    } catch (error) {
        console.error('Error submitting job:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting job',
            error: error.message
        });
    }
});





module.exports = router;