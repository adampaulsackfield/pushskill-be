const Room = require('../models/room.model');
const Message = require('../models/message.model');

const isValidObjectId = require('../utils/isObjectIdValid');
const isValidToken = require('../utils/isValidToken');

const createMessageAction = async (token, roomId, recipientId, message) => {
	const promise = new Promise(async (resolve, reject) => {
		if (!roomId || !recipientId || !message) {
			return reject({ message: 'missing required fields', room: null });
		}

		const isValidRecipientId = await isValidObjectId(recipientId);
		const isValidRoomId = await isValidObjectId(roomId);

		if (!isValidRecipientId) {
			return reject({
				message: 'recipientId is invalid',
				room: null,
			});
		}

		if (!isValidRoomId) {
			return reject({
				message: 'roomId is invalid',
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

		return resolve({ message: null, newMsg });
	});

	return promise;
};

module.exports = { createMessageAction };
