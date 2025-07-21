const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const signupSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                // Simple email regex for validation
                return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    otp: {
        type: Number,
        default: null,
    },
    profileImage: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    designer_url: {
        type: String,
        default: null,
    },
    designed_by: {
        type: String,
        default: null,
    },
    country: {
        type: String,
        default: null,
    },
    instagram_url: {
        type: String,
        default: null,
    },
    facebook_url: {
        type: String,
        default: null,
    },
    twitter_url: {
        type: String,
        default: null,
    },
    linkedin_url: {
        type: String,
        default: null,
    },
    youtube_url: {
        type: String,
        default: null,
    },
    behance_url: {
        type: String,
        default: null,
    },
    tiktok_url: {
        type: String,
        default: null,
    },
    dribbble_url: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent saving if email is missing or null
signupSchema.pre('validate', function (next) {
    if (!this.email) {
        this.invalidate('email', 'Email is required');
    }
    next();
});

// Hash the password before saving the user
signupSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);  // Salt rounds = 10
    }
    next();
});


const SignupModel = mongoose.model("signup", signupSchema);

module.exports = { SignupModel };