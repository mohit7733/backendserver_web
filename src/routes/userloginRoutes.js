const express = require("express");
const router = express.Router();
const { SignupModel } = require("../models/login");
const { generateToken } = require("../utils/jwt");
const bcrypt = require('bcryptjs');
const { sendEmail } = require("../controllers/emailsender");
const { forgetpassword } = require("../middleware/emailtemplate");
const Website = require('../models/website');
const { LikeView, ViewView } = require('../models/like_view');
const { GotdWinner, GotmWinner, GotyWinner } = require('../models/aword_winner');
const auth = require('../middleware/auth');
const Plans = require('../models/plans');



// Helper function to check for missing fields
function hasMissingFields(obj, fields) {
    return fields.some(field => !obj[field]);
}

router.post("/user/signup", async (req, res) => {
    const { username, firstName, email, password } = req.body;
    console.log(req.body);

    if (hasMissingFields(req.body, ["username", "firstName", "email", "password"])) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const alreadyExists = await SignupModel.findOne({ $or: [{ email }, { username }] });
        if (alreadyExists) {
            let duplicateField = alreadyExists.email === email ? "Email" : "Username";
            return res.status(400).json({ message: `${duplicateField} already exists`, success: false });
        }

        const user = new SignupModel({ username, firstName, email, password });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ message: "User created successfully", user, token, success: true });
    } catch (error) {
        res.status(500).json({ message: "User creation failed", error: error.message, success: false });
    }
});

router.post("/user/login", async (req, res) => {
    const { email, password } = req.body;

    if (hasMissingFields(req.body, ["email", "password"])) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }
    try {
        const alreadyExists = await SignupModel.findOne({ $or: [{ email }, { username: email }] });
        if (!alreadyExists) {
            return res.status(404).json({ message: "Invalid email/username or password", success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, alreadyExists.password);
        if (!isPasswordValid) {
            return res.status(404).json({ message: "Invalid email/username or password", success: false });
        }
        const token = generateToken(alreadyExists._id);
        res.status(200).json({ message: "Login successful", user: alreadyExists, token, success: true });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message, success: false });
    }


});

router.post("/user/update-profile", async (req, res) => {
    try {
        const { email, profileImage, description, firstName, username, userid } = req.body;

        if (!email || typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "A valid email is required.", success: false });
        }

        const user = await SignupModel.findOne({ _id: userid });
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }
        // Use a list of allowed fields and update in a loop for speed and maintainability
        // Check for payload too large (e.g., profileImage size)
        const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

        const updatableFields = [
            "email", "profileImage", "description", "firstName", "username",
            "designer_url", "country", "instagram_url", "facebook_url", "twitter_url", "linkedin_url", "designed_by", "youtube_url", "behance_url", "dribbble_url", "tiktok_url"
        ];

        // If profileImage is present and is a base64 string, check its size
        if (typeof req.body.profileImage === "string") {
            // Estimate base64 size
            const base64Length = req.body.profileImage.length;
            // 1 character = 0.75 bytes in base64
            const approxBytes = Math.ceil(base64Length * 0.75);
            if (approxBytes > MAX_PROFILE_IMAGE_SIZE) {
                return res.status(413).json({
                    message: "Profile image is too large. Maximum allowed size is 2MB.",
                    success: false
                });
            }
        }

        updatableFields.forEach(field => {
            if (typeof req.body[field] === "string") {
                // For email, trim and check non-empty
                if (field === "email") {
                    const trimmed = req.body.email.trim();
                    if (trimmed) user.email = trimmed;
                } else {
                    user[field] = req.body[field];
                }
            }
        });
        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            error: error.message,
            success: false
        });
    }
});

router.post("/user/forgetpassword", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required", success: false });
    }
    try {
        const user = await SignupModel.findOne({ email }).lean(false);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        await user.save();
        const emailTemplate = forgetpassword(user.firstName, otp);
        await sendEmail(user.email, "Forgot Password - Web Guru Awards", emailTemplate);
        return res.status(200).json({ message: "OTP sent to your email", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send OTP", error: error.message, success: false });
    }
});

