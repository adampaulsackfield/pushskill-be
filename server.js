const { Server } = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 9090;
const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

server.listen(PORT);

io.on('connection', (socket) => {
	console.log('Connected...');
	socket.on('join_room', (roomId) => {
		// TODO - This is where the room will be added to the ChatModel
		// Chat Model
		// chatId
		// members []
		// timestamps
		socket.join(roomId);
	});

	socket.on('chat_message', (data) => {
		const { chatId, senderId, recipientId, message, timestamps } = data;
		// TODO - This is where the message will be added to the MessageModel
		// Message Model
		// messageId
		// chatId
		// senderId
		// recipientId
		// message
		// timestamps
		socket.to(chatId).emit('receive_message', data);
	});

	socket.on('list_rooms', () => {
		// TODO - Here is where we will query the DB to get the users existing rooms/chats
		const rooms = Array.from(io.sockets.adapter.rooms);

		const filtered = rooms.filter((room) => !room[1].has(room[0]));

		const res = filtered.map((i) => i[0]);

		socket.emit('rooms_list', res);
	});

	socket.on('disconnecting', () => {
		console.log('User disconnecting');
		// TODO - If we get the chance we could show a warning that they're disconnecting. Like a loading spinner and attempting to reconnect
	});

	socket.on('disconnected', () => {
		console.log('User disconnected');
	});
});
