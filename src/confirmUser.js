const { GenerateLink, User } = require('./models');

const confirmUser = async (req, res) => {

    const uniqLink = req.params.idConfirm;
    
    // find model link
    const generateLink = await GenerateLink.findOne({ link: uniqLink }).exec();

    // find user
    const user = await User.findById(String(generateLink.user));

    const title = 'Подтверждение авторизации';
    let message = '';

    if (user.confirmed) {
        message = 'Вы ранее подтвердели авторизацию, вернитесь в приложение и обновитесь в нем';
    } else {
        user.confirmed = true;
        await user.save();
        message = 'Вы подтвердели авторизацию, вернитесь в приложение и обновитесь в нем';
    }

    res.render('confirm', { title, message });
}

module.exports = { confirmUser };