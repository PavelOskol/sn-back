const profileRouter = require('express').Router();
const profileController = require('../controllers/profileController')

profileRouter.get('/api/profile/:id', profileController.getProfile);

module.exports = profileRouter;