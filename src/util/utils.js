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

const errorAuth = idUser => {
    if (!idUser) {
        throw new GraphQLError('Вы не авторизованы', {
            extensions: {
                code: '401',
                myExtension: "foo",
            },
        });
    }
}

const errorField = (field1, field2, message) => {
    if (!field1 || !field2) {
        throw new GraphQLError(message, {
            extensions: {
                code: '400',
                myExtension: "foo",
            },
        });
    }
}

const error403 = (idUser, advert, message) => {
    if (String(advert.author) !== idUser) {
        throw new GraphQLError(message, {
            extensions: {
                code: '403',
                myExtension: "foo",
            },
        });
    }
}

const errorNotItem = (item, message) => {
    if (!item) {
        throw new GraphQLError(message, {
            extensions: {
                code: '400',
                myExtension: "foo",
            },
        });
    }
}

module.exports = {
    getUserId,
    errorAuth,
    errorField,
    error403,
    errorNotItem,
}