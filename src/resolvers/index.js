const Query = require('./query');
const Mutation = require('./mutation');
const Advert = require('./advert');
const User = require('./user');
const Comment = require('./comment');
const { GraphQLDateTime } = require('graphql-iso-date');

const resolvers = {
    Query,
    Mutation,
    DateTime: GraphQLDateTime,
    Advert,
    User,
    Comment,
}

module.exports = resolvers;