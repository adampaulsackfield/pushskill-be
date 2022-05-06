const Room = require('../models/room.model');
const User = require('../models/user.model');

const isValidObjectId = require('../utils/isObjectIdValid');
const isValidToken = require('../utils/isValidToken');

const getRoomsAction = async (token) => {
	const promise = new Promise(async (resolve, reject) => {
		console.log('token:', token);
		const decoded = await isValidToken(token);

		if (!decoded.id) {
			return reject({ message: 'Invalid token', room: null });
		}

		const user = await User.findById(decoded.id).select('-password');

		if (!user) {
			return reject({ message: 'User not found', room: null });
		}

		const rooms = await Room.find({
			// FIXME: potential issues with 'all', if so switch to $or
			$all: [{ creator: user.id }, { member: user.id }],
		});

		return resolve({ message: null, rooms });
	});

	return promise;
};

// Promisified Version
const createRoomAction = async (token, recipientId, name) => {
	const promise = new Promise(async (resolve, reject) => {
		const isValidId = isValidObjectId(recipientId);

		if (!recipientId) {
			return reject({ message: 'missing required fields', room: null });
		}

		if (!isValidId) {
			return reject({ message: 'recipientId is invalid', room: null });
		}

		// isValidToken could probably be refactored
		const decoded = await isValidToken(token);

		if (!decoded.id) {
			return reject({ message: 'Invalid token', room: null });
		}

		const user = await User.findById(decoded.id).select('-password');

		if (!user) {
			return reject({ message: 'User not found', room: null });
		}

		const newRoom = {
			name,
			creator: user._id,
			member: recipientId,
		};

		const room = await Room.create(newRoom);

		return resolve({ message: null, room });
	});

	return promise;
};

const getRoomAction = async (token, roomId) => {
	const promise = new Promise(async (resolve, reject) => {
		if (!roomId) {
			return reject({ message: 'missing required fields', room: null });
		}

		const isValidId = await isValidObjectId(roomId);

		if (!isValidId) {
			return reject({ message: 'recipientId is invalid', room: null });
		}

		// isValidToken could probably be refactored
		const decoded = await isValidToken(token);

		if (!decoded.id) {
			return reject({ message: 'Invalid token', room: null });
		}

		const room = await Room.findById(roomId);

		if (!room) {
			return reject({ message: 'User not found', room: null });
		}

		return resolve({ message: null, room });
	});
	return promise;
};

const getRoomMessagesAction = async (token, roomId) => {
	const promise = new Promise(async (resolve, reject) => {
		if (!roomId) {
			return reject({ message: 'missing required fields', room: null });
		}

		const isValidId = await isValidObjectId(roomId);

		if (!isValidId) {
			return reject({ message: 'recipientId is invalid', room: null });
		}

		// isValidToken could probably be refactored
		const decoded = await isValidToken(token);

		if (!decoded.id) {
			return reject({ message: 'Invalid token', room: null });
		}

		const room = await Room.findById(roomId).populate('messages');

		if (!room) {
			return reject({ message: 'User not found', room: null });
		}

		return resolve({ message: null, messages: room.messages });
	});
	return promise;
};

module.exports = {
	getRoomsAction,
	createRoomAction,
	getRoomAction,
	getRoomMessagesAction,
};
