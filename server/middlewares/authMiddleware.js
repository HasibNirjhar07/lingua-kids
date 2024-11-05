// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'randomsecret'); // Verify the token
        req.user = decoded; // Attach user info to request
        console.log('User authenticated:', decoded);
        next(); // Continue to the next middleware/route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
