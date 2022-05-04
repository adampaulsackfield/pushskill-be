const {
	getMessages,
	postMessage,
} = require('../controllers/message.controller');

const protectedRoute = require('../middleware/authMiddleware');

const messagesRouter = require('express').Router();

messagesRouter
	.route('/')
	.get(protectedRoute, getMessages)
	.post(protectedRoute, postMessage);

module.exports = messagesRouter;
