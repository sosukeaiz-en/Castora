
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    //  Read the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Authorization token is required'
        });
    }

    // Expected format: Bearer <token>
    const match = authHeader.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return res.status(401).json({
            success: false,
            message: 'Invalid authorization format'
        });
    }

    const token = match[1];

    //  Check server configuration
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is missing from .env');

        return res.status(500).json({
            success: false,
            message: 'Authentication is not configured'
        });
    }

    try {
        //  Verify the token's signature and expiration
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        // Our login controller will store the user ID
        // under the userId property.
        if (
            typeof decoded.userId !== 'string' ||
            !/^[a-f\d]{24}$/i.test(decoded.userId)
        ) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token payload'
            });
        }

        //  Confirm that the user still exists
        const user = await User.findById(decoded.userId)
            .select('_id name email role');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        //  Attach user details to the request
        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        };

        //  Continue to the controller or next middleware
        return next();

    } catch (error) {
        if (
            error.name === 'TokenExpiredError' ||
            error.name === 'JsonWebTokenError' ||
            error.name === 'NotBeforeError'
        ) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Pass database or unexpected errors to error middleware
        return next(error);
    }
};

module.exports = authMiddleware;
