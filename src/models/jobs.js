const mongoose = require('mongoose')

const jobsschema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    skills: {
        type: String,
        require: true
    },
    company_name: {
        type: String,
        require: true
    },
    workplace_type: {
        type: String,
        require: true
    },
    job_type: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    hdyh: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    job_description: {
        type: String,
        require: true
    },
    file: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
})

const Jobs = mongoose.model("Jobs", jobsschema);
module.exports = Jobs