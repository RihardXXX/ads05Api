const { ChangePassword, User } = require('./models');

const changePasswordUser = async (req, res) => {

    const { email, path } = req.query;

    console.log(email);
    console.log(path);
    // Вернуть шаблон с формой для смены пароля
    // в шаблон отправить и почту
    // в шаблоне через обычный js сделать валидацию
    // сделать запрос через обычный js смену пароля
    // в новом роуте найти по почте пользователя удалить ему пароль хеш сгенерировать новый хеш для пароля
    // в ответе в текущем шаблоне удалить верстку и дать понять что пароль сменен
    
    // // find model link
    // const generateLink = await GenerateLink.findOne({ link: uniqLink }).exec();

    // // find user
    // const user = await User.findById(String(generateLink.user));

    // const title = 'Подтверждение авторизации';
    // let message = '';

    // if (user.confirmed) {
    //     message = 'Вы ранее подтвердели авторизацию, вернитесь в приложение и обновитесь в нем';
    // } else {
    //     user.confirmed = true;
    //     await user.save();
    //     message = 'Вы подтвердели авторизацию, вернитесь в приложение и обновитесь в нем';
    // }

    res.send('ok');
}

module.exports = { changePasswordUser };