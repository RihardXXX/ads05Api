// npm install @apollo/server express graphql cors body-parser
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const express = require('express');
const db = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { getUserId } = require('./util/utils');

// Берем с переменной окружения порт, путь к апи, путь подключения в БД
require('dotenv').config();

const port = process.env.PORT || 4000;
const api_url = process.env.API_URL || '/api';
const DB_HOST = process.env.DB_HOST;

// Необходимая логика для интеграции с Express
const app = express();
// Наш httpServer обрабатывает входящие запросы к нашему приложению Express.
// Ниже мы указываем серверу Apollo «слить» этот http-сервер,
// позволяя нашим серверам корректно завершать работу.
const httpServer = http.createServer(app);

// Подключаем БД
db.connect(DB_HOST);

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
                context: async ({ req }) => {
                    const token =  req.headers.authorization;
                    const { id: idUser } = getUserId(token);
                    return { idUser };
                },
            }),
        );

        // Модифицированный запуск сервера
        await new Promise((resolve) => httpServer.listen({ port }, resolve));

        console.log(`🚀 Server Graphql ready at http://localhost:${port}${api_url}`);
    })
    .catch(e => {
        console.log('server start failed: ', e);
    })

