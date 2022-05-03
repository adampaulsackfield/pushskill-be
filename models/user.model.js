const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: { unique: true, required: true, type: 'string' },
	firstName: { required: true, type: 'string' },
	lastName: { required: true, type: 'string' },
	avatarUrl: { required: false, type: 'string' },
	goal: { type: 'string' },
	traits: { required: true, type: ['string'] },
	learningInterests: { required: true, type: ['string'] },
	achievements: { type: ['string'], default: ['OG'] },
});

module.exports = mongoose.model('User', userSchema);
