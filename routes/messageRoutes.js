const {
	getMessages,
	createMessage,
} = require('../controllers/message.controller');

const protectedRoute = require('../middleware/authMiddleware');

const messageRouter = require('express').Router();

messageRouter
	.route('/')
	.get(protectedRoute, getMessages)
	.post(protectedRoute, createMessage);

module.exports = messageRouter;
