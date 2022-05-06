const Room = require('../models/room.model');

const isValidObjectId = require('../utils/isObjectIdValid');
const isValidToken = require('../utils/isValidToken');

const createMessageAction = async (token, roomId, recipientId, message) => {
	const promise = new Promise(async (resolve, reject) => {
		console.log('token:', token);
		console.log('roomId:', roomId);
		console.log('recipientId:', recipientId);
		console.log('message:', message);

		if (!roomId || !recipientId || !message) {
			return reject({ message: 'missing required fields', room: null });
		}

		const isValidRecipientId = await isValidObjectId(recipientId);
		const isValidRoomId = await isValidObjectId(roomId);

		if (!isValidRecipientId || isValidRoomId) {
			return reject({
				message: 'recipientId or roomId is invalid',
				room: null,
			});
		}

		// isValidToken could probably be refactored
		const decoded = await isValidToken(token);

		if (!decoded.id) {
			return reject({ message: 'Invalid token', room: null });
		}

		const newMsg = {
			room_id: roomId,
			message,
			senderId: decoded.id,
			recipientId,
		};

		const createMessage = await Message.create(newMsg);

		await Room.findByIdAndUpdate(
			{ _id: roomId },
			{ $push: { messages: createMessage.id } },
			{ new: true }
		);

		return resolve({ message: null, createMessage });
	});
	return promise;
};

module.exports = { createMessageAction };
