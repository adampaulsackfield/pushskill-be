const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
	{
		name: { type: 'string', unique: true },
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
	username: { unique: true, required: true, type: String },
	firstName: { type: String },
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
	password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
