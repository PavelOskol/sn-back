const friendRouter = require('express').Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middlewares/authMiddleware')

friendRouter.put('/friend_request', authMiddleware, friendController.changeFriend);
friendRouter.get('/friends',authMiddleware,friendController.getFriends);
//friendRouter.delete('/api/friend_request/_id', authMiddleware, friendController.deleteFriend);

module.exports = friendRouter;