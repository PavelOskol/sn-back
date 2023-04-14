const jwt = require('jsonwebtoken');            //подрубаем библиотеку для работы с токенами
const {secret} = require("../tokenConfig");      //подрубаем наш секрет создания/верификации токенов

//предпрограмма проверки авторизации/токена, принимает запрос ответ метод вызова следущей предпрограммы
module.exports = function (req, res, next) {
    //не обрабатываем запросы метода опции
    if (req.method === 'OPTIONS') {
        next();
    }
    //все остальные методы проверяем
    try {
        const token = req.headers.authorization.split(' ')[1];          //достаем из заголовка, поле авторизация, второе слово оно же токен
        if (!token) return res.status(403).json({error: "Вы не авторизованы"}); //если токена нет завершаем, отправляем
        const decode = jwt.verify(token, secret);                       //декодируем id из токена - секретом
        console.log(decode);
        req.user = decode;                                              //добавляем к запросу поле юзер {id: iat: exp:}
        next();                                                         //вызываем следующий мидлвэер
    } catch (e) {
        return res.status(403).json({error: "Вы не авторизованы"});
    }
}