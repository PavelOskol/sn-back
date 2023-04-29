const profileRouter = require('express').Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware')

profileRouter.get('/:id', authMiddleware, profileController.getProfile);
profileRouter.put('/change_status', authMiddleware, profileController.changeStatus)

module.exports = profileRouter;