const Advert = require('./advert');
const User = require('./user');
const Comment = require('./comment');
const GenerateLink = require('./generateLink');
const ChangePassword = require('./changePassword');

const models = {
    Advert,
    User,
    Comment,
    GenerateLink,
    ChangePassword,
}

module.exports = models;