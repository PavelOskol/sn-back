const friendRouter = require('express').Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middlewares/authMiddleware')

friendRouter.get('/api/friend_request/:id', authMiddleware, friendController.addFriend);
friendRouter.delete('/api/friend_request/:id', authMiddleware, friendController.deleteFriend);

module.exports = friendRouter;