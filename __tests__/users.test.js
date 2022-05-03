const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const testData = require('../db/data/test-data.json');

beforeEach((done) => {
	mongoose.connect(process.env.DB_URI, () => {
		const seedDB = async () => {
			await User.deleteMany({});
			await User.insertMany(testData);
		};
		seedDB()
			.then(() => {
				done();
			})
			.catch((err) => {
				console.log('err:', err);
			});
	});
});

afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => {
			return done();
		});
	});
});
