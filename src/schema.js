const gql = require('graphql-tag');

// описанная схема
const typeDefs = gql`
    scalar DateTime
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        ads: [ADVERT!]!
    },
    type ADVERT {
        _id: ID!
        author: User!
        # category: String!
        content: String!
        # contact: String
        # rating: Int!
        createdAt: DateTime!
        updatedAt: DateTime!
    },
    input ADVERTFIELD {
        author: String
        content: String
    }
    type Query {
        ads: [ADVERT!]!
        advert(id: String!): ADVERT!
    },
    type Mutation {
        newAdvert(content: String!): ADVERT!
        updateAdvert(id: ID!, fields: ADVERTFIELD): ADVERT!
        deleteAdvert(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(email: String!, password: String!): String!
    },
`

module.exports = typeDefs;