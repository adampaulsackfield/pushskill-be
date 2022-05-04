const Message = require('../models/message.model');

exports.getMessages = async (req, res) => {
	const messages = await Message.find();

	if (!messages) console.log('No messages found!');

	res.status(200).send({ messages });
};

exports.postMessage = async (req, res) => {
	const { message, recipientId } = req.body;

	try {
		if (!message || !recipientId) {
			throw new Error('missing required fields');
		}

		const newMsg = {
			message,
			senderId: req.user.id,
			recipientId,
		};

		const createMessage = await Message.create(newMsg);

		res.status(201).send({ message: createMessage });
	} catch (error) {
		if (error.message) {
			res.status(400).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};
