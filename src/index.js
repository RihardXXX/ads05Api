// npm install @apollo/server express graphql cors body-parser
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const express = require('express');
// const helmet = require("helmet");
const db = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { getUserId } = require('./util/utils');
const { confirmUser } = require('./confirmUser');
const { changePasswordUser } = require('./changePasswordUser');
// Берем с переменной окружения порт, путь к апи, путь подключения в БД
require('dotenv').config();

const port = process.env.PORT || 4000;
const api_url = process.env.API_URL || '/api';
const DB_HOST = process.env.DB_HOST;
const domain = process.env.DOMAIN || 'http://localhost:';

// Необходимая логика для интеграции с Express
const app = express();
// защита от уязвимостей

// Внимание обязательно на проде подрубить helmet  для безопасности

// app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
// // кросдоменные запросы
app.use(cors());

// подключаем шаблонизатор паг
app.set('view engine', 'pug');

// для подтверждения авторизации ссылка с почты
// это отдельный роут который будет менять статус юзера на подтвержден
app.get('/confirm/:idConfirm', confirmUser);
// это отдельный роут который будет менять пароль юзера 
app.get('/changePassword', changePasswordUser);
// роут который непосредственно меняет пароль
app.post('/hidden', (req, res) => {
    // тут сделать обязательную проверку на сгенерированный путь
    console.log(req);
})

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
    // избежать большого количества вложеных запросов
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server
    .start()
    .then(async () => {
        // Настраиваем промежуточное ПО Express для обработки CORS, разбора тела,
        // и наша функция expressMiddleware.
        app.use(
            api_url,
            cors({ origin: [`${domain}${port}${api_url}`, 'https://studio.apollographql.com'] }),
            bodyParser.json(),
            // expressMiddleware принимает те же аргументы:
            // экземпляр сервера Apollo и дополнительные параметры конфигурации
            expressMiddleware(server, {
                context: async ({ req }) => {
                    const token =  req.headers.authorization;
                    // без этой проверки все приложение крашится
                    if (token) {
                        const { id: idUser } = getUserId(token);
                        return { idUser };
                    }
                    return { token: req.headers.token };
                },
            }),
        );

        // Модифицированный запуск сервера
        await new Promise((resolve) => httpServer.listen({ port }, resolve));

        console.log(`🚀 Server Graphql ready at ${domain}${port}${api_url}`);

    })
    .catch(e => {
        console.log('server start failed: ', e);
    })

