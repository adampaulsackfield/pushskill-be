const { getUsers, postUsers } = require('../controllers/user.controller');
const usersRouter = require('express').Router();

// GET
usersRouter.get('/users', getUsers);

//Post user
usersRouter.post('/users', postUsers)
module.exports = usersRouter;
