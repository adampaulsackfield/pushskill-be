const {
	getRooms,
	createRoom,
	getRoom,
} = require('../controllers/room.controller');
const protectedRoute = require('../middleware/authMiddleware');
const roomRouter = require('express').Router();

roomRouter
	.route('/')
	.get(protectedRoute, getRooms)
	.post(protectedRoute, createRoom);

roomRouter.route('/:room_id').get(protectedRoute, getRoom);

module.exports = roomRouter;
