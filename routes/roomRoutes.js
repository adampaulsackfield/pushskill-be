const {
	getRooms,
	createRoom,
	getRoom,
	getRoomMessages,
} = require('../controllers/room.controller');
const protectedRoute = require('../middleware/authMiddleware');
const roomRouter = require('express').Router();

roomRouter
	.route('/')
	.get(protectedRoute, getRooms)
	.post(protectedRoute, createRoom);

roomRouter.route('/:room_id').get(protectedRoute, getRoom);

roomRouter.route('/:room_id/messages').get(protectedRoute, getRoomMessages);

module.exports = roomRouter;
