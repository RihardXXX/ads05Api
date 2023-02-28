const { User, Comment } = require('../models');

module.exports = {
    // При запросе разрешается информация об авторе объявления
    author: async (advert, args) => {
        return await User.findById(advert.author);
    },
    // При запросе разрешается информация favoritedBy для объявления
    favoritedBy: async (advert, args) => {
        return await User.find({ _id: { $in: advert.favoritedBy } });
    },
    // получаем все комментарии к статье
    comments: async(advert, args) => {
        return await Comment.find({ advert: advert._id });
    }
};