const User = require('../userSchema');

class ProfileController {
    async getProfile (req, res) {
        try {
            console.log(req.params.id);
            const id = req.params.id || 1;                   //пагинация, получаем номер страницы
            const entries = await User.findById(id,{pass_hash: 0});    //запрашиваем страницу
            //console.log(users);
            res.status(200).json({entries});             //возвращаем клиенту
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
}

module.exports = new ProfileController();