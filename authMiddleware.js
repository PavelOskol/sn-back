const jwt = require('jsonwebtoken');
const {secret} = require("./tokenConfig");

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(403).json({error: "Вы не авторизованы"});
        const decode = jwt.verify(token, secret);
        console.log(decode);
        req.user = decode;
        next();
    } catch (e) {
        return res.status(403).json({error: "Вы не авторизованы"});
    }
}