const friendRouter = require('express').Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middlewares/authMiddleware')

friendRouter.put('/api/friend_request', authMiddleware, friendController.changeFriend);
//friendRouter.delete('/api/friend_request/_id', authMiddleware, friendController.deleteFriend);

module.exports = friendRouter;