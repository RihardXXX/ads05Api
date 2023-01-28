const mongoose = require('mongoose');

const generateLink = new mongoose.Schema(
    {
       link: { // ссылка подтверждения пользователя профиля
            type: String,
            required: true,
            index: { unique: true }
        },
        user: { // id юзера чей профиль должен быть подтвержден
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
        },
    },
    {
        // Присваиваем поля createdAt и updatedAt с типом Date
        timestamps: true
    }
);

// Экспортируем модуль
module.exports = mongoose.model('GenerateLink', generateLink);