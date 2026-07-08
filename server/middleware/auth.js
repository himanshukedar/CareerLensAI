const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');

module.exports = async function (req, res, next) {
    // Get token from header
    let token = req.header('x-auth-token');

    // Support Standard Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Search in the correct collection based on role in token
        let user;
        if (decoded.user.role === 'recruiter') {
            user = await Recruiter.findById(decoded.user.id).select('-password');
        } else if (decoded.user.role === 'admin') {
            user = await Admin.findById(decoded.user.id).select('-password');
        } else {
            user = await Student.findById(decoded.user.id).select('-password');
        }

        // Fallback for older tokens or if role is missing
        if (!user) {
            user = await Student.findById(decoded.user.id).select('-password') ||
                   await Recruiter.findById(decoded.user.id).select('-password') ||
                   await Admin.findById(decoded.user.id).select('-password');
        }

        if (!user) return res.status(401).json({ msg: 'User no longer exists' });

        // Convert to plain object and ensure id/role are set consistently
        const userPlain = user.toObject();
        userPlain.id = user._id.toString();
        userPlain.role = user.role || decoded.user.role; 
        req.user = userPlain;
        
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
