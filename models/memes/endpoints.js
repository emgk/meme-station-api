require('dotenv').config;

const multer = require('multer');
const express = require('express');
const endpoints = express.Router();

const actions = require('../memes/actions');
const { checkToken } = require('../auth/actions');

const storage = multer.memoryStorage({
    destination:(res, file, callback) => {
        callback(null, '');
    },
});

// middleware
const imageUploader = multer({storage}).single('image');

// create meme
endpoints.post('/memes', [checkToken, imageUploader], actions.addNew );

// get memes
endpoints.get('/memes', checkToken, actions.getMemes);

module.exports = endpoints;