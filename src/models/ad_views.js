const mongoose = require("mongoose")

const addviewSchema = new mongoose.Schema({
    ad_id: {
        type: Number,
        require: true
    },
    user_ip: {
        type: String,
        require: true
    },
    view_date: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model("Add_view", addviewSchema)