const ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `${__dirname}/.env.${ENV}` });

const express = require('express');
const cors = require('cors');

const connectDB = require('./db/connection');

const userRouter = require('./routes/userRoutes');
const messagesRouter = require('./routes/messageRoutes');
const roomRouter = require('./routes/roomRoutes');

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/messages', messagesRouter);

app.use('/api/users', userRouter);

app.use('/api/rooms', roomRouter);

app.get('/api/hc', (req, res) => res.status(200).send('API is running'));

app.use((err, req, res, next) => {
	if (err.status && err.message) {
		res.status(err.status).send({ message: err.message });
	} else {
		next(err);
	}
});

module.exports = app;
