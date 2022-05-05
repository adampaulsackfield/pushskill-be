const Message = require('../models/message.model');
const Room = require('../models/room.model');

const getMessages = async (req, res) => {
	const messages = await Message.find();

	if (!messages) console.log('No messages found!');

	res.status(200).send({ messages });
};

const createMessage = async (req, res) => {
	const { message, recipientId, room_id } = req.body;

	try {
		if (!message || !recipientId || !room_id) {
			throw new Error('missing required fields');
		}

		const newMsg = {
			room_id,
			message,
			senderId: req.user.id,
			recipientId,
		};

		const createMessage = await Message.create(newMsg);
		await Room.findByIdAndUpdate(
			{ _id: room_id },
			{ $push: { messages: createMessage.id } },
			{ new: true }
		);

		res.status(201).send({ message: createMessage });
	} catch (error) {
		if (error.message) {
			res.status(400).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

module.exports = { getMessages, createMessage };
