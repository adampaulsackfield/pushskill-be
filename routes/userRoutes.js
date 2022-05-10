const {
	getUsers,
	getSingleUser,
	loginUser,
	registerUser,
	patchUserAchievements,
	patchUserTraits,
	generateMatches,
	sendMatchRequest,
	acceptMatch,
} = require('../controllers/user.controller');

const protectedRoute = require('../middleware/authMiddleware');

const userRouter = require('express').Router();

userRouter.route('/').get(protectedRoute, getUsers).post(registerUser);

userRouter.route('/login').post(loginUser);
userRouter.route('/matches').get(protectedRoute, generateMatches);
userRouter
	.route('/matches/:user_id')
	.get(protectedRoute, acceptMatch)
	.post(protectedRoute, sendMatchRequest);

userRouter.route('/:user_id').get(protectedRoute, getSingleUser);

userRouter
	.route('/:user_id/achievements')
	.patch(protectedRoute, patchUserAchievements);

userRouter.route('/:user_id/traits').patch(protectedRoute, patchUserTraits);

module.exports = userRouter;
