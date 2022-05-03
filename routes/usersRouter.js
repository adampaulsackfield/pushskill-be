const { getUsers } = require('../controllers/user.controller');
const usersRouter = require('express').Router();

// GET
usersRouter.get('/users', getUsers);

module.exports = usersRouter;
