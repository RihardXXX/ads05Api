const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
require('dotenv').config();

// decode token
const getUserId = token => {
    if (!token) {
        return;
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new GraphQLError('Такого токена не существует', {
            extensions: {
                code: '500',
                myExtension: "foo",
            },
        });
    }
}

module.exports = {
    getUserId,
}