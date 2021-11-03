require('dotenv').config;

const express = require('express');
const endpoints = express.Router();

const actions = require('./actions');
const { checkToken } = require('../auth/actions');

// save a post
endpoints.post('/like', checkToken, actions.addNew );

// get saved post
endpoints.get('/like', checkToken, actions.getLikes);
endpoints.get('/like/:id', checkToken, actions.getLikeById);
endpoints.delete('/like/:id', checkToken, actions.deleteLikeByMemeId);

module.exports = endpoints;