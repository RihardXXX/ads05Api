

const confirmUser = (req, res) => {
    res.send(req.params.idConfirm);
    // находим юзера
    // меняем ему статус на подтвержден
    // возвращаем html шаблон
    // в шаблоне сообщаем что статус подтвержден
    // создаем ссылку для нашего фронтенд приложения
}

module.exports = { confirmUser };