const express = require('express');
const { checkToken } = require('../auth/actions');

// Router
const endpoints = express.Router();
const actions = require('./actions');

// add new
endpoints.get( '/user-current', checkToken, actions.getCurrentUser );
endpoints.post( '/user-register', checkToken, actions.addNew );
endpoints.post( '/user-login', actions.authenticate );

module.exports = endpoints;