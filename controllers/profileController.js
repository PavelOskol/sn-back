const User = require('../userSchema');

class ProfileController {
    async getProfile (req, res) {
        try {
            const id = req.params.id || 1;                   //Получаем id профиля
            const entries = await User.findById(id,{pass_hash: 0});    //запрашиваем профиль
            if (entries) {
                res.status(200).json({
                    success: true,
                    entries});
            }            //возвращаем клиенту
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
    async changeStatus (req, res) {
        try {
            const MY_ID = req.user._id;                             //Получаем свой id из реквеста (его туда положил декодер токена)
            const user = await User.findById(MY_ID, 'status');
            user.status = req.body.status;
            await user.save();
            res.status(200).json({success: true})
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
}

module.exports = new ProfileController();