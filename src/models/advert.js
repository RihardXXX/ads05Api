// Запросим библиотеку mongoose
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Определяем схему БД объявление
const advert = new mongoose.Schema(
    {
        // _id: {  
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true, 
        //     unique: true,
        // },
        author: {  
            type: mongoose.Schema.Types.ObjectId,
            // связь с айди юзера
            ref: 'User',
            required: true, 
        },
        name: { type: String, required: true },
        category: { type: Array, default: [], required: true },
        content: { type: String, required: true },
        favoriteCount: { type: Number, default: 0 },
        favoritedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                // связь с айди юзера
                ref: 'User'
            }
        ],
        contact: { type: String, default: '' },
        watch: { type: Number, default: 0 },
    },  
    {
        // Присваиваем поля createdAt и updatedAt с типом данных
        timestamps: true
    }
);

// подключение плагина высокоуровневой пагинации
advert.plugin(mongoosePaginate);

// Экспортируем модуль
module.exports = mongoose.model('Advert', advert);