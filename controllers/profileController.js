const User = require('../userSchema');

class ProfileController {
    async getProfile (req, res) {
        try {
            const id = req.params.id || 1;                   //Получаем id профиля
            const entries = await User.findById(id,{pass_hash: 0});    //запрашиваем профиль
            if (entries) {
                res.status(200).json({entries});
            }            //возвращаем клиенту
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
}

module.exports = new ProfileController();