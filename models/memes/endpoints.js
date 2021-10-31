require('dotenv').config;

const multer = require('multer');
const express = require('express');
const endpoints = express.Router();

const actions = require('./actions');

const storage = multer.memoryStorage({
    destination:(res, file, callback) => {
        callback(null, '');
    },
});

// middleware
const imageUploader = multer({storage}).single('image');

// endpoint
endpoints.post('/memes', imageUploader, actions.addNew );

module.exports = endpoints;