const jwt = require('jsonwebtoken');
require('dotenv').config();

// decode token
const getUserId = token => {
    if (!token) {
        return;
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.log('getUserId error:', error);
    }
}

module.exports = {
    getUserId,
}