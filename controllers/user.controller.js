const User = require('../models/user.model');
const Room = require('../models/room.model');
const mongoose = require('mongoose');

const hashPassword = require('../utils/hashPassword');
const comparePassword = require('../utils/comparePassword');
const generateToken = require('../utils/generateToken');
const isValidObjectId = require('../utils/isObjectIdValid');

const getUsers = async (req, res) => {
	const users = await User.find();

	res.status(200).send({ users });
};

const registerUser = async (req, res) => {
	const { username, password, traits, learningInterests, avatarUrl } = req.body;

	try {
		if (!username || !password) {
			throw new Error('missing required fields');
		}

		const userExists = await User.findOne({ username });

		if (userExists) {
			throw new Error('user already exists');
		}

		if (traits?.length) {
			traits.forEach((trait) => {
				if (typeof trait !== 'string') {
					throw new Error('traits must be an array strings');
				}
			});
		}

		if (learningInterests?.length) {
			learningInterests.forEach((interest) => {
				if (typeof interest !== 'string') {
					throw new Error('learningInterests must be an array strings');
				}
			});
		}

		let newUser = {
			username,
			password: await hashPassword(password),
			traits,
			learningInterests,
			avatarUrl,
		};

		const user = await User.create(newUser);

		res.status(201).send({ user });
	} catch (error) {
		if (error.message) {
			res.status(400).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

const loginUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		if (!username || !password) {
			throw new Error('missing required fields');
		}

		const user = await User.findOne({ username });

		if (!user) {
			throw new Error('invalid login credentials');
		}

		const passwordMatch = await comparePassword(password, user.password);

		if (!passwordMatch) {
			throw new Error('invalid login credentials');
		}

		let validatedUser = {
			username: user.username,
			id: user.id,
			token: generateToken(user.id),
		};

		res.status(200).send({ user: validatedUser });
	} catch (error) {
		if (error.message) {
			res.status(400).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

const patchUserAchievements = async (req, res) => {
	const { name, description, url } = req.body;
	const { user_id } = req.params;

	try {
		if (!name || !description || !url) {
			throw new Error('missing required fields');
		}

		const isValidObjId = isValidObjectId(user_id);

		if (!isValidObjId) {
			throw new Error('User ID is not valid');
		}

		const achievement = {
			name,
			description,
			url,
		};

		const user = await User.findByIdAndUpdate(
			{ _id: user_id },
			{ $push: { achievements: achievement } },
			{ new: true }
		);

		if (!user) {
			throw new Error("User doesn't exist");
		}

		res.status(200).send({ user });
	} catch (error) {
		if (error.message) {
			res.status(400).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

const getSingleUser = async (req, res) => {
	const { user_id } = req.params;

	try {
		const isValidObjId = isValidObjectId(user_id);

		if (!isValidObjId) {
			throw new Error('User ID is not valid');
		}

		const user = await User.findById(user_id).select('-password');

		if (!user) {
			throw new Error('User not found, you muppet');
		}

		res.status(200).send({ user });
	} catch (error) {
		if (error.message) {
			res.status(404).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

// TODO - This can be turned into a general patch entire profile function
const patchUserTraits = async (req, res) => {
	const { traits } = req.body;

	try {
		if (!traits?.length) {
			throw new Error('at least one trait is required');
		}

		traits.forEach((trait) => {
			if (typeof trait !== 'string') {
				throw new Error('traits must be strings');
			}
		});

		const user = await User.findByIdAndUpdate(
			{ _id: req.user.id },
			{ $push: { traits: traits } },
			{ new: true }
		);

		if (!user) {
			throw new Error("User doesn't exist");
		}

		res.status(200).send({ user });
	} catch (error) {
		if (error.message) {
			res.status(404).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

const generateMatches = async (req, res) => {
	try {
		// Returns all but current user with matching traits
		const users = await User.find({
			_id: { $nin: req.user.id },
			traits: { $in: req.user.traits },
		});

		if (!users) {
			throw new Error('Users not found, something went wrong');
		}

		res.status(200).send({ users });
	} catch (error) {
		if (error.message) {
			res.status(404).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

const sendMatchRequest = async (req, res) => {
	const { user_id } = req.params;

	try {
		if (!user_id) {
			throw new Error('User ID is required');
		}

		const isValidObjId = isValidObjectId(user_id);

		if (!isValidObjId) {
			throw new Error('User ID is not valid');
		}

		if (req.user.isPaired) {
			throw new Error(
				'You already have a pair, please leave this pairing to join another'
			);
		}

		const users = await User.find({
			_id: user_id,
			traits: { $in: req.user.traits },
			isPaired: false,
		});

		if (users.length !== 1) {
			throw new Error(
				"Unable to pair with user, traits don't match or user is already paired"
			);
		}

		const room = await Room.create({
			creator: req.user.id,
			member: user_id,
		});

		if (!room) {
			throw new Error('Something went wrong creating a room');
		}

		await User.updateMany(
			{
				_id: {
					$in: [
						mongoose.Types.ObjectId(req.user.id),
						mongoose.Types.ObjectId(user_id),
					],
				},
			},
			{ $set: { isPaired: true } }
		);

		res.status(201).send({ room });
	} catch (error) {
		if (error.message) {
			res.status(404).send({ message: error.message });
		} else {
			res.status(500).send({ message: 'server error' });
		}
	}
};

module.exports = {
	getUsers,
	registerUser,
	loginUser,
	patchUserAchievements,
	getSingleUser,
	patchUserTraits,
	generateMatches,
	sendMatchRequest,
};
