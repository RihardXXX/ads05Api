const { User } = require('../models');

module.exports = {
    // При запросе разрешается информация об авторе объявления
    author: async (advert, args) => {
        return await User.findById(advert.author);
    },
    // При запросе разрешается информация favoritedBy для объявления
    favoritedBy: async (advert, args) => {
        return await User.find({ _id: { $in: advert.favoritedBy } });
    }
};