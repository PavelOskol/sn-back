const {Schema, model} = require('mongoose');
//схема юзера
const User = new Schema({
    login: { type: String, required: true, unique: true },
    pass_hash: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
});
//создаем и экспортируем подель Юзер на основе схемы юзер для коллекции мэйн инфо
module.exports = model('User', User, 'main-info');