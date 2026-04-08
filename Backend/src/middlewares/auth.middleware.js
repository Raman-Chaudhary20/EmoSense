const jwt = require('jsonwebtoken');
const redis = require('../config/Cache');

async function authUser(req, res, next) {
    const token  = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await redis.get(token)

    if(isBlacklisted){
        return res.status(401).json({
            message: "token was blacklisted."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {authUser};