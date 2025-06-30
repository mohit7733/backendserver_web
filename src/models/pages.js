const mongoose = require('mongoose');

// Define the Page schema
const pageSchema = new mongoose.Schema({
    page_slug: { type: String, required: true },
    page_name: { type: String, required: true },
    page_title: { type: String, required: true },
    page_content: { type: String },
    page_meta_keywords: { type: String },
    page_meta_description: { type: String },
    page_edit: { type: Boolean, default: false },
}, { timestamps: true });  // To automatically add createdAt and updatedAt

// Create a model based on the schema
const Page = mongoose.model('Pages', pageSchema);

module.exports = Page;
