const mongoose = require('mongoose');
const User = require('../models/user.model');

const messageSchema = mongoose.Schema(
	{
		recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		message: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
