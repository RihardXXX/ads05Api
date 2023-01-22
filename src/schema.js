const gql = require('graphql-tag');

// описанная схема
const typeDefs = gql`
    scalar DateTime
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        favorites: [Advert!]
        adverts: [Advert!]!
    },
    type Advert {
        _id: ID!
        author: User!
        category: String!
        content: String!
        contact: String
        favoriteCount: Int!
        favoritedBy: [User!]
        createdAt: DateTime!
        updatedAt: DateTime!
    },
    type Comment {
        _id: ID!
        author: User!
        advert: Advert!
        content: String!
        createdAt: DateTime!
        updatedAt: DateTime!
    },
    type AdvertFeed {
        adverts: [Advert]!
        cursor: String!
        hasNextPage: Boolean!
    },
    type CommentFeed {
        comments: [Comment]!
        cursor: String!
        hasNextPage: Boolean!
    }
    input Advertfield {
        category: String
        content: String
        contact: String
    },
    type Query {
        ads: [Advert!]!
        advert(id: String!): Advert!
        advertFeed(cursor: String): AdvertFeed
        user(username: String!): User
        userForId(id: ID!): User
        users: [User!]!
        me: User!
        comment(id: ID!): Comment!
        commentFeed(cursor: String, idAdvert: ID!): CommentFeed
    },
    type Mutation {
        newAdvert(content: String!, category: String!, contact: String): Advert!
        updateAdvert(id: ID!, fields: Advertfield): Advert!
        deleteAdvert(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(email: String!, password: String!): String!
        toggleFavorite(id: ID!): Advert!
        newComment(content: String!, idAdvert: ID!): Comment!
        updateComment(id: ID!, content: String!): Comment!
        deleteComment(id: ID!): Boolean
        vkAuth(login: String!): String!
    },
`

module.exports = typeDefs;