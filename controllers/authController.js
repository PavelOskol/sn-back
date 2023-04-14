const User = require('../userSchema');                   //подключаем кастомную модель/шаблон данных для коллекции/табилцы
const bcrypt = require('bcrypt');                       //подрубаем модуль шифрования/дешифрования паролей
const {validationResult} = require('express-validator');//подрубаем модуль результатов валидации
const jwt = require('jsonwebtoken');                    //модуль джейсон веб токенов
const {secret} = require('../tokenConfig');              //подрубаем кастомный модуль секрета, для создания-верификации токенов

const generateLoginToken = (id) => {                    //генерируем токен, зашивая в него id пользователя
    const payload = { id };

    return jwt.sign(payload, secret, {expiresIn: "30m" });
}

class AuthController {
    //метод осуществляющий регистрацию
    async registration (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {                 //Если предыдущие мидлвэеры навалидировали ошибок, отправить массив ошибок на клиент
                return res.status(400).json( {errors: errors.array()} )
            }

            const {login,name,surname,plane_password,ava,selfDescription,location} = req.body;                              //принять тело post запроса
            const clone = await User.findOne({login});                                   //Проверяем есть ли уже такой юзер в бд
            if (clone)  {
                return res.status(400).json({error: "Такой пользователь уже зарегестрирован!"})
            }
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
                friends: [],
                outgoing_friend_requests: [],
                incoming_friend_requests: [],
            });
            user = await user.save();                                            //засейвить модель/документ/запись в бд
            console.log(user);
            const token = generateLoginToken(user._id);
            res.json({
                _id: user._id,
                token,
                success: true,
            });                                                      //отчитаться на клиент
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    };
    async deleteAccount (req, res) {

    };
    //метод авторизации
    async login (req, res) {
        try {
            //const errors = validationResult(req);
            //if (!errors.isEmpty()) return res.status(400).json( {errors: errors.array()} )     //Если навалидировали ошибок, отправить их массив на клиент
            //console.log(req.body)
            const {login,plane_password} = req.body;                              //принять тело post запроса
            const user = await User.findOne({login});                               //ищем юзера в бд по логину
            if (user && bcrypt.compareSync(plane_password, user.pass_hash)) {       //Если есть такой логин и его пароль совпадает с хэшем в бд
                const token = generateLoginToken(user._id);                         //Создаем токен и отправляем ему
                res.json({
                    token,
                    _id: user._id,
                    success: true,
                });
            } else return res.status(401).json({error:"Неверный пользователь либо пароль"});

        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    };
    async logout (req, res) {

    };
    async getUsers (req, res) {
        try {
            const page = req.query.page || 1;                   //пагинация, получаем номер страницы
            const size = req.query.size || 5;                   // получаем размер страницы
            const count = await User.find().count()             //запрашиваем к-во юзеров из бд
            const entries = await User.find().skip((page - 1)*size).limit(size);    //запрашиваем страницу
            //console.log(users);
            res.status(200).json({entries, count});             //возвращаем клиенту
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    };
}

module.exports = new AuthController();