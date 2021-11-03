require('dotenv').config;

const express = require('express');
const endpoints = express.Router();

const actions = require('./actions');
const { checkToken } = require('../auth/actions');

// save a post
endpoints.post('/likes', checkToken, actions.addNew );

// get saved post
endpoints.get('/likes', checkToken, actions.getLikes);
endpoints.get('/likes/:id', checkToken, actions.getLikeById);
endpoints.delete('/likes/:id', checkToken, actions.deleteLikeByMemeId);

module.exports = endpoints;