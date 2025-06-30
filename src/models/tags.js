const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag_name: { type: String, required: true },
    tag_id: { type: Number, required: true, unique: true   },
    slug: { type: String, required: true, unique: true },
    isEditing: { type: Boolean, default: false },
});

module.exports = mongoose.model('Tag', tagSchema);
