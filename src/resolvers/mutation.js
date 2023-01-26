const { Advert, User, Comment } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { gravatar } = require('../util/gravatar');
const { errorAuth, errorField, errorNotItem, error403 } = require('../util/utils');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
require('dotenv').config();


const Mutation = {
    newAdvert: async (parent, { name, content, category, contact }, { idUser }) => {

        errorAuth(idUser);

        errorField(content, category, 'Не переданы поля контент и категория');

        return await Advert.create(
            {
                author:  mongoose.Types.ObjectId(idUser),
                name,
                category,
                content,
                contact,
            }
        );
    },
    deleteAdvert: async (parent, { id }, { idUser }) => {

        errorAuth(idUser);

        // Находим объявление
        const advert = await Advert.findById(id);

        // если не находим объявление такое
        errorNotItem(advert, 'Такого объявления не существует');

        // Если владелец заметки и текущий пользователь не совпадают, выбрасываем
        // запрет на действие
        error403(idUser, advert, 'Вы не уполномочены удалять это объявление');

        try {
            await advert.remove();
            return true;
        } catch (error) {
            console.log('Mutation/deleteAdvert error: ', error);
            return false;
        }
    },
    updateAdvert: async (parent, { id, fields }, { idUser }) => {

        errorAuth(idUser);

        // Находим объявление
        const advert = await Advert.findById(id);

        // если не находим объявление такое
        errorNotItem(advert, 'Такого объявления не существует');

        // Если владелец заметки и текущий пользователь не совпадают, выбрасываем
        // запрет на действие
        error403(idUser, advert, 'Вы не уполномочены обновлять это объявление');

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

        errorNotItem(user, 'Такого пользователя не существует');

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
    toggleFavorite: async (parent, { id }, { idUser }) => {

        errorAuth(idUser);
        
        // находим объявление
        const advert = await Advert.findById(id);

        // если не находим объявление такое
        errorNotItem(advert, 'Такого объявления не существует');

        // проверяем лайкал ли он ранее
        const isLiked = advert.favoritedBy.includes(idUser);

        if (isLiked) {
            // убираем объявление из своего списка избранных
            await User.findByIdAndUpdate(
                idUser,
                {
                    $pull: {
                        favorites: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    // Устанавливаем new как true, чтобы вернуть обновленный документ
                    new: true
                }
            )

            // обновляем объявление
            // убираем себя из спиcка и делаем инrремент
            return await Advert.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(idUser)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    // Устанавливаем new как true, чтобы вернуть обновленный документ
                    new: true
                }
            );
        } else {
            await User.findByIdAndUpdate(
                idUser,
                {
                    $push: {
                        favorites: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    // Устанавливаем new как true, чтобы вернуть обновленный документ
                    new: true
                }
            )

            return await Advert.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(idUser)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    new: true
                }
            );
        }
    },
    newComment: async (parent, { content, idAdvert }, { idUser }) => {

        errorAuth(idUser);

        errorField(content, idAdvert, 'Не переданы поля контент и айди объявления');
        
        try {
            return await Comment.create({
                author: mongoose.Types.ObjectId(idUser),
                advert: mongoose.Types.ObjectId(idAdvert),
                content,
            });
        } catch (error) {
            throw new GraphQLError('Ошибка создания комментария', {
                extensions: {
                    code: '500',
                    myExtension: "foo",
                },
            });
        }
    },
    updateComment: async (parent, { id, content }, { idUser }) => {

        errorAuth(idUser);

        errorField(content, id, 'Не переданы поля айди объявления и контент');

        // Находим комментарий
        const comment = await Comment.findById(id);

        // Если владелец заметки и текущий пользователь не совпадают, выбрасываем
        // запрет на действие
        error403(idUser, comment, 'Вы не уполномочены обновлять этот комментарий');

        try {
            return await Comment.findOneAndUpdate(
                { _id: id }, 
                { $set: {
                        content
                    } 
                }, 
                { new: true }
            );
        } catch (error) {
            throw new GraphQLError('Ошибка в запросе на обновление комментария updateComment', {
                extensions: {
                    code: '400',
                    myExtension: "foo",
                },
            });
        }
    },
    deleteComment: async (parent, { id }, { idUser }) => {

        errorAuth(idUser);

        // Находим комментарий
        const comment = await Comment.findById(id);

        // если не находим объявление такое
        errorNotItem(comment, 'Такого комментария не существует');

        // Если владелец заметки и текущий пользователь не совпадают, выбрасываем
        // запрет на действие
        error403(idUser, comment, 'Вы не уполномочены удалять этот комментарий');

        try {
            await comment.remove();
            return true;
        } catch (error) {
            throw new GraphQLError('Ошибка в запросе на удаление комментария deleteComment', {
                extensions: {
                    code: '400',
                    myExtension: "foo",
                },
            });
        }
    },
};

module.exports = Mutation;