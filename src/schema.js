const gql = require('graphql-tag');

// описанная схема
const typeDefs = gql`
    scalar DateTime
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        favorites: [ADVERT!]
    },
    type ADVERT {
        _id: ID!
        author: User!
        category: String!
        content: String!
        contact: String
        favoriteCount: Int!
        favoriteBy: [User!]
        createdAt: DateTime!
        updatedAt: DateTime!
    },
    input ADVERTFIELD {
        category: String
        content: String
        contact: String
    }
    type Query {
        ads: [ADVERT!]!
        advert(id: String!): ADVERT!
        user(username: String!): User
        users: [User!]!
        me: User!
    },
    type Mutation {
        newAdvert(content: String!, category: String!, contact: String): ADVERT!
        updateAdvert(id: ID!, fields: ADVERTFIELD): ADVERT!
        deleteAdvert(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(email: String!, password: String!): String!
        toggleFavorite(id: ID!): ADVERT!
    },
`

module.exports = typeDefs;