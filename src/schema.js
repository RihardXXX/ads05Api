const gql = require('graphql-tag');
// const { GraphQLInputObjectType, GraphQLID, GraphQLString  } = require('graphql');
// const { input  } = require('graphql');

// const Fields = new GraphQLInputObjectType({
//     name: 'Fields',
//     fields: () => ({
//       author: { type: GraphQLString },
//       content:    { type: GraphQLString }, 
//     })
//   });

// описанная схема
const typeDefs = gql`
    type ADVERT {
        _id: ID!
        author: String!
        # category: String!
        content: String!
        # contact: String
        # rating: Int!
        # created_at: String!
        # updated_at: String!
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
    },
`

module.exports = typeDefs;