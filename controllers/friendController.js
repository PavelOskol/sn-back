const User = require('../userSchema');

class FriendController {
    async addFriend (req, res) {
        try {
            const friend_id = req.params.id || 1;                   //Получаем id профиля
            const friend = await User.findById(friend_id,'friends outgoing_friend_requests incoming_friend_requests');      //запрашиваем профиль друга
            const my_id = req.user.id
            const me = await User.findById(my_id,'friends outgoing_friend_requests incoming_friend_requests');      //запрашиваем профиль друга
            if ( me.incoming_friend_requests.includes(friend_id) ) {
                friend.outgoing_friend_requests = friend.outgoing_friend_requests.filter( id => id != my_id);
                me.incoming_friend_requests = me.incoming_friend_requests.filter( id => id != friend_id) //todo доделать добавление в друзья
                me.friends.push(friend_id)
            }
            console.log(me)
            console.log(friend)
            if (friend && me) {
                res.status(200).json({res:"good"});
            }            //возвращаем клиенту
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
    async deleteFriend (req, res) {
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

module.exports = new FriendController();