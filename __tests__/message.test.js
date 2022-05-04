const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/user.model');
const userData = require('../db/data/userData');

const messageData = require('../db/data/messageData');
const Message = require('../models/message.model');

const validUserAccount = {
	username: 'Bcrypt User',
	password: 'YECm9jCO8b',
};

beforeEach((done) => {
	mongoose.connect(process.env.DB_URI, () => {
		const seedDB = async () => {
			await User.deleteMany({});
			await User.insertMany(userData);
			await Message.deleteMany({});
			await Message.insertMany(messageData);
		};

		seedDB().then(() => {
			done();
		});
	});
});

afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done());
	});
});

describe('MESSAGE', () => {
	describe('POST /api/messages', () => {
		const ENDPOINT = '/api/messages';

		it('should return a status of 201 when a message is created', async () => {
			// Login the user as this is a protected route
			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(validUserAccount);

			const userToken = loginResponse.body.user.token;

			const message = {
				senderId: '627163a6fc13ae4f3d000668',
				recipientId: '627163a6fc13ae4f3d000668',
				message: 'This is a test message',
			};

			return request(app)
				.post(ENDPOINT)
				.set('Authorization', `Bearer ${userToken}`)
				.send(message)
				.expect(201)
				.then((res) => {
					expect(res.body.message).toBeInstanceOf(Object);
					expect(res.body.message.message).toEqual('This is a test message');
					expect(res.body.message.recipientId).toEqual(message.recipientId);
					expect(res.body.message).toMatchObject({
						message: expect.any(String),
						senderId: expect.any(String),
						recipientId: expect.any(String),
					});
				});
		});

		it('should return a status of 401 when the user is not authorised', () => {
			const message = {
				senderId: '627163a6fc13ae4f3d000668',
				recipientId: '627163a6fc13ae4f3d000668',
				message: 'This is a test message',
			};

			return request(app)
				.post(ENDPOINT)
				.set('Authorization', `Bearer Not Valid`)
				.send(message)
				.expect(401)
				.then((res) => {
					expect(res.body.message).toEqual('Not authorised');
				});
		});

		it('should return a status of 400 when not given all the required fields', async () => {
			// Login the user as this is a protected route
			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(validUserAccount);

			const userToken = loginResponse.body.user.token;

			const message = {
				senderId: '627163a6fc13ae4f3d000668',
				recipientId: '627163a6fc13ae4f3d000668',
			};

			return request(app)
				.post(ENDPOINT)
				.set('Authorization', `Bearer ${userToken}`)
				.send(message)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toEqual('missing required fields');
				});
		});
	});

	describe('GET /api/messages', () => {
		const ENDPOINT = '/api/messages';

		it('should return a status of 200 and an array of all messages', async () => {
			// Login the user as this is a protected route
			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(validUserAccount);

			const userToken = loginResponse.body.user.token;

			return request(app)
				.get(ENDPOINT)
				.set('Authorization', `Bearer ${userToken}`)
				.expect(200)
				.then((res) => {
					expect(res.body.messages).toBeInstanceOf(Array);
					expect(res.body.messages.length).toBe(100);
				});
		});

		it('should return a status of 401 when the user is not authorised', () => {
			const token = 'I am not a token';

			return request(app)
				.get(ENDPOINT)
				.set('Authorization', token)
				.expect(401)
				.then((res) => {
					expect(res.body.message).toEqual('Not authorised. No token');
				});
		});
	});
});
