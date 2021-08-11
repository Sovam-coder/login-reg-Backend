const User = require('../models/user.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';

// Register API
const registerUser = async (req, res) => {

    try {

        const userName = req.body.userName;
        const email = req.body.email;

        const isUserNameExists = await User.findOne({ userName });

        if (isUserNameExists) {
            return res.status(409).json({
                message: 'Username already exists',
            });
        }

        const isEmailExists = await User.findOne({ email });

        if (isEmailExists) {
            return res.status(409).json({
                message: 'Email already exists',
            });
        }

        const user = new User({
            _id: mongoose.Types.ObjectId(),
            userName,
            fullName: req.body.fullName,
            email,
            password: req.body.password,
            collegeName: req.body.collegeName,
            profilePic: req.file.path
        });

        const addedUser = await user.save();

        return res.status(201).json({
            message: 'User added successfully',
            result: addedUser
        });

    }
    catch (err) {
        return res.status(500).json({
            message: 'Unable to process your request',
            error: err
        });
    }
};

// Login API
const loginUser = async (req, res) => {
    try {

        let user;

        if (req.body.userName) {
            user = await User.findOne({ userName: req.body.userName });
        }

        if (req.body.email) {
            user = await User.findOne({ email: req.body.email });
        }

        if (!user) {
            return res.status(404).json({
                message: 'Account not found'
            });
        }

        const isMatch = await user.matchPassword(req.body.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const payload = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            collegeName: user.collegeName,
            profilePic: user.profilePic
        };

        const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: "7 days" });

        return res.status(200).json({
            message: 'Successfully logged in',
            result: token
        });

    }
    catch (err) {
        return res.status(500).json({
            message: 'Unable to process your request',
            error: err
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};