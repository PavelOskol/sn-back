const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    authRouter = require('./routes/authRouter'),
    profileRouter = require('./routes/profileRouter'),
    friendRouter = require('./routes/friendRouter');
    //cors = require('cors');           //подключение - отключения корс


const PORT = process.env.port || 3001,
    app = express(),
    dbName = 'users',
    API = '/api';

                                        //express.use - подключение middlware'ов - пред обработчиков запросов
app.use(morgan('dev'));           //логгер получаемых запросов
app.use(express.json());                //парсинг входящих жэйсон тел запросов
//app.use(express.urlencoded());
app.use(API + '/auth', authRouter);        //вешаем роутер авторизации на прослушку апи авторизации
app.use(API + '/profile', profileRouter);
app.use(API + '/',friendRouter);
//app.use(cors());


const startServer = async () => {
    try {
        await mongoose.connect('mongodb+srv://backend:KYBQXQJQW07oTpVX@socnet.p7fbqzk.mongodb.net/?retryWrites=true&w=majority', {dbName});     //подрубаемся к бд при помощи мангус
        app.listen(PORT, () => console.log('Back started on port ' + PORT));              //запускаем лисенер портов
    } catch (e) {
        console.log(e.message);
    }
};

startServer();       //стартуем сервак


//Сервер фронтэнда, с проксированием на бэк энд
const path = require('path');
const front = express();
const proxy = require('express-http-proxy');

//Проксируем запросы /api на бэкэнд
front.use('/api/', proxy('http://localhost:3001/api/'));
//На остальные запросы отвечаем нашим SPA из билд
front.use(express.static(path.join(__dirname, 'build')));
front.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

front.listen(3000, () => console.log('Front started on port 3000'));