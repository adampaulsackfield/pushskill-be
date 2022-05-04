const Room = require('../models/room.model');

const getRooms = async (req, res) => {
	const rooms = await Room.find({
		// FIXME: potential issues with 'all', if so switch to $or
		$all: [{ creator: req.user.id }, { member: req.user.id }],
	});

	res.status(200).send({ rooms });
};

const createRoom = async (req, res) => {
	const { member } = req.body;

	try {
		if (!member) {
			throw new Error('missing required fields');
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

	try {
		const room = await Room.findOne({ id: room_id });

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

module.exports = { getRooms, createRoom, getRoom };
