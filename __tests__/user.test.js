const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/user.model');
const userData = require('../db/data/userData');

// Valid User for Loggin In
// {
// 	username: 'Bcrypt User',
// 	password: 'YECm9jCO8b',
// };

beforeEach((done) => {
	mongoose.connect(process.env.DB_URI, () => {
		const seedDB = async () => {
			await User.deleteMany({});
			await User.insertMany(userData);
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

describe('USER', () => {
	describe('POST /api/users', () => {
		const ENDPOINT = '/api/users';

		it('should return a status of 201 when a user is created', () => {
			const user = {
				username: 'Adam Sackfield',
				password: 'D9Unvtz',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(201)
				.then((res) => {
					expect(res.body.user).toBeInstanceOf(Object);
					expect(res.body.user.username).toEqual('Adam Sackfield');
				});
		});

		it('should return a status of 400 when signing up without a username', () => {
			const user = {
				password: 'D9Unvtz',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(400)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toEqual('missing required fields');
				});
		});

		it('should return a status of 400 when signing up without a password', () => {
			const user = {
				username: 'Adam Sackfield',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(400)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toEqual('missing required fields');
				});
		});

		it('should return a status of 400 when the username is already taken', () => {
			const user = {
				username: 'afaye0',
				password: 'password',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(400)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toEqual('user already exists');
				});
		});
	});

	describe('POST /api/users/login', () => {
		const ENDPOINT = '/api/users/login';

		it('should return a status of 200 when a user is logged in successfully', () => {
			// To enable testing of a logged in user it was required to use bcryptjs to hash a password and add that to the userData, as the last entry
			const user = {
				username: 'Bcrypt User',
				password: 'YECm9jCO8b',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(200)
				.then((res) => {
					expect(res.body.user).toBeInstanceOf(Object);
					expect(res.body.user.username).toEqual('Bcrypt User');
					expect(res.body.user).toMatchObject({
						id: expect.any(String),
						token: expect.any(String),
						username: expect.any(String),
					});
				});
		});

		it('should return a status of 400 when given the wrong password', () => {
			const user = {
				username: 'Bcrypt User',
				password: 'I am wrong',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(400)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toEqual('invalid login credentials');
				});
		});

		it('should return a status of 400 when given the wrong username', () => {
			const user = {
				username: 'I no here',
				password: 'YECm9jCO8b',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(400)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toEqual('invalid login credentials');
				});
		});

		it('should return a status of 400 when logging in without a username', () => {
			const user = {
				password: 'D9Unvtz',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(400)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toEqual('missing required fields');
				});
		});

		it('should return a status of 400 when loggin in without a password', () => {
			const user = {
				username: 'Adam Sackfield',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(400)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toEqual('missing required fields');
				});
		});
	});

	describe('GET /api/users', () => {
		const ENDPOINT = '/api/users';

		it('should return an array of users if presented a valid JWT', async () => {
			const user = {
				username: 'Bcrypt User',
				password: 'YECm9jCO8b',
			};

			// Here we are required to first log in the user so we can send the token on the protected route.
			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(user);
			const userToken = loginResponse.body.user.token;

			return request(app)
				.get(ENDPOINT)
				.set('Authorization', `Bearer ${userToken}`)
				.expect(200)
				.then((res) => {
					expect(res.body.users).toBeInstanceOf(Array);
					expect(res.body.users.length).toBe(101);
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

	describe('PATCH, /api/users/:user_id', () => {
		it('should return a status of 200 when a user is updated when presented with a VALID JWT', async () => {
			const user = {
				username: 'Bcrypt User',
				password: 'YECm9jCO8b',
			};

			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(user);
			const userToken = loginResponse.body.user.token;

			const achievement = {
				name: 'This is an achievement',
				description: 'What you think this is a description',
				url: 'https://google.com',
			};

			return request(app)
				.patch(`/api/users/${loginResponse.body.user.id}`)
				.set('Authorization', `Bearer ${userToken}`)
				.send(achievement)
				.expect(200)
				.then((res) => {
					expect(res.body.user).toBeInstanceOf(Object);
					expect(res.body.user.achievements.length).toBe(1);
				});
		});

		it('should return a status of 400 when not provided the required fields', async () => {
			const user = {
				username: 'Bcrypt User',
				password: 'YECm9jCO8b',
			};

			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(user);
			const userToken = loginResponse.body.user.token;

			const achievement = {
				description: 'What you think this is a description',
				url: 'https://google.com',
			};

			return request(app)
				.patch(`/api/users/${loginResponse.body.user.id}`)
				.set('Authorization', `Bearer ${userToken}`)
				.send(achievement)
				.expect(400)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toBe('missing required fields');
				});
		});

		it('should return a status of 401 when not provided a valid JWT', async () => {
			const user = {
				username: 'Bcrypt User',
				password: 'YECm9jCO8b',
			};

			const loginResponse = await request(app)
				.post(`/api/users/login`)
				.send(user);

			const achievement = {
				description: 'What you think this is a description',
				url: 'https://google.com',
			};

			return request(app)
				.patch(`/api/users/${loginResponse.body.user.id}`)
				.set('Authorization', `No token`)
				.send(achievement)
				.expect(401)
				.then((res) => {
					expect(res.body).toBeInstanceOf(Object);
					expect(res.body.message).toBe('Not authorised. No token');
				});
		});
	});
});
