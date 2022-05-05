const {
	getUsers,
	getSingleUser,
	loginUser,
	registerUser,
	patchUserAchievements,
} = require('../controllers/user.controller');

const protectedRoute = require('../middleware/authMiddleware');

const userRouter = require('express').Router();

userRouter.route('/').get(protectedRoute, getUsers).post(registerUser);

userRouter.route('/login').post(loginUser);


userRouter.route('/:user_id').get(protectedRoute, getSingleUser);

userRouter
	.route('/:user_id/achievements')
	.patch(protectedRoute, patchUserAchievements);


module.exports = userRouter;
