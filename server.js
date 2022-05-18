const { Server } = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 9090;
const app = require('./app');
const { getRoomMessagesAction } = require('./actions/room.actions');
const { createMessageAction } = require('./actions/message.action');

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'https://pushskillfe.netlify.app/',
		methods: ['GET', 'POST'],
	},
});

server.listen(PORT);

// Initial connection from the a client
io.on('connection', (socket) => {
	console.log('Connected to socket.io...');

	socket.on('join_room', ({ room_id }) => {
		console.log('joining room...', room_id);
		socket.join(room_id);

		socket.emit('notification', 'Room Joined');
	});

	socket.on('get_messages', ({ token, roomId }) => {
		getRoomMessagesAction(token, roomId)
			.then((res) => {
				console.log('get_messages: ', res.messages.length);
				console.log('roomId: ', roomId);
				socket.to(roomId).emit('room_messages', res.messages);
			})
			.catch((err) => {
				console.log('get_messages', err.message);
				socket.emit('error_message', err.message);
			});
	});

	socket.on('list_rooms', () => {
		const rooms = Array.from(io.sockets.adapter.rooms);

		const filtered = rooms.filter((room) => !room[1].has(room[0]));

		const res = filtered.map((i) => i[0]);

		console.log('rooms', res);
		socket.emit('rooms_list', res);
	});

	socket.on(
		'chat_message',
		({ senderId, room_id, recipientId, message, token }) => {
			const newMsg = {
				room_id,
				message,
				senderId,
				recipientId,
				createdAt: Date.now(),
			};
			console.log('token', token);

			createMessageAction(token, room_id, recipientId, message)
				.then((res) => {
					console.log(res);
					console.log('socketID: ', socket.id);
					socket.to(room_id).emit('receive_message', newMsg);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	);

	// Typing Events
	socket.on('user_typing_start', ({ room_id }) => {
		console.log('typing event start triggered', room_id);

		socket.to(room_id).emit('user_typing');
	});

	socket.on('user_typing_end', ({ room_id }) => {
		console.log('typing event end triggered', room_id);

		socket.to(room_id).emit('stop_typing');
	});
});
