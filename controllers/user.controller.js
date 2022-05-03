const User = require('../models/user.model.js');

exports.getUsers = async (req, res) => {
	const users = await User.find();

	res.status(200).send(users);
};

exports.postUsers = async (req, res) => {
	const user = await User.create(req.body);
	res.status(201).send(user);
};
