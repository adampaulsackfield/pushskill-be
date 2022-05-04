const Room = require('../models/room.model');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const isValidObjectId = require('../utils/isObjectIdValid');

const isValidToken = async (token) => {
	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET,
			(err, decoded) => {
				if (err) return err;
				else return decoded;
			}
		);

		const user = await userModel.findById(decoded.id).select('-password');
		return user;
	} catch (err) {
		return err;
	}
};

const getRoomsAction = async (token) => {
	const user = await isValidToken(token);

	if (!user) {
		// TODO - Handle invalid token
		return null;
	} else {
		const rooms = await Room.find({
			// FIXME: potential issues with 'all', if so switch to $or
			$all: [{ creator: user.id }, { member: user.id }],
		});

		// Not sure what happens here if the room isn't valid, can look at callback function for Room.create, promises or another trycatch
		return rooms;
	}
};

const createRoomAction = async (token, recipientId, name) => {
	const isValid = isValidObjectId(recipientId);

	if (!recipientId) {
		return { error: 'missing required fields' };
	}

	if (!isValid) {
		return { error: 'RecipientId is not valid' };
	}

	const user = await isValidToken(token);

	if (!user) {
		// TODO - Handle invalid token

		return 'error token';
	} else {
		const newRoom = {
			name,
			creator: user.id,
			member: recipientId,
		};

		const room = await Room.create(newRoom);

		// Not sure what happens here if the room isn't valid, can look at callback function for Room.create, promises or another trycatch
		return room;
	}
};

module.exports = { getRoomsAction, createRoomAction };