router.post("/user/verifyotp", async (req, res) => {
    const { email, otp, newpassword } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required", success: false });
    }
    try {
        const user = await SignupModel.findOne({ email }).lean(false);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        if (String(user.otp) !== String(otp)) {
            return res.status(400).json({ message: "Invalid OTP", success: false });
        }
        user.otp = null;
        if (newpassword) {
            user.password = newpassword;
            await user.save();
            return res.status(200).json({ message: "Password reset successfully", success: true });
        } else {
            await user.save();
            return res.status(200).json({ message: "OTP verified successfully", success: true });
        }
    } catch (error) {
        return res.status(500).json({ message: "OTP verification failed", error: error.message, success: false });
    }
});


router.get("/designer-profile/:slug", async (req, res) => {
    const { slug } = req.params;
    try {
        const webdata = await Website.findOne({ slug });
        if (!webdata) {
            return res.status(404).json({ message: "Website not found", success: false });
        }
        // Fetch user and websites in parallel for speed
        const [user, websites, likeViews, viewViews, gotdWinners, gotmWinners, gotyWinners] = await Promise.all([
            SignupModel.findOne({ email: webdata.user_email }),
            Website.find({ user_email: webdata.user_email }),
            LikeView.find(),
            ViewView.find(),
            GotdWinner.find(),
            GotmWinner.find(),
            GotyWinner.find(),
        ]);

        // Create maps for fast lookup
        let totallike = 0
        const likeMap = {};
        likeViews.forEach(lv => {
            if (!likeMap[lv.website_id]) likeMap[lv.website_id] = 0;
            if (lv.like_count > 0) likeMap[lv.website_id]++;
            totallike += 1;
        });



        const viewMap = {};
        viewViews.forEach(vv => {
            if (!viewMap[vv.website_id]) viewMap[vv.website_id] = 0;
            if (vv.view_count > 0) viewMap[vv.website_id]++;
        });
        let totalwin = 0;
        const updatedWebsites = websites.map(website => {
            const websiteObj = website.toObject();
            gotdWinners.forEach(winner => {
                if (website.website_id === winner.website_id) totalwin += 1;
            });
            gotmWinners.forEach(winner => {
                if (website.website_id === winner.website_id) totalwin += 1;
            });
            gotyWinners.forEach(winner => {
                if (website.website_id === winner.website_id) totalwin += 1;
            });
            return {
                ...websiteObj,
                real_like_count: likeMap[website.website_id] || 0,
                real_view_count: viewMap[website.website_id] || 0,
            };
        });



        return res.json({
            success: true,
            message: "Designer profile fetched",
            user: user || {},
            website: updatedWebsites || [],
            total_like: totallike,
            total_win: totalwin,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching designer profile",
            error: error.message
        });
    }
});

router.post("/user/current-plan", async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
        const user = await SignupModel.findOne({ email });
        const activeplan = await Plans.findOne({ _id: user?.subscription[1]?.plansid });
        res.status(200).json({ activeplan, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message, success: false });
    }
});

router.post("/user/subscription", async (req, res) => {
    const { email, subscription, credit } = req.body;
    try {
        const user = await SignupModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const updateduser = await SignupModel.findByIdAndUpdate(user._id, { subscription, credit }, { new: true });
        res.status(200).json({ updateduser, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error creating subscription", error: error.message, success: false });
    }
});

router.get("/users", auth, async (req, res) => {
    try {
        const users = await SignupModel.find();
        res.status(200).json({ users, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message, success: false });
    }
});

router.get("/users/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await SignupModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const websites = await Website.find({ user_email: user.email });
        res.status(200).json({ user, success: true, websites });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message, success: false });
    }
});

router.post("/users/update/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { role, adminAccess } = req.body;
    try {
        const user = await SignupModel.findByIdAndUpdate(id, { role, adminAccess }, { new: true });
        res.status(200).json({ user, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message, success: false });
    }

});




module.exports = router;    
