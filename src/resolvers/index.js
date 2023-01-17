const Query = require('./query');
const Mutation = require('./mutation');
const { GraphQLDateTime } = require('graphql-iso-date');

const resolvers = {
    Query,
    Mutation,
    DateTime: GraphQLDateTime
}

module.exports = resolvers;