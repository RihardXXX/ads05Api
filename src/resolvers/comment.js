const { User, Advert } = require('../models');

module.exports = {
    // При запросе разрешается информация об авторе комментария
    author: async (comment, args) => {
        return await User.findById(comment.author);
    },
    // При запросе разрешается список заметок автора
    advert: async (comment, args) => {
        return await Advert.findById(comment.advert);
    },
};