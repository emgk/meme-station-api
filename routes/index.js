const express = require('express');
const jwt = require('jsonwebtoken');

// auth method
const auth = require('../models/auth/actions');

// express router
const router = express.Router();

const memes = [
    {
        id: 1,
        title: "Post 1",
    }
];

router.get('/memes', ( req, res ) => {
    res.json(memes);
});

// router.post('/login', (req, res) => {
//     const { username } = req.body;
//     const user = { name: username };

//     // return access token
//     res.json( {
//         accessToken: auth.generateAccessToken( user ),
//         refreshToken: auth.generateRefreshToken(user)
//     } );
// })


module.exports = router;