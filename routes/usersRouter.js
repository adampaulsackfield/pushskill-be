const {
	getUsers,
	loginUser,
	registerUser,
} = require('../controllers/user.controller');

const protectedRoute = require('../middleware/authMiddleware');

const usersRouter = require('express').Router();

usersRouter.route('/').get(protectedRoute, getUsers).post(registerUser);

usersRouter.route('/login').post(loginUser);

module.exports = usersRouter;
