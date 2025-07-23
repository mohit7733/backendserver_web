const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt'); // JWT generation
const router = express.Router();
const bcrypt = require('bcryptjs');
const { SignupModel } = require('../models/login');

// Signup route to register a new admin user
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username is already in use
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'username already in use' });
        }
        // Create a new user and save to database
        const newUser = new User({ username, password });
        await newUser.save();
        // Generate a JWT token for the new user
        const token = generateToken(newUser._id);
        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login route to authenticate user and issue a admin token
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        let user = await User.findOne({ username });
        if (!user) {
            const alreadyExists = await SignupModel.findOne({ $or: [{ email: username }, { username: username }] });
            if (!alreadyExists) {
                return res.status(404).json({ message: "Invalid email/username or password", success: false });
            }
            console.log(alreadyExists.role);
            if (alreadyExists.role === "user") {
                return res.status(404).json({ message: "You are not authorized to access this page", success: false });
            }
            user = alreadyExists;
        }
       

        // Compare the provided password with the stored password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ message: "Invalid email/username or password", success: false });
        }
        // Generate a JWT token after successful authentication
        const token = generateToken(user._id);
        res.json({ token, message: 'Login Done', success: true, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;