const ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `${__dirname}/.env.${ENV}` });

const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/usersRouter');
const connectDB = require('./db/connection');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// GET
app.use('/api', usersRouter);
app.get('/api/hc', (req, res) => res.status(200).send('HELLO'));


module.exports = app;
