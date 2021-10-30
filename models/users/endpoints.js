const express = require('express');
const { checkToken } = require('../auth/actions');

// Router
const endpoints = express.Router();
const actions = require('./actions');

// add new
endpoints.post( '/add-user', checkToken, actions.addNew );
endpoints.post( '/login', actions.authenticate );

module.exports = endpoints;