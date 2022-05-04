const {
	getUsers,
	loginUser,
	registerUser,
	patchUserAchievements,
} = require('../controllers/user.controller');

const protectedRoute = require('../middleware/authMiddleware');

const userRouter = require('express').Router();

userRouter.route('/').get(protectedRoute, getUsers).post(registerUser);

userRouter.route('/login').post(loginUser);

userRouter.route('/:user_id').patch(protectedRoute, patchUserAchievements);

module.exports = userRouter;
