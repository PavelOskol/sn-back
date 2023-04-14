const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    authRouter = require('./routes/authRouter'),
    profileRouter = require('./routes/profileRouter'),
    friendRouter = require('./routes/friendRouter');
    //cors = require('cors');           //подключение - отключения корс


const PORT = process.env.port || 3001,
    app = express(),
    dbName = 'users';
                                        //express.use - подключение middlware'ов - пред обработчиков запросов
app.use(morgan('dev'));           //логгер получаемых запросов
app.use(express.json());                //парсинг входящих жэйсон тел запросов
//app.use(express.urlencoded());
app.use('/api/auth', authRouter);        //вешаем роутер авторизации на прослушку апи авторизации
app.use('/', profileRouter);
app.use('/',friendRouter);
//app.use(cors());


const startServer = async () => {
    try {
        await mongoose.connect('mongodb+srv://backend:KYBQXQJQW07oTpVX@socnet.p7fbqzk.mongodb.net/?retryWrites=true&w=majority', {dbName});     //подрубаемся к бд при помощи мангус
        app.listen(PORT, () => console.log('Server started on port ' + PORT));              //запускаем лисенер портов
    } catch (e) {
        console.log(e.message);
    }
};

startServer();       //стартуем сервак
