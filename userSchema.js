const {Schema, model} = require('mongoose');

const User = new Schema({
    login: { type: String, required: true, unique: true },
    pass_hash: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
});

module.exports = model('User', User, 'main-info');