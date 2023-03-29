const authRouter = require('express').Router();         //Создать экземпляр роутера || new Router();
const controller = require('./authController');          //Создать экземпляр контроллера
const {check} = require('express-validator');
const authMiddleware = require('./authMiddleware')

const validators = [
    check('login', 'Пустой логин').notEmpty(),                               //валидация
    check('plane_password', 'Длина не та').isLength({min: 6}),
];

authRouter.post('/registration', [
        ...validators,
        check('name', 'Пустое имя').notEmpty(),
        check('surname', 'Пустой сёрнэйм').notEmpty()
    ],
    controller.registration);
authRouter.post('/login', validators ,controller.login);
authRouter.get('/users', authMiddleware, controller.getUsers);


module.exports = authRouter;