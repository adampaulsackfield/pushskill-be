const {
  getUsers,
  postUser,
  loginUser,
} = require("../controllers/user.controller");
const protectedRoute = require("../middleware/authMiddleware");
const usersRouter = require("express").Router();

// GET
usersRouter.get("/users", protectedRoute, getUsers);

//Register user
usersRouter.post("/users", postUser);

//Login user
usersRouter.post("/users/login", loginUser);

module.exports = usersRouter;
