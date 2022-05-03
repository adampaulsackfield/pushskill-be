const User = require('../models/user.model.js');

const hashPassword = require('../utlis/hashPassword');
const comparePassword = require('../utlis/comparePassword');
const generateToken = require('../utlis/generateToken');

const getUsers = async (req, res) => {
	const users = await User.find();

	res.status(200).send({ users });
};

const registerUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		if (!username || !password) {
			throw new Error('missing required field');
		}

		const userExists = await User.findOne({ username });

		if (userExists) {
			throw new Error('user already exists');
		}

		let newUser = {
			username,
			password: await hashPassword(password),
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
			throw new Error('missing required field');
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

module.exports = { getUsers, registerUser, loginUser };
