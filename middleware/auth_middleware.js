const jwt = require('jsonwebtoken');
const User = require("../models/user");


const Valid_User = (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, decoded) => {
            try {
                if (err) {
                    throw new Error('User is not authorized');
                }
                req.user = await User.findById(decoded.userID).select('-password');
                // console.log('request_User>>>>>>', req.user);
                next();
            } catch (error) {
                res.status(401).json({
                    message: error.message || 'User is not authorized', status:'failed',});
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthenticated or token is missing',status:'failed' });
    }
};


module.exports = { Valid_User };
