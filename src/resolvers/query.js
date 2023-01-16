const { Advert } = require('../models');

const Query = {
    ads: async (parent, args) => {
        try {
            return await Advert.find();
        } catch (error) {
            console.log('Query/ads error: ', error);
        }
    },
    advert: async (parent, args) => {
        try {
            return await Advert.findById(args.id);   
        } catch (error) {
            console.log('Query/advert error: ', error);
        }
    },
};

module.exports = Query;