const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
    website_id: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    website_url: {
        type: String,
        required: true,
    },
    website_description: {
        type: String,
        required: true,
    },
    website_banner_image: {
        type: String,
        required: true,
    },
    website_image: {
        type: String,
        required: true,
    },
    image_rand: {
        type: String,
        default: null,
    },
    colors: {
        type: Array,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    facebook_url: {
        type: String,
        default: "",
    },
    twitter_url: {
        type: String,
        default: "",
    },
    youtube_url: {
        type: String,
        default: "",
    },
    google_plus_url: {
        type: String,
        default: "",
    },
    instagram_url: {
        type: String,
        default: "",
    },
    linkedin_url: {
        type: String,
        default: "",
    },
    designed_by: {
        type: String,
        required: true,
    },
    designer_url: {
        type: String,
        required: true,
    },
    developed_by: {
        type: String,
        default: null,
    },
    developer_url: {
        type: String,
        default: null,
    },
    country_id: {
        type: Number,
        default: "",
    },
    user_email: {
        type: String,
        required: true,
    },
    like_count: {
        type: Number,
        required: true,
    },
    view_count: {
        type: Number,
        required: true,
    },
    plan_id: {
        type: Number,
        required: true,
    },
    submit_date: {
        type: Date,
        required: true,
    },
    approve_date: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    duplicate_website: {
        type: Number,
        required: true,
    }
});

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;
