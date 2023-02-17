const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

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
            index: { unique: true },
            validate: [validateEmail, 'Введите правильный формат электронной почты'],
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
        // если авторизовываешься через почту то нужно подтвердить свой профиль
        confirmed: {
            type: Boolean,
            default: false,
        }
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