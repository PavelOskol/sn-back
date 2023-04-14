const User = require('../userSchema');

class FriendController {
    async changeFriend(req, res) {
        try {
            const FRIEND_ID = req.body.friend_id;                   //Получаем id профиля друга из тела
            const MY_ID = req.user._id;                             //Получаем свой id из реквеста (его туда положил декодер токена)

            if ( !(MY_ID && FRIEND_ID)) throw new Error('Не пришли ваш id или id друга')            //Проверяем получили ли id шники

            const friend = await User.findById(FRIEND_ID, 'friends outgoing_friend_requests incoming_friend_requests');     //запрашиваем друзей друга
            const me = await User.findById(MY_ID, 'friends outgoing_friend_requests incoming_friend_requests');             //запрашиваем моих друзей


            //обрабатываем запрос на добавление друга
            if (req.body.addFriend) {
                //валидаторы на случай повторного запроса
                if (me.friends.includes(FRIEND_ID)) throw new Error('Он уже твой друг');
                if (me.outgoing_friend_requests.includes(FRIEND_ID) ) throw new Error('Ты уже отправлял ему запрос на дружбу');

                //если от "друга" был запрос на дружбу
                if (me.incoming_friend_requests.includes(FRIEND_ID)) {
                    friend.outgoing_friend_requests = friend.outgoing_friend_requests.filter(id => id !== MY_ID);
                    me.incoming_friend_requests = me.incoming_friend_requests.filter(id => id !== FRIEND_ID);
                    me.friends.push(FRIEND_ID);
                    friend.friends.push(MY_ID);

                    await me.save();
                    await friend.save();

                    res.status(200).json({res: "добавил в друзья"});
                } else {
                    //если от "друга" не было запроса на дружбу
                    me.outgoing_friend_requests.push(FRIEND_ID);
                    friend.incoming_friend_requests.push(MY_ID);

                    await me.save();
                    await friend.save();

                    res.status(200).json({res: "отправил запрос на дружбу"});
                }


            }


            //обрабатываем запрос на удаление друга
            if (req.body.deleteFriend) {
                //валидаторы на случай попытки удаления - уже не друга
                if ( !me.friends.includes(FRIEND_ID) && !me.outgoing_friend_requests.includes(FRIEND_ID) ) throw new Error('Уже не в друзьях, и даже не запрос на дружбу');

                //если друг в друзьях
                if ( me.friends.includes(FRIEND_ID) ) {
                    me.friends = me.friends.filter( id => id !== FRIEND_ID);
                    friend.friends = friend.friends.filter( id => id !== MY_ID);
                    me.incoming_friend_requests.push(FRIEND_ID);
                    friend.outgoing_friend_requests.push(MY_ID);

                    await me.save();
                    await friend.save();

                    res.status(200).json({res: "удалил из друзей"});
                }
                //если другу еще не принял запрос
                if (me.outgoing_friend_requests.includes(FRIEND_ID) ) {
                    me.outgoing_friend_requests = me.outgoing_friend_requests.filter( id => id !== FRIEND_ID);
                    friend.incoming_friend_requests = friend.incoming_friend_requests.filter( id => id !== MY_ID);

                    await me.save();
                    await friend.save();

                    res.status(200).json({res: "отменил заявку на дружбу"});
                }
            }
        } catch (e) {
            console.log(e.message);
            res.send(e.message);
        }
    }
}

module.exports = new FriendController();