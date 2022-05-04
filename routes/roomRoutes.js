const { getRooms, createRoom } = require('../controllers/room.controller');
const protectedRoute = require('../middleware/authMiddleware');
const roomRouter = require('express').Router();

roomRouter
	.route('/')
	.get(protectedRoute, getRooms)
	.post(protectedRoute, createRoom);

module.exports = roomRouter;
