const jsStringify = require('js-stringify');
const { ChangePassword, User } = require('./models');
const bcrypt = require('bcrypt');

const changePasswordUser = async (req, res) => {

    const { email, path } = req.query;

    const data = { email, path };

    // connect pug template
    res.render('formChangePassword', { jsStringify , data});
}

const setNewPassword = async (req, res) => {

    const { email, path, password } = req.body;
    try {
            // проверяем есть ли в БД такая уникальная секретная ссылка с почты
        const isLink = await ChangePassword.findOne({ link: path });

        if (!isLink) {
            return;
        }

        // иначе подключаемся в БД юзера
        const user = await User.findOne({ email });

        const hash = await bcrypt.hash(password, 10);

        // console.log(hash);

        user.password = hash;

        await user.save();

        // console.log(user);

        return res.send('ok');    
    } catch (error) {
        return false;
    }    
}

module.exports = { changePasswordUser, setNewPassword };