const Room = require('../models/room.model');
const isValidObjectId = require('../utils/isObjectIdValid');

const getRooms = async (req, res) => {
	const rooms = await Room.find({
		// FIXME: potential issues with 'all', if so switch to $or
		$all: [{ creator: req.user.id }, { member: req.user.id }],
	});

	res.status(200).send({ rooms });
};

const createRoom = async (req, res) => {
	const { member } = req.body;

	const isObjectId = isValidObjectId(member);

	try {
		if (!member) {
			throw new Error('missing required fields');
		}

		if (!isObjectId) {
			throw new Error('MemberId not valid');
		}

		const newRoom = {
			creator: req.user.id,
			member,
		};

		const createRoom = await Room.create(newRoom);

		res.status(201).send({ room: createRoom });
	} catch (error) {
		if (error.message) {
			res.status(400).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

const getRoom = async (req, res) => {
	const { room_id } = req.params;

	const isObjectId = isValidObjectId(room_id);

	try {
		if (!isObjectId) {
			throw new Error('Room id not valid');
		}
		const room = await Room.findById(room_id);

		if (!room) {
			throw new Error('Room not found, you idiot!');
		}
		res.status(200).send({ room });
	} catch (error) {
		if (error.message) {
			res.status(400).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

const getRoomMessages = async (req, res) => {
	const { room_id } = req.params;

	const isObjectId = isValidObjectId(room_id);

	try {
		if (!isObjectId) {
			throw new Error('Room id not valid');
		}
		const room = await Room.findById(room_id).populate('messages');

		if (!room) {
			throw new Error('Room not found, you sausage!');
		}
		res.status(200).send({ messages: room.messages });
	} catch (error) {
		if (error.message) {
			res.status(400).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

module.exports = { getRooms, createRoom, getRoom, getRoomMessages };
