const mongoose = require('mongoose');

const changePassword = new mongoose.Schema(
    {
        link: { // ссылка  для смены пароля
            type: String,
            required: true,
            index: { unique: true }
        },
        email: { // почта юзера пароль которого нужно сменить
            type: String,
            required: true,
            ref: 'User'
        },
    },
    {
        // Присваиваем поля createdAt и updatedAt с типом Date
        timestamps: true
    }
);

// Экспортируем модуль
module.exports = mongoose.model('ChangePassword', changePassword);