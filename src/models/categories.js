const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: { type: String, required: true },
    category_id: { type: Number, required: true, unique: true },
    slug: { type: String },
    isEditing: { type: Boolean, default: false },
});

module.exports = mongoose.model('Category', categorySchema);
