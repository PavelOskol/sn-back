const profileRouter = require('express').Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware')

profileRouter.get('/api/profile/:id', authMiddleware, profileController.getProfile);

module.exports = profileRouter;