const express = require("express");
const router = express.Router();
const { SignupModel } = require("../models/login");
const { generateToken } = require("../utils/jwt");
const bcrypt = require('bcryptjs');

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
    console.log(req.body);

    if (hasMissingFields(req.body, ["email", "password"])) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }
    try {
        const alreadyExists = await SignupModel.findOne({ $or: [{ email }, { username: email }] });
        console.log(alreadyExists);
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

module.exports = router;    
