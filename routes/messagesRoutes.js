const {
	getMessages,
	postMessage,
} = require('../controllers/message.controller');

const messagesRouter = require('express').Router();

messagesRouter.get('/messages', getMessages);
messagesRouter.post('/messages', postMessage);

module.exports = messagesRouter;
