const {Schema, model} = require('mongoose');
//схема юзера
const ava = new Schema({
   smallAva: {type: String },
   largeAva: {type: String }
});
const location = new Schema({
    countryName: {type: String},
    cityName: {type: String}
})

const User = new Schema({
    login: { type: String, required: true, unique: true },
    pass_hash: {type: String, required: true},
    name: {type: String, },
    surname: {type: String, },
    ava: {type: ava},
    selfDescription: {type: String},
    location: {type: location},
    followed: {type: Boolean},
});
//создаем и экспортируем подель Юзер на основе схемы юзер для коллекции мэйн инфо
module.exports = model('User', User, 'main-info');