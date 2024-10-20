// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already in use' });
        }

        // Create new user
        const newUser = new User({ username, email, password, role });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Log in an existing user
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate a token
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // If authentication successful, create a JWT
    const token = jwt.sign(
        {
            userId: user._id, 
            role: user.role // Include the user role in the token
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Search contact by email or phone
const searchUser = async (req, res) => {
    const { email, username } = req.query; // Get 'email' and 'phone' from the query parameters

    if (!email && !username) {
        return res.status(400).json({ message: 'Email or Username query parameter is required' });
    }

    try {
        // Build search query object
        let searchCriteria = {};
        if (email) {
            searchCriteria.email = { $regex: new RegExp(email, 'i') }; // Case-insensitive email search
        }
        if (username) {
            searchCriteria.phone = phone; // Exact match for phone
        }

        const user = await User.findOne(searchCriteria);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error searching User:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {
    register,
    login,
    searchUser
};
