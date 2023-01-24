// Запросим библиотеку mongoose
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Определяем схему БД объявление
const comment = new mongoose.Schema(
    {
        author: {  
            type: mongoose.Schema.Types.ObjectId,
            // связь с айди юзера
            ref: 'User',
            required: true, 
        },
        advert: {
            type: mongoose.Schema.Types.ObjectId,
            // связь с айди юзера
            ref: 'Advert',
            required: true, 
        },
        content: { type: String, required: true },
    },  
    {
        // Присваиваем поля createdAt и updatedAt с типом данных
        timestamps: true
    }
);

// подключение плагина высокоуровневой пагинации
comment.plugin(mongoosePaginate);    

// Экспортируем модуль
module.exports = mongoose.model('Comment', comment);