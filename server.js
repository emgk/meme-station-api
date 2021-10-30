// include env
require('dotenv').config();

const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const express = require('express');
const app = express();

const routes = require('./routes/index');
const usersEndpoint = require('./models/users/endpoints');
const auth = require('./models/auth/actions');

// connect to Mongo DB
connectDB();

// port
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// check auth before every request
app.use(auth.checkAuthentication);

// use endpoints
app.use(routes);
app.use(usersEndpoint);

// start server
app.listen( PORT, () => {
    console.log( 'App is running at port ' + PORT);
});