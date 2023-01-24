const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const user = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: { unique: true }
        },
        email: {
            type: String,
            required: true,
            index: { unique: true }
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: '',
        },
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                // айдишки с избранными 
                ref: 'Advert'
            }
        ],
    },
    {
        // Присваиваем поля createdAt и updatedAt с типом Date
        timestamps: true
    }
);

// подключение плагина высокоуровневой пагинации
user.plugin(mongoosePaginate);  

// Экспортируем модуль
module.exports = mongoose.model('User', user);