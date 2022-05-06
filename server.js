const { Server } = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 9090;
const app = require('./app');
const {
	getRoomsAction,
	createRoomAction,
	getRoomMessagesAction,
} = require('./actions/room.actions');
const { createMessageAction } = require('./actions/message.action');

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

server.listen(PORT);

// Initial connection from the a client
io.on('connection', (socket) => {
	console.log('Connected to socket.io...');

	// Joining a room
	socket.once('join_room', ({ roomName, token, recipientId }) => {
		createRoomAction(token, recipientId, roomName)
			.then((res) => {
				console.log('room added', res.room);
				socket.join(res.room.id);
			})
			.catch((err) => {
				console.log('room add failed', err.message);
				socket.emit('error_message', err.message); // This needs to be implemented on client
			});
	});

	// Listing Rooms the User is in
	socket.on('list_rooms', ({ token }) => {
		getRoomsAction(token)
			.then((res) => {
				console.log('rooms list', res.rooms);
				socket.emit('rooms_list', res.rooms);
			})
			.catch((err) => {
				console.log('rooms list', err.message);
				socket.emit('error_message', err.message); // This needs to be implemented on client
			});
	});

	// Returning a single Room By ID
	socket.on('room_by_id', ({ token, roomId }) => {
		getRoomAction(token, roomId)
			.then((res) => {
				console.log('room_by_id', res.room);
				socket.emit('current_room', res.room);
			})
			.catch((err) => {
				console.log('room_by_id', err.message);
				socket.emit('error_message', err.message);
			});
	});

	// Returning all messages for a single room
	socket.on('get_message', ({ token, roomId }) => {
		getRoomMessagesAction(token, roomId)
			.then((res) => {
				console.log('get_message', res.messages);
				socket.emit('room_messages', res.messages);
			})
			.catch((err) => {
				console.log('get_message', err.message);
				socket.emit('error_message', err.message);
			});
	});

	// Creating a message
	socket.on('chat_message', ({ token, roomId, recipientId, message }) => {
		createMessageAction(token, roomId, recipientId, message)
			.then((res) => {
				console.log('chat_message', res.newMsg);
				socket.to(roomId).emit('receive_message', res.newMsg);
			})
			.catch((err) => {
				console.log('chat_message', err.message);
				socket.emit('error_message', err.message);
			});
	});
});
