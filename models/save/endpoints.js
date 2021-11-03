require('dotenv').config;

const express = require('express');
const endpoints = express.Router();

const actions = require('./actions');
const { checkToken } = require('../auth/actions');

// save a post
endpoints.post('/save', checkToken, actions.addNew );

// get saved post
endpoints.get('/save', checkToken, actions.getSave);
endpoints.delete('/save/:id', checkToken, actions.deleteSaveByMemeId);

module.exports = endpoints;