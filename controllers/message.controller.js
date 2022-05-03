const Message = require('../models/message.model');

exports.getMessages = async (req, res) => {
	const messages = await Message.find();

	if (!messages) console.log('No messages found!');

	res.status(200).send(messages);
};

exports.postMessage = async (req, res) => {
	// const { message } = req.body;
	const createMessage = await Message.create(req.body);

	res.status(200).send(createMessage);
};
