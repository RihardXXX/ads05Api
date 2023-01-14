// npm install @apollo/server express graphql cors body-parser
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const express = require('express');
const gql = require('graphql-tag');

require('dotenv').config();
const port = process.env.PORT || 4000;
const api_url = process.env.API_URL || '/api';

// Необходимая логика для интеграции с Express
const app = express();
// Наш httpServer обрабатывает входящие запросы к нашему приложению Express.
// Ниже мы указываем серверу Apollo «слить» этот http-сервер,
// позволяя нашим серверам корректно завершать работу.
const httpServer = http.createServer(app);

let adsList = [
    { id: '1', content: 'This is a note', author: 'Adam Scott' },
    { id: '2', content: 'This is another note', author: 'Harlow Everly' },
    { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
];

// описанная схема
const typeDefs = gql`
    type Query {
        hello: String
        ads: [ADVERT!]!
        advert(id: String!): ADVERT!
    },
    type Mutation {
        newAdvert(content: String!): ADVERT!
    },
    type ADVERT {
        id: ID!
        content: String!
        author: String!
    }
`

const resolvers = {
    Query: {
        hello: () => 'Hello graph ql',
        ads: () => adsList,
        advert: (parent, args) => {
            return adsList.find(advert => advert.id === args.id);
        },
    },
    Mutation: {
        newAdvert: (parent, args) => {
            const newItem ={
                id: String(adsList.length + 1),
                author: 'Rihard',
                content: args.content
            }

            adsList.push(newItem);
            return newItem;
        }
    },
}

// Та же инициализация ApolloServer, что и раньше, плюс подключаемый модуль стока
// для нашего httpServer.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server
    .start()
    .then(async () => {
        // Настраиваем промежуточное ПО Express для обработки CORS, разбора тела,
        // и наша функция expressMiddleware.
        app.use(
            api_url,
            cors(),
            bodyParser.json(),
            // expressMiddleware принимает те же аргументы:
            // экземпляр сервера Apollo и дополнительные параметры конфигурации
            expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
            }),
        );

        // Модифицированный запуск сервера
        await new Promise((resolve) => httpServer.listen({ port }, resolve));

        console.log(`🚀 Server Graphql ready at http://localhost:${port}${api_url}`);
    })
    .catch(e => {
        console.log('server start failed: ', e);
    })

