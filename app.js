const ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `${__dirname}/.env.${ENV}` });

const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const usersRouter = require('./routes/usersRouter');
const connectDB = require('./db/connection');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// GET
app.use('/api', usersRouter);
app.get('/api/hc', (req, res) => res.status(200).send('HELLO'));

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket) => {
	socket.on('join_room', (chatId) => {
		//? TODO - This is where the room will be added to the ChatModel
		//? TODO - chatId will become unique using UUID - generate here
		// Chat Model
		// chatId
		// members []
		// timestamps
		socket.join(roomName);
	});

	socket.on('chat_message', (data) => {
		const { chatId, senderId, recipientId, message, timestamps } = data;
		//? TODO - This is where the message will be added to the MessageModel
		//? TODO - roomName will become unique using UUID - generate here
		// Message Model
		// chatId
		// senderId
		// recipientId
		// message
		// timestamps
		socket.to(chatId).emit('receive_message', data);
	});

	socket.on('list_rooms', () => {
		//? TODO - Here is where we will query the DB to get the users existing rooms/chats
		const rooms = Array.from(io.sockets.adapter.rooms);

		const filtered = rooms.filter((room) => !room[1].has(room[0]));

		const res = filtered.map((i) => i[0]);

		socket.emit('rooms_list', res);
	});

	socket.on('disconnecting', () => {
		console.log('User disconnecting');
		//? TODO - If we get the chance we could show a warning that they're disconnecting. Like a loading spinner and attempting to reconnect
	});

	socket.on('disconnected', () => {
		console.log('User disconnected');
	});
});

module.exports = app;
