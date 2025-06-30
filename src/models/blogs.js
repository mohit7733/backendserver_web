const mongoose = require('mongoose')

const blogschema = new mongoose.Schema({
    blog_id: {
        type: Number,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    slug_url: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    publish_date: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    image_thumb: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    img_title: {
        type: String,
        require: true
    },
    img_alt: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        require: true
    },
    page_title: {
        type: String,
        require: true
    },
    page_content: {
        type: String,
        // require: true
    },
    page_meta_keywords: {
        type: String,
        require: true
    },
    page_meta_description: {
        type: String,
        require: true
    },
})


const blogviewschema = new mongoose.Schema({
    blog_id: {
        type: Number,
        require: true
    },
    ip_address: {
        type: String,
        require: true
    },
    view_count: {
        type: Number,
        require: true
    }
})

const Blog = mongoose.model("Blogs", blogschema);
const BlogView = mongoose.model("Blog_View", blogviewschema);
module.exports = { Blog, BlogView }