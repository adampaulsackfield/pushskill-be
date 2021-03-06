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
		default: [],
	},
	isPaired: { type: Boolean, default: false },
	notifications: { type: [Object] },
	roomId: { type: String, default: '' },
	password: { type: String, required: true },
	partnerId: { type: String, default: '' },
	awardableAchievements: {
		type: [Object],
		default: [
			{
				name: 'Supporter',
				description: 'Support description to come...',
				url: '/images/achievements/Supporter.png',
			},
			{
				name: 'Unruly',
				description: 'Support description to come...',
				url: '/images/achievements/Unruly.png',
			},
		],
	},
	isOg: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
