// TEMP CONTENT START
let tempToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzJlZGU0ZGNmNWY5YzNkYmE4YjA1NiIsImlhdCI6MTY1MTcxMTMxNiwiZXhwIjoxNjU0MzAzMzE2fQ.ES2fr4ct4K6FWQU-uF_MqIVO3OtvPkDljp0585orH0U';

let tempUserId = '62715868d24936057f726802';
// TEMP CONTENT END

const { Server } = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 9090;
const app = require('./app');
const { getRoomsAction, createRoomAction } = require('./actions/room.actions');

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
	socket.once('join_room', (roomName, token, userId) => {
		createRoomAction(
			tempToken,
			tempUserId, // recipientId
			roomName
		)
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
	socket.on('list_rooms', (token) => {
		getRoomsAction(tempToken)
			.then((res) => {
				console.log('rooms list', res.rooms);
				socket.emit('rooms_list', res.rooms);
			})
			.catch((err) => {
				console.log('rooms list', err.message);
				socket.emit('error_message', err.message); // This needs to be implemented on client
			});
	});
});

// io.on('connection', (socket) => {
// 	console.log('Connected...');
// 	socket.on('join_room', (roomId) => {
// 		// TODO - This is where the room will be added to the ChatModel
// 		// Chat Model
// 		// chatId
// 		// members []
// 		// timestamps
// 		socket.join(roomId);
// 	});

// 	socket.on('chat_message', (data) => {
// 		const { chatId, senderId, recipientId, message, timestamps } = data;
// 		// TODO - This is where the message will be added to the MessageModel
// 		// Message Model
// 		// messageId
// 		// chatId
// 		// senderId
// 		// recipientId
// 		// message
// 		// timestamps
// 		socket.to(chatId).emit('receive_message', data);
// 	});

// 	socket.on('list_rooms', () => {
// 		// TODO - Here is where we will query the DB to get the users existing rooms/chats
// 		const rooms = Array.from(io.sockets.adapter.rooms);

// 		const filtered = rooms.filter((room) => !room[1].has(room[0]));

// 		const res = filtered.map((i) => i[0]);

// 		socket.emit('rooms_list', res);
// 	});

// 	socket.on('disconnecting', () => {
// 		console.log('User disconnecting');
// 		// TODO - If we get the chance we could show a warning that they're disconnecting. Like a loading spinner and attempting to reconnect
// 	});

// 	socket.on('disconnected', () => {
// 		console.log('User disconnected');
// 	});
// });
