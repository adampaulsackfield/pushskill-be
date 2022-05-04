const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/user.model');
const userData = require('../db/data/userData');
const Room = require('../models/room.model');
const roomData = require('../db/data/roomData');

const validUserAccount = {
	username: 'Bcrypt User',
	password: 'YECm9jCO8b',
};

beforeEach((done) => {
	mongoose.connect(process.env.DB_URI, () => {
		const seedDB = async () => {
			await User.deleteMany({});
			await User.insertMany(userData);
			await Room.deleteMany({});
			await Room.insertMany(roomData);
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

describe('ROOM', () => {
	describe('POST /api/rooms', () => {
		const ENDPOINT = '/api/rooms';

		it('should return a 201 when a room is created with a valid JWT', async () => {
			// Login the user as this is a protected route
			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(validUserAccount);

			const userToken = loginResponse.body.user.token;

			const room = {
				member: '627163a6fc13ae4f3d000668',
				messages: [],
			};

			return request(app)
				.post(ENDPOINT)
				.set('Authorization', `Bearer ${userToken}`)
				.send(room)
				.expect(201)
				.then((res) => {
					expect(res.body.room).toBeInstanceOf(Object);
					expect(res.body.room).toMatchObject({
						creator: expect.any(String),
					});
					expect(res.body.room.member).toEqual(room.member);
					expect(res.body.room.messages.length).toBe(0);
				});
		});

		it('should return a 400 when not given a member ID', async () => {
			// Login the user as this is a protected route
			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(validUserAccount);

			const userToken = loginResponse.body.user.token;

			const room = {
				messages: [],
			};

			return request(app)
				.post(ENDPOINT)
				.set('Authorization', `Bearer ${userToken}`)
				.send(room)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toEqual('missing required fields');
				});
		});

		it('should return a 400 when not given a valid member ID', async () => {
			// Login the user as this is a protected route
			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(validUserAccount);

			const userToken = loginResponse.body.user.token;

			const room = {
				member: '627163a6fc13ae4f3d00066',
				messages: [],
			};

			return request(app)
				.post(ENDPOINT)
				.set('Authorization', `Bearer ${userToken}`)
				.send(room)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toEqual('MemberId not valid');
				});
		});

		it('should return a 401 unauthorised when an invalid JWT is presented', () => {
			const invalidToken =
				'Bearer dyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzE1ODY4ZDI0OTM2MDU3ZjcyNjgwMiIsImlhdCI6MTY1MTU5NjM3NywiZXhwIjoxNjU0MTg4Mzc3fQ.CDLjN7-BIQxvVxKsjPvQg-RlBBAV1NfueYmfrt0wLcA';

			const room = {
				member: '627163a6fc13ae4f3d00066',
				messages: [],
			};

			return request(app)
				.post(ENDPOINT)
				.set('Authorization', invalidToken)
				.send(room)
				.expect(401)
				.then((res) => {
					expect(res.body.message).toEqual('Not authorised');
				});
		});

		it('should return a 401 unauthorised when no JWT is presented ', () => {
			const notToken = 'I am not a token, I am but a string';

			return request(app)
				.get(ENDPOINT)
				.set('Authorization', notToken)
				.expect(401)
				.then((res) => {
					expect(res.body.message).toEqual('Not authorised. No token');
				});
		});
	});

	describe('GET /api/rooms', () => {
		const ENDPOINT = '/api/rooms';

		it('should return an array of users if presented a valid JWT', async () => {
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
					expect(res.body.rooms).toBeInstanceOf(Array);
					expect(res.body.rooms.length).toBe(100);
				});
		});

		it('should return a 401 unauthorised when an invalid JWT is presented', () => {
			const invalidToken =
				'Bearer dyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzE1ODY4ZDI0OTM2MDU3ZjcyNjgwMiIsImlhdCI6MTY1MTU5NjM3NywiZXhwIjoxNjU0MTg4Mzc3fQ.CDLjN7-BIQxvVxKsjPvQg-RlBBAV1NfueYmfrt0wLcA';

			return request(app)
				.get(ENDPOINT)
				.set('Authorization', invalidToken)
				.expect(401)
				.then((res) => {
					expect(res.body.message).toEqual('Not authorised');
				});
		});

		it('should return a 401 unauthorised when no JWT is presented ', () => {
			const notToken = 'I am not a token, I am but a string';

			return request(app)
				.get(ENDPOINT)
				.set('Authorization', notToken)
				.expect(401)
				.then((res) => {
					expect(res.body.message).toEqual('Not authorised. No token');
				});
		});
	});

	describe('GET /api/room/:room_id', () => {
		it('should return a status of 200 when a valid room is found ', async () => {
			// Login the user as this is a protected route
			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(validUserAccount);

			const userToken = loginResponse.body.user.token;

			const room = {
				member: '627163a6fc13ae4f3d000668',
				messages: [],
			};

			const createRoomResponse = await request(app)
				.post('/api/rooms')
				.set('Authorization', `Bearer ${userToken}`)
				.send(room);
			const roomId = createRoomResponse.body.room._id;

			return request(app)
				.get(`/api/rooms/${roomId}`)
				.set('Authorization', `Bearer ${userToken}`)
				.expect(200)
				.then((res) => {
					expect(res.body.room).toBeInstanceOf(Object);
					expect(res.body.room._id).toEqual(roomId);
				});
		});
	});
});
