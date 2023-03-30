const authRouter = require('express').Router();         //Создать экземпляр роутера || new Router(); для прослушки урлов
const controller = require('./authController');          //Создать экземпляр контроллера из DAL, для обработки запросов
const {check} = require('express-validator');            //метод валидации полей body входящих запросов
const authMiddleware = require('./authMiddleware')       //кастомный валидатор напроверку авторизованности по токену

const validators = [
    check('login', 'Пустой логин').notEmpty(),                               //массив валидаторов
    check('plane_password', 'Длина не та').isLength({min: 6}),
];

//слушаем урл, валидируем массивом валидаторов, и вызываем контроллер
authRouter.post('/registration', [
        ...validators,
        check('name', 'Пустое имя').notEmpty(),
        check('surname', 'Пустой сёрнэйм').notEmpty()
    ],
    controller.registration);
//слушаем урл, валидируем, и вызываем контроллер
authRouter.post('/login', validators ,controller.login);
//слушаем урл, валидируем на авторизованность, и вызываем контроллер
authRouter.get('/users', authMiddleware, controller.getUsers);


module.exports = authRouter;