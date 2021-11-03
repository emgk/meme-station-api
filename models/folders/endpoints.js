require('dotenv').config;

const multer = require('multer');
const express = require('express');
const endpoints = express.Router();

const actions = require('./actions');
const { checkToken } = require('../auth/actions');

const storage = multer.memoryStorage({
    destination:(res, file, callback) => {
        callback(null, '');
    },
});

// middleware
const imageUploader = multer({storage}).single('image');

// create meme
endpoints.post('/folders', [checkToken, imageUploader], actions.addNew );

// get memes
endpoints.get('/folders', checkToken, actions.getFolders);
endpoints.get('/folders/:id', checkToken, actions.getFolderById);
endpoints.delete('/folders/:id', checkToken, actions.deleteFolder);

module.exports = endpoints;