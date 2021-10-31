// jwt library
const jwt = require('jsonwebtoken');

/**
 * Generate access token for user
 *
 * @param {Object} user User Object
 * @returns {String} access token string
 */
module.exports.generateAccessToken = ( user ) => {
    return jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
}

/**
 * Generate Refresh token
 * @returns {String} refresh token
 */
module.exports.generateRefreshToken = (user) => {
    return jwt.sign( user, process.env.REFRESH_TOKEN_SECRET );
}

// middleware
module.exports.checkToken = (req, res, next ) => {
    // get auth string from request
    const authorization = req.headers['authorization'];
    const token = authorization && authorization?.split( ' ' )?.[1];
    if ( null === token ) return res.sendStatus(401);

    // verify token
    jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if ( err) return res.sendStatus( 403);
        req.user = user;
        next();
    });
}
