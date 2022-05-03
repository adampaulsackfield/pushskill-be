const mongoose = require('mongoose');
const User = require('../models/user.model');

const messageSchema = mongoose.Schema(
	{
		senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		message: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
