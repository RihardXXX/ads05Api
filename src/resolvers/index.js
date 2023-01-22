const Query = require('./query');
const Mutation = require('./mutation');
const Advert = require('./advert');
const User = require('./user');
const { GraphQLDateTime } = require('graphql-iso-date');

const resolvers = {
    Query,
    Mutation,
    DateTime: GraphQLDateTime,
    Advert,
    User,
}

module.exports = resolvers;