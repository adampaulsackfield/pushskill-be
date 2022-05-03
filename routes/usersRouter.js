const {
	getUsers,
	postUser,
	loginUser,
} = require('../controllers/user.controller');
const protectedRoute = require('../middleware/authMiddleware');
const usersRouter = require('express').Router();

// GET
usersRouter.get('/', protectedRoute, getUsers);

//Register user
usersRouter.post('/', postUser);

//Login user
usersRouter.post('/login', loginUser);

module.exports = usersRouter;
