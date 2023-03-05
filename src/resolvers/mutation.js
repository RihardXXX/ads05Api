const { Advert, User, Comment, GenerateLink, ChangePassword } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { gravatar } = require('../util/gravatar');
const { errorAuth, errorField, errorNotItem, error403, getUser } = require('../util/utils');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
// Берем с переменной окружения порт, путь к апи, путь подключения в БД
require('dotenv').config();

const port = process.env.PORT || 4000;
const api_url = process.env.API_URL || '/api';
const domain = process.env.DOMAIN || 'http://localhost:';


const Mutation = {

    newAdvert: async (parent, { name, content, category, contact }, { idUser }) => {

        errorAuth(idUser);

        errorField(content, category, 'Не переданы поля контент и категория');

        const advert = await Advert.create(
            {
                author:  mongoose.Types.ObjectId(idUser),
                name,
                category,
                content,
                contact,
            }
        );

        // const advert = new Advert(
        //     {
        //         author:  mongoose.Types.ObjectId(idUser),
        //         name,
        //         category,
        //         content,
        //         contact,
        //     }
        // );

        // await advert.save();

        return advert;
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

            if (!username) {
                throw new GraphQLError('username: поле имя пользователя является обязательным');
            }

            if (username.length > 30) {
                throw new GraphQLError('username: имя пользователя не может быть больше 30 символов');
            }

            if (username.length < 5) {
                throw new GraphQLError('username: имя пользователя не может быть меньше 5 символов');
            }

            if (!email) {
                throw new GraphQLError('email: поле электронная почта является обязательным');
            }

            if (!password) {
                throw new GraphQLError('password: поле пароль является обязательным');
            }

            if (password.length < 5) {
                throw new GraphQLError('password: поле пароль не может содержать меньше 5 символов');
            }


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

            // create link for confirmed by email
            const uniquePath = uuidv4();
            const urlForMail = `${domain}${port}/confirm/${uniquePath}`;
            // console.log('urlForMail: ', urlForMail);
            // create GenerateLink model
            const linkBD = await GenerateLink.create({
                link: uniquePath,
                user: user._id
            });
            // send email user link
            const userLogin = process.env.LOGIN;
            const pass = process.env.PASSWORD;
            
            const transporter = nodemailer.createTransport({
                host: "smtp.mail.ru",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: userLogin, // generated ethereal user
                  pass, // generated ethereal password
                }
            });

            try {
                let info = await transporter.sendMail({
                    from: userLogin,
                    to: email, 
                    subject: 'Подтверждение авторизации', 
                    text: 'ads', 
                    html: `Пожалуйста перейдите по ссылке, чтобы подтвердить авторизацию и получить 
                        весь функционал приложения <a target="_blank" href="${urlForMail}">подтверждение авторизации</a>. Перейдите по пути ${urlForMail}`,
                });
                // console.log("Message sent: %s", info.messageId);
                // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              
                // // Preview only available when sending through an Ethereal account
                // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            } catch (error) {
                // console.log(112, error.message);
                // если такой почты не существует значит он не получит токен поэтому его надо удалить с БД
                await user.remove();
                await linkBD.remove();

                throw new GraphQLError('email: Такой почты не существует', {
                    extensions: {
                        code: '401',
                        myExtension: "foo",
                    },
                });
            }

            // return token
            // return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return {
                user: getUser(user),
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
            };
        } catch (error) {
            // custom error for client
            if (error.code === 11000) {
                const name =  Object.keys(error.keyValue)[0];
                const value = Object.values(error.keyValue);

                const message = `${name}: ${value} уже существует`;
                throw new GraphQLError(message, {
                    extensions: {
                        code: '500',
                        myExtension: "foo",
                    },
                });
            } else {
                throw new GraphQLError(error, {
                    extensions: {
                        code: '500',
                        myExtension: "foo",
                    },
                });
            }
        }
    },

    signIn: async (parent, { email, password }) => {

        try {
            if (!email) {
                throw new GraphQLError('email: поле электронная почта является обязательным');
            }
    
            if (!password) {
                throw new GraphQLError('password: поле пароль является обязательным');
            }
    
            if (password.length < 5) {
                throw new GraphQLError('password: поле пароль не может содержать меньше 5 символов');
            }
    
            if (email) {
                email = email.trim().toLowerCase();
            }
    
            const user = await User.findOne({ email });
    
            errorNotItem(user, 'email: пользователя с такой почтой не существует');
    
            const validPassword = await bcrypt.compare(password, user.password);
    
            if (!validPassword) {
                throw new GraphQLError('password: пароль введен неверный', {
                    extensions: {
                        code: '401',
                        myExtension: "foo",
                    },
                });
            }
    
            // return token
            // return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return {
                user: getUser(user),
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
            };
        } catch (error) {
            throw new GraphQLError(error, {
                extensions: {
                    code: '500',
                    myExtension: "foo",
                },
            });
        }

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
    
    requestLinkForPassword: async (parent, { email }) => {
        // console.log(email);
        try {

            if (!email) {
                throw new GraphQLError('email: поле электронная почта является обязательным');
            }

            // сделать проверку есть ли такая почта
            // normalize email
            email = email.trim().toLowerCase();

            const isEmail = await User.findOne({ email });

            if (!isEmail) {
                throw new GraphQLError('email: пользователя с такой почтой не существует');
            }

            // create link for confirmed by email
            const uniquePath = uuidv4();
            const urlForPassword = `${domain}${port}/changePassword/?email=${email}&path=${uniquePath}`;

            await ChangePassword.create({
                link: uniquePath,
                email,
            });

            const userLogin = process.env.LOGIN;
            const pass = process.env.PASSWORD;
            
            const transporter = nodemailer.createTransport({
                host: "smtp.mail.ru",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: userLogin, // generated ethereal user
                  pass, // generated ethereal password
                }
            });


            // тут оборачивать в try catch не требуется так как регистрируются люди с существующими почтами
            let info = await transporter.sendMail({
                from: userLogin,
                to: email, 
                subject: 'Смена Пароля', 
                text: 'ads', 
                html: `Пожалуйста перейдите по ссылке, чтобы 
                    сменить пароль <a target="_blank" href="${urlForPassword}">Смена пароля</a>. 
                    Перейдите по пути ${urlForPassword}`,
            });


            // console.log(urlForPassword);
            return true;
        } catch (error) {
            throw new GraphQLError(error, {
                extensions: {
                    code: '500',
                    myExtension: "foo",
                },
            });
        }
    },
};

module.exports = Mutation;