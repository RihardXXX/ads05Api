// Запросим библиотеку mongoose
const mongoose = require('mongoose');

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

// Экспортируем модуль
module.exports = mongoose.model('Comment', comment);