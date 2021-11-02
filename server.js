// include env
require('dotenv').config();

const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const express = require('express');
const app = express();

const usersEndpoint = require('./models/users/endpoints');
const memesEndpoint = require('./models/memes/endpoints');
const foldersEndpoint = require('./models/folders/endpoints');
const savedEndpoint = require('./models/save/endpoints');

// connect to Mongo DB
connectDB();

// port
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// use endpoints
app.use(usersEndpoint);
app.use(memesEndpoint);
app.use(foldersEndpoint);
app.use(savedEndpoint);

app.use(passport.initialize())
require('./config/passport')(passport);

// start server
app.listen( PORT, () => {
    console.log( 'App is running at port ' + PORT);
});