const { Advert } = require('../models')
 
 module.exports = {
    // При запросе разрешается список заметок автора
    adverts: async (user, args) => {
        return await Advert.find({ author: user._id }).sort({ _id: -1 });
    },
    // При запросе разрешается список избранных заметок 
    favorites: async (user, args) => {
        return await Advert.find({ favoritedBy: user._id }).sort({ _id: -1 });
    }
};