const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: 'Unnamed',
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		member: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
				default: [],
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
