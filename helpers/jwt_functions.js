const jwt = require('jsonwebtoken');
require('dotenv/config')
const generateToken = (payload, expiresIn = '1h') => {
    const secretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign(payload, secretKey, { expiresIn });
};


const verifyToken = (token, ret = false) => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        return jwt.verify(token, secretKey);
    } catch (error) {
        if (ret == true) return false;
        throw new Error('Invalid or expired token');
    }
};


module.exports = {
    generateToken,
    verifyToken
}