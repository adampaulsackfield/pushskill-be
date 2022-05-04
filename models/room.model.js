const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
	{
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
