const {
	getMessages,
	postMessage,
} = require('../controllers/message.controller');
const protectedRoute = require('../middleware/authMiddleware');

const messagesRouter = require('express').Router();

messagesRouter.get('/', getMessages);
messagesRouter.post('/', protectedRoute, postMessage);

module.exports = messagesRouter;
