const express = require('express');

// Router
const endpoints = express.Router();
const actions = require('./actions');

// add new
endpoints.post( '/users/add',actions.addNew );
endpoints.post( '/users/authenticate', actions.authenticate );

module.exports = endpoints;