
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateToken = (userId) => {
    return jwt.sign(
        { userId: userId.toString() },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
            algorithm: 'HS256'
        }
    );
};

const getSafeUser = (user) => {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        role: user.role
    };
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length > 80) {
            return res.status(400).json({
                success: false,
                message: 'Name must not exceed 80 characters'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        if (Buffer.byteLength(password, 'utf8') > 72) {
            return res.status(400).json({
                success: false,
                message: 'Password must not exceed 72 UTF-8 bytes'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');

            return res.status(500).json({
                success: false,
                message: 'Authentication is not configured'
            });
        }

        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: getSafeUser(user)
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user data'
            });
        }

        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');

            return res.status(500).json({
                success: false,
                message: 'Authentication is not configured'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: cleanEmail
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: getSafeUser(user)
        });

    } catch (error) {
        return next(error);
    }
};

const getMe = (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
};

module.exports = {
    register,
    login,
    getMe
};
