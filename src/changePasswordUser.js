const jsStringify = require('js-stringify');

const changePasswordUser = async (req, res) => {

    const { email, path } = req.query;

    console.log(email);
    console.log(path);

    const data = { email, path };

    res.render('formChangePassword', { jsStringify , data});
}

module.exports = { changePasswordUser };