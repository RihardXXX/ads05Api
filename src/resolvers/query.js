const { Advert, User, Comment } = require('../models');
const { GraphQLError } = require('graphql');
const { errorAuth, errorField, errorNotItem, error403 } = require('../util/utils');

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
            return await Advert.findById(args.id);   
        } catch (error) {
            console.log('Query/advert error: ', error);
        }
    },
    advertFeed: async (parent, { page, limit }) => {
        // const myCustomLabels = {
        //     totalDocs: 'totalAdverts',
        //     docs: 'adverts',
        // };
          
        // const options = {
        //     page,
        //     limit,
        //     customLabels: myCustomLabels,
        // };

        // const res = await Advert.paginate({}, options);

        // console.log('res: ', res);

        // Advert.paginate({}, options, function (err, result) {
        //     if (result) {
        //         console.log('result: ', result);
        //         return {
        //             adverts: result.adverts,
        //             totalAdverts: result.paginator.totalAdverts,
        //             hasNextPage: result.paginator.hasNextPage,
        //             nextPage: result.paginator.nextPage
        //         }
        //     }
        // });
        // const limit = 10;
        // let hasNextPage = false;
        // // Если курсор передан не будет, то по умолчанию запрос будет пуст
        // // В таком случае из БД будут извлечены последние заметки
        // let cursorQuery = {};

        // // Если курсор задан, запрос будет искать заметки со значением ObjectId
        // // меньше этого курсора
        // if (cursor) {
        //     cursorQuery = { _id: { $lt: cursor } };
        // }   
            
        // // Находим в БД limit + 1 заметок, сортируя их от старых к новым
        // let adverts = await Advert.find(cursorQuery)
        //     .sort({ _id: -1 })
        //     .limit(limit + 1);

        // // Если число найденных заметок превышает limit, устанавливаем
        // // hasNextPage как true и обрезаем заметки до лимита
        // if (adverts.length > limit) {
        //     hasNextPage = true;
        //     adverts = adverts.slice(0, -1);
        // }
        
        // // Новым курсором будет ID Mongo-объекта последнего элемента массива списка
        // const newCursor = adverts[adverts.length - 1]._id;

        // return {
        //     adverts,
        //     cursor: newCursor,
        //     hasNextPage
        // };

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
    commentFeed: async (parent, { cursor, idAdvert }) => {
        const limit = 10;
        let hasNextPage = false;
        // Если курсор передан не будет, то по умолчанию запрос будет пуст
        // В таком случае из БД будут извлечены последние заметки
        let cursorQuery = {};

        // Если курсор задан, запрос будет искать заметки со значением ObjectId
        // меньше этого курсора
        if (cursor) {
            cursorQuery = { _id: { $lt: cursor }, advert: { idAdvert } };
        }   
            
        // Находим в БД limit + 1 заметок, сортируя их от старых к новым
        let comments = await Comment.find(cursorQuery)
            .sort({ _id: -1 })
            .limit(limit + 1);

        // Если число найденных заметок превышает limit, устанавливаем
        // hasNextPage как true и обрезаем заметки до лимита
        if (comments.length > limit) {
            hasNextPage = true;
            comments = comments.slice(0, -1);
        }
        
        // Новым курсором будет ID Mongo-объекта последнего элемента массива списка
        const newCursor = comments[comments.length - 1]._id;
        
        return {
            comments,
            cursor: newCursor,
            hasNextPage
        };
    }
};

module.exports = Query;