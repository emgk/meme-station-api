const express = require('express');

// express router
const endpoints = express.Router();
const auth = require('./actions');

endpoints.delete( '/logout', ( req, res ) =>{
    // remove request token
    res.sendStatus(204);
});

endpoints.post('/auth-token', (req, res)=> {
    const refreshToken = req.body.token;
    if ( null === refreshToken ) return res.sendStatus( 401 );
    if ( ! auth.refreshTokens.includes( refreshToken ) ) return res.sendStatus(403);

    jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET, ( err, user ) => {
        if ( err ) return res.sendStatus(403);
        // create user object by user id
        const userObj = {id: user?._id?.toString()};
        const accessToken = auth.generateAccessToken( userObj );
        res.json( { accessToken, refreshToken});
    })
});


module.exports = endpoints;