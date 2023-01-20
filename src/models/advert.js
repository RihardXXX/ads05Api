// Запросим библиотеку mongoose
const mongoose = require('mongoose');

// Определяем схему БД объявление
const advert = new mongoose.Schema(
        {
            author: {  
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true, 
            },
            // category: { type: String, required: true },
            content: { type: String, required: true },
            // contact: { type: String, default: '' },
            // comments: [{}],
            // rating: { type: Number, default: 0 },
        },  
        {
            // Присваиваем поля createdAt и updatedAt с типом данных
            timestamps: true
        }
    );

// Экспортируем модуль
module.exports = mongoose.model('Advert', advert);