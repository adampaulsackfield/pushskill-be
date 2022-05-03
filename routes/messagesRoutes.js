const {
	getMessages,
	postMessage,
} = require('../controllers/message.controller');

const messagesRouter = require('express').Router();

messagesRouter.get('/', getMessages);
messagesRouter.post('/', postMessage);

module.exports = messagesRouter;
