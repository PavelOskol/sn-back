const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    authRouter = require('./authRouter');


const PORT = process.env.port || 3001,
    app = express(),
    dbName = 'users';
                                        //express.use - подключение middlware'ов - пред обработчиков запросов
app.use(morgan('dev'));           //логгер получаемых запросов
app.use(express.json());                //парсинг входящих жэйсон тел запросов
app.use('/api/auth', authRouter)


const startServer = async () => {
    try {
        await mongoose.connect('mongodb+srv://backend:KYBQXQJQW07oTpVX@socnet.p7fbqzk.mongodb.net/?retryWrites=true&w=majority', {dbName});
        app.listen(PORT, () => console.log('Server started on port ' + PORT));
    } catch (e) {
        console.log(e.message);
    }


/*    app.route("/api/users").get((req, res) => {
        //console.log(req.query);
        res.send("zdarova get zapros");
    }).post((req, res) => {
        //console.log(req.query);
        res.send("zdarova post zapros");
    }).put((req, res) => {
        //console.log(req.query);
        res.send("zdarova put zapros");
    }).delete((req, res) => {
        //console.log(req.query);
        res.send("zdarova удолятор");
    });*/
};

startServer();