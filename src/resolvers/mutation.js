const { Advert, User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { gravatar } = require('../util/gravatar');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
require('dotenv').config();

// example error
// throw new GraphQLError("my message", {
//     extensions: {
//       code: 'FORBIDDEN',
//       myExtension: "foo",
//     },
// });


const Mutation = {
    newAdvert: async (parent, args, { idUser }) => {
        if (!idUser) {
            throw new GraphQLError('Вы не авторизованы', {
                extensions: {
                    code: '401',
                    myExtension: "foo",
                },
            });
        }

        return await Advert.create({
            author:  mongoose.Types.ObjectId(idUser),
            // category: 'JS',
            content: args.content,
            // contact: '112',
            // comments: [],
            // rating: 5,
        });
    },
    deleteAdvert: async (parent, { id }, { idUser }) => {
        if (!idUser) {
            throw new GraphQLError('Вы не авторизованы', {
                extensions: {
                    code: '401',
                    myExtension: "foo",
                },
            });
        }

        // Находим объявление
        const advert = await Advert.findById(id);

        // если не находим объявление такое
        if (!advert) {
            throw new GraphQLError('Объявления с таким айди не существует', {
                extensions: {
                    code: '400',
                    myExtension: "foo",
                },
            });
        }

        // Если владелец заметки и текущий пользователь не совпадают, выбрасываем
        // запрет на действие
        if (String(advert.author) !== idUser) {
            throw new GraphQLError('Вы не уполномочены удалять эту заметку', {
                extensions: {
                    code: '403',
                    myExtension: "foo",
                },
            });
        }


        try {
            await advert.remove();
            return true;
        } catch (error) {
            console.log('Mutation/deleteAdvert error: ', error);
            return false;
        }
    },
    updateAdvert: async (parent, { id, fields }, { idUser }) => {
        if (!idUser) {
            throw new GraphQLError('Вы не авторизованы', {
                extensions: {
                    code: '401',
                    myExtension: "foo",
                },
            });
        }

        // Находим объявление
        const advert = await Advert.findById(id);

        // если не находим объявление такое
        if (!advert) {
            throw new GraphQLError('Объявление с таким айди не существует', {
                extensions: {
                    code: '400',
                    myExtension: "foo",
                },
            });
        }

        // Если владелец заметки и текущий пользователь не совпадают, выбрасываем
        // запрет на действие
        if (String(advert.author) !== idUser) {
            throw new GraphQLError('Вы не уполномочены обновлять эту заметку', {
                extensions: {
                    code: '403',
                    myExtension: "foo",
                },
            });
        }
        try {
            return await Advert.findOneAndUpdate({ _id: id }, { $set: fields }, { new: true });
        } catch (error) {
            console.log('Mutation/updateAdvert error: ', error);
        }
    },
    signUp: async (parent, { username, email, password }) => {
        try {

            // normalize email
            email = email.trim().toLowerCase();
            // generate hash password
            const hash = await bcrypt.hash(password, 10);
            // generate avatar
            const avatar = gravatar(email); 

            // create user
            const user = await User.create({
                username,
                email,
                avatar,
                password: hash,
            })

            // return token
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        } catch (error) {
            console.log(error)
            throw new Error('Mutation/signUp error create user');
        }
    },
    signIn: async (parent, { email, password }) => {
        if (email) {
            email = email.trim().toLowerCase();
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new GraphQLError('Такого пользователя не существует', {
                extensions: {
                    code: '401',
                    myExtension: "foo",
                },
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new GraphQLError('Введен неккоректный пароль', {
                extensions: {
                    code: '401',
                    myExtension: "foo",
                },
            });
        }

        // return token
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },
};

module.exports = Mutation;