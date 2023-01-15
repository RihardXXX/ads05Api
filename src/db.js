// Затребуем библиотеку mongoose
const mongoose = require('mongoose');

// функции для соединения и отключения от БД 
module.exports = {
    connect: DB_HOST => {
        // Подключаемся к БД
        mongoose.set('strictQuery', false);
        mongoose.connect(DB_HOST, {
            // Используем обновленный парсер строки URL драйвера Mongo
            useNewUrlParser: true,
            // Используем новый механизм обнаружения и мониторинга серверов
            useUnifiedTopology: true,
        })
            .then(() => console.log('🚀 mongoose connected to mongodb'));

        // Выводим ошибку при неуспешном подключении
        mongoose.connection.on('error', err => {
            console.error(err);
            console.log('MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });
    },
    close: () => {
        mongoose.connection.close();
    }
};