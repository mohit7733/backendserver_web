const express = require('express');
const { Blog, BlogView } = require('../models/blogs');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/blogsall/:count/:page/:type', async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;  // Make sure it's a number
        const limit = parseInt(req.params.count) || 10;  // Default limit = 10 if not provided
        const type = req.params.type || 'all';  // Default type = 'all' if not provided
        const skip = (page - 1) * limit;
        // const query = type === 'all' ? {} : { status: 1 };

        const [blogs, totalBlogs, blogViews] = await Promise.all([
            Blog.find().sort({ publish_date: -1 }).skip(skip).limit(limit),
            Blog.countDocuments(),
            BlogView.find()
        ]);
        res.status(200).json({
            blogs: blogs || [],
            pages: Math.ceil(totalBlogs / limit),
            currentPage: page,
            totalBlogs,
            blogViews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
});

router.get('/blogs/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug_url: req.params.slug })
        res.status(200).json(blog)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog', error: error.message })
    }
})

router.delete('/blogdelete/:slug', auth, async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ slug_url: req.params.slug })
        res.status(200).json({ status: 200, message: "Blog Deleted!", blog })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog', error: error.message })
    }
})

router.post('/addblog', auth, async (req, res) => {
    try {
        const multer = require('multer');
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/blogs/');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });

        const upload = multer({ storage: storage }).fields([
            { name: 'image', maxCount: 1 },
            { name: 'image_thumb', maxCount: 1 }
        ]);


        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error uploading files', error: err.message });
            }
            const {
                title,
                slug_url,
                content,
                publish_date,
                author,
                img_title,
                img_alt,
                status,
                page_title,
                page_content,
                page_meta_keywords,
                page_meta_description,
            } = req.body;

            const image = req.files['image'] ? req.files['image'][0].path : null;
            const image_thumb = req.files['image_thumb'] ? req.files['image_thumb'][0].path : null;
            const blogs = await Blog.find()

            const blog = new Blog({
                blog_id: blogs.sort((a, b) => b.blog_id - a.blog_id)[0]?.blog_id + 1,
                title,
                slug_url,
                content,
                publish_date,
                author,
                img_title,
                img_alt,
                status,
                page_title,
                page_content,
                page_meta_keywords,
                page_meta_description,
                image,
                image_thumb
            })
            await blog.save();

            res.status(200).json({
                message: 'Blog submitted successfully',
                blog: blog
            });
        });

    } catch (error) {
        console.error('Error submitting blog:', error);
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
})


router.put('/editblog/:slug', auth, async (req, res) => {
    try {
        const multer = require('multer');
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/blogs/');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });

        const upload = multer({ storage: storage }).fields([
            { name: 'image', maxCount: 1 },
            { name: 'image_thumb', maxCount: 1 }
        ]);

        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error uploading files', error: err.message });
            }

            const {
                title,
                slug_url,
                content,
                publish_date,
                author,
                img_title,
                img_alt,
                status,
                page_title,
                page_content,
                page_meta_keywords,
                page_meta_description,
            } = req.body;

            const image = req.files['image'] ? req.files['image'][0].path : null;
            const image_thumb = req.files['image_thumb'] ? req.files['image_thumb'][0].path : null;

            const updateData = {
                title,
                slug_url,
                content,
                publish_date,
                author,
                img_title,
                img_alt,
                status,
                page_title,
                page_content,
                page_meta_keywords,
                page_meta_description,
            };

            // Only update image fields if new files were uploaded
            if (image) updateData.image = image;
            if (image_thumb) updateData.image_thumb = image_thumb;

            const updatedBlog = await Blog.findOneAndUpdate(
                { slug_url: req.params.slug },
                { $set: updateData },
                { new: true }
            );

            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Blog updated successfully',
                blog: updatedBlog
            });
        });

    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
});


router.post('/blogview', async (req, res) => {
    try {
        const { blog_id, ip_address } = req.body;
        const blogView = await BlogView.findOne({ blog_id, ip_address });
        if (blogView) {
            blogView.view_count++;
            await blogView.save();
        } else {
            const newBlogView = new BlogView({ blog_id, ip_address, view_count: 1 });
            await newBlogView.save();
        }
        res.status(200).json({ message: 'Blog view counted successfully' });
    } catch (error) {
        console.error('Error counting blog view:', error);
        res.status(500).json({ message: 'Error counting blog view', error: error.message });
    }
})


module.exports = router;