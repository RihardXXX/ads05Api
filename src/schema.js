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
        confirmed: Boolean!
    },
    type Advert {
        _id: ID!
        author: User!
        name: String!
        category: String!
        content: String!
        contact: String
        favoriteCount: Int!
        favoritedBy: [User!]
        watch: Int!
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
        totalAdverts: Int!
        hasNextPage: Boolean!
        nextPage: Int
        offset: Int!
        limit: Int!
        page: Int!
    },
    type CommentFeed {
        comments: [Comment]!
        totalComments: Int
        hasNextPage: Boolean!
        nextPage: Int
        offset: Int!
        limit: Int!
        page: Int!
    }
    input Advertfield {
        name: String
        category: String
        content: String
        contact: String
    },
    type Query {
        ads: [Advert!]!
        advert(id: String!): Advert!
        advertFeed(offset: Int!, limit: Int!): AdvertFeed
        user(username: String!): User
        userForId(id: ID!): User
        users: [User!]!
        me: User!
        comment(id: ID!): Comment!
        commentFeed(offset: Int!, limit: Int!, idAdvert: ID!): CommentFeed
        testMailer(email: String!, message: String!): Boolean!
    },
    type Mutation {
        newAdvert(name: String!, content: String!, category: String!, contact: String): Advert!
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