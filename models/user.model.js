const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
	{
		name: { type: 'string' },
		url: {
			type: 'string',
			default:
				'https://i.picsum.photos/id/17/200/200.jpg?hmac=9QDzoqdXorZialFww894D6BqJGalCXFLX2zNQtYENEA',
		},
		description: 'string',
	},
	{ timestamps: true }
);

const userSchema = mongoose.Schema({
	username: {
		unique: true,
		required: true,
		type: String,
		default: `User${Math.floor(Math.random() * 10000)}`,
	},
	firstName: {
		type: String,
		default: `NoName${Math.floor(Math.random() * 10000)}`,
	},
	lastName: { type: String },
	avatarUrl: {
		type: String,
		default:
			'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png',
	},
	goal: { type: String },
	traits: { default: [], type: [String] },
	learningInterests: { type: [String], default: [] },
	achievements: {
		type: [achievementSchema],
		default: [
			{ name: 'OG', url: '', description: 'You signed up to .push(skill)' },
		],
	},
	isPaired: { type: Boolean, default: false },
	notifications: { type: [Object] },
	roomId: { type: String, default: '' },
	password: { type: String, required: true },
	partnerId: { type: String, default: '' },
});

module.exports = mongoose.model('User', userSchema);
