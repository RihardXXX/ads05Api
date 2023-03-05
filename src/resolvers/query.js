const { Advert, User, Comment } = require('../models');
const { GraphQLError } = require('graphql');
const { errorAuth, errorField, errorNotItem, error403, isEmptyObject, getUser } = require('../util/utils');
const nodemailer = require("nodemailer");
// Берем с переменной окружения порт, путь к апи, путь подключения в БД
require('dotenv').config();

const Query = {

    ads: async (parent, args) => {
        try {
            return await Advert.find().limit(100);
        } catch (error) {
            console.log('Query/ads error: ', error);
        }
    },

    advert: async (parent, args) => {
        try {
            const advert = await Advert.findById(args.id);
            // при запросе добавлять поле просмотренные
            advert.watch += 1;
            await advert.save();
            return advert;
        } catch (error) {
            console.log('Query/advert error: ', error);
        }
    },

    advertFeed: async (parent, { offset, limit }) => {
        const myCustomLabels = {
            totalDocs: 'totalAdverts',
            docs: 'adverts',
        };
          
        const options = {
            offset,
            limit,
            customLabels: myCustomLabels,
        };

        try {
            const res = await Advert.paginate({}, options);

            if (isEmptyObject(res)) {
                return {
                    message: 'отсутствуют объявления'
                }
            }
    
            return {
                totalAdverts: res.totalAdverts,
                hasNextPage: res.hasNextPage,
                nextPage: res.nextPage,
                adverts: res.adverts,
                // offset: Number(res.offset) + Number(res.limit),
                offset: res.offset,
                limit: res.limit,
                page: res.page,
            }
        } catch (error) {
            throw new GraphQLError('Ошибка при запросе на получение фида объявлений', {
                extensions: {
                    code: '500',
                    myExtension: "foo",
                },
            });
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

    userForId: async (parent, { id }) => {
        try {
            return await User.findById(id);
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
            return await User.find({}).limit(100);
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
        errorAuth(idUser);
        try {
            const user = await User.findById(idUser);

            return getUser(user);
        } catch (error) {
            throw new GraphQLError('Пользователь такой не найден', {
                extensions: {
                    code: '404',
                    myExtension: "foo",
                },
            });
        }
    },

    comment: async (parent, { id }) => {
        errorNotItem(id, 'Требуется айди комментария');

        try {
            return await Comment.findById(id);   
        } catch (error) {
            throw new GraphQLError('Такой комментарий не найден', {
                extensions: {
                    code: '404',
                    myExtension: "foo",
                },
            });
        }
    },

    commentFeed: async (parent, { offset, limit, idAdvert }) => {

        const myCustomLabels = {
            totalDocs: 'totalComments',
            docs: 'comments',
        };
          
        const options = {
            offset,
            limit,
            customLabels: myCustomLabels,
        };

        const query = {
            advert: idAdvert
        };   

        try {
            const res = await Comment.paginate(query, options);

            if (isEmptyObject(res)) {
                return {
                    message: 'отсутствуют комментарии'
                }
            }

            // console.log(res);
    
            return {
                totalComments: res.totalComments,
                hasNextPage: res.hasNextPage,
                nextPage: res.nextPage,
                comments: res.comments,
                offset: res.offset,
                limit: res.limit,
                page: res.page,
            }
        } catch (error) {
            throw new GraphQLError('Ошибка при запросе на получение фида комментариев', {
                extensions: {
                    code: '500',
                    myExtension: "foo",
                },
            });
        }
    },

    testMailer: async (parent, { email, message }) => {

        try {
            const user = process.env.LOGIN;
            const pass = process.env.PASSWORD;

            // console.log(user);
            // console.log(pass);
            
            const transporter = nodemailer.createTransport({
                host: "smtp.mail.ru",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user, // generated ethereal user
                  pass, // generated ethereal password
                }
            });

            let info = await transporter.sendMail({
                from: user,
                to: email, 
                subject: "Hello ✔", 
                text: "Hello world?", 
                html: `<b>${message}</b>`,
              });
            
              console.log("Message sent: %s", info.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
              // Preview only available when sending through an Ethereal account
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
              return true;
        } catch (error) {
            console.log('error testMailer: ', error);
            return false;
        }
    },

    // autoAuth: async (parent, args, { idUser }) => {
    //     errorAuth(idUser);
    //     try {
    //         const user = await User.findById(idUser);

    //         return getUser(user);
    //     } catch (error) {
    //         throw new GraphQLError(error, {
    //             extensions: {
    //                 code: '500',
    //                 myExtension: "foo",
    //             },
    //         });
    //     }
    // },

};

module.exports = Query;