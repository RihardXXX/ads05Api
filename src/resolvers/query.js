const { Advert, User } = require('../models');
const { GraphQLError } = require('graphql');

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
     // Добавляем в существующий объект module.exports следующее:
    user: async (parent, { username }) => {
        // Находим пользователя по имени
        try {
            return await User.findOne({ username });
        } catch (error) {
            throw new GraphQLError('Пользователь с таким именем не найден', {
                extensions: {
                    code: '404',
                    myExtension: "foo",
                },
            });
        }
    },
    users: async (parent, args) => {
        // Находим всех пользователей
        try {
            return await User.find({});
        } catch (error) {
            throw new GraphQLError('Пользователи не найдены', {
                extensions: {
                    code: '404',
                    myExtension: "foo",
                },
            });
        }
    },
    me: async (parent, args, { idUser }) => {
        // Находим пользователя по текущему пользовательскому контексту
        try {
            return await User.findById(idUser);
        } catch (error) {
            throw new GraphQLError('Пользователь такой не найден', {
                extensions: {
                    code: '404',
                    myExtension: "foo",
                },
            });
        }
    }
};

module.exports = Query;