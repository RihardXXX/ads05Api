const { Advert } = require('../models');

const Mutation = {
    newAdvert: async (parent, args) => {
        const newItem = {
            author: 'Rihard',
            // category: 'JS',
            content: args.content,
            // contact: '112',
            // comments: [],
            // rating: 5,
        }

        return await Advert.create(newItem)
    },
    deleteAdvert: async (parent, { id }) => {
        try {
            await Advert.findOneAndRemove({ _id: id});
            return true;
        } catch (error) {
            console.log('Mutation/deleteAdvert error: ', error);
            return false;
        }
    },
    updateAdvert: async (parent, { id, fields }) => {
        try {
            return await Advert.findOneAndUpdate({ _id: id }, { $set: fields }, { new: true });
        } catch (error) {
            console.log('Mutation/updateAdvert error: ', error);
        }
    }
};

module.exports = Mutation;