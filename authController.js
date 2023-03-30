const User = require('./userSchema');                   //подключаем кастомную модель/шаблон данных для коллекции/табилцы
const bcrypt = require('bcrypt');                       //подрубаем модуль шифрования/дешифрования паролей
const {validationResult} = require('express-validator');//подрубаем модуль результатов валидации
const jwt = require('jsonwebtoken');                    //модуль джейсон веб токенов
const {secret} = require('./tokenConfig');              //подрубаем кастомный модуль секрета, для создания-верификации токенов

const generateLoginToken = (id) => {                    //генерируем токен, зашивая в него id пользователя
    const payload = { id };

    return jwt.sign(payload, secret, {expiresIn: "30s" });
}

class AuthController {
    //метод осуществляющий регистрацию
    async registration (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json( {errors: errors.array()} )     //Если предыдущие мидлвэеры навалидировали ошибок, отправить массив ошибок на клиент
            const {login,name,surname,plane_password,ava,selfDescription,location,followed} = req.body;                              //принять тело post запроса
            //if (!(login && name && surname && plane_password)) throw new Error('Не все поля заполнены')       //кастомный валидатор
            const pass_hash = bcrypt.hashSync(plane_password, 8);      //захешировать пароль в 8 раундах
            let user = new User({                                          //создать документ/модель поместив в него то что пришло в запросе
                login,
                pass_hash,
                name,
                surname,
                ava,
                selfDescription,
                location,
                followed
            });
            user = await user.save();                                            //засейвить модель/документ/запись в бд
            res.json(user);                                                      //отчитаться на клиент
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
    //метод авторизации
    async login (req, res) {
        try {
            //const errors = validationResult(req);
            //if (!errors.isEmpty()) return res.status(400).json( {errors: errors.array()} )     //Если навалидировали ошибок, отправить их массив на клиент
            const {login,plane_password} = req.body;                              //принять тело post запроса
            const user = await User.findOne({login});                               //ищем юзера в бд по логину
            if (user && bcrypt.compareSync(plane_password, user.pass_hash)) {       //Если есть такой логин и его пароль совпадает с хэшем в бд
                const token = generateLoginToken(user._id);                         //Создаем токен и отправляем ему
                res.json({token});
            } else return res.status(400).json({error:"Неверный пользователь либо пароль"});

        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
    async getUsers (req, res) {
        try {
            const users = await User.find();
            //console.log(users);
            res.status(200).json(users);
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
}

module.exports = new AuthController();