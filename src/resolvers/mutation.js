const { Advert, User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { gravatar } = require('../util/gravatar');
const { GraphQLError } = require('graphql');
const { ApolloServerErrorCode } = require('@apollo/server/errors');
require('dotenv').config();

// example error
// throw new GraphQLError("my message", {
//     extensions: {
//       code: 'FORBIDDEN',
//       myExtension: "foo",
//     },
// });

// if (error.extensions?.code === ApolloServerErrorCode.GRAPHQL_PARSE_FAILED)

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