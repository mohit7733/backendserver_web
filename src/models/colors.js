const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    color_name: { type: String, required: true },
    color_id: { type: Number, required: true, unique: true   },
    isEditing: { type: Boolean, default: false },
});

module.exports = mongoose.model('Color', colorSchema);
