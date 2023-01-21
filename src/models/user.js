const mongoose = require('mongoose');

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

// Экспортируем модуль
module.exports = mongoose.model('User', user);