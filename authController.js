const User = require('./userSchema');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require('./tokenConfig');

const generateLoginToken = (id) => {
    const payload = { id };

    return jwt.sign(payload, secret, {expiresIn: "30s" });
}

class AuthController {
    async registration (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json( {errors: errors.array()} )     //Если навалидировали ошибок, отправить их массив на клиент
            const {login,name,surname,plane_password} = req.body;                              //принять тело post запроса
            //if (!(login && name && surname && plane_password)) throw new Error('Не все поля заполнены')       //кастомный валидатор
            const pass_hash = bcrypt.hashSync(plane_password, 8);      //захешировать пароль в 8 раундах
            let user = new User({                                          //создать модель документа
                login,
                pass_hash,
                name,
                surname
            });
            user = await user.save();                                            //засейвить модель/документ/запись в бд
            res.json(user);                                                      //отчитаться
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
    async login (req, res) {
        try {
            //const errors = validationResult(req);
            //if (!errors.isEmpty()) return res.status(400).json( {errors: errors.array()} )     //Если навалидировали ошибок, отправить их массив на клиент
            const {login,plane_password} = req.body;                              //принять тело post запроса
            const user = await User.findOne({login});
            if (user && bcrypt.compareSync(plane_password, user.pass_hash)) {       //Если есть такой логин, проверяем его пароль
                const token = generateLoginToken(user._id);
                res.json({token});
            } else return res.status(400).json({error:"Неверный пользователь либо пароль"})

        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
    async getUsers (req, res) {
        try {
            res.send("There's the users")
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
}

module.exports = new AuthController();