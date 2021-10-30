const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/users/user');


const passport = (passport) => {
    var opts = {};

    opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET,
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');

    passport.use(new JwtStrategy(opts, function(jwet_payload, done) {
        User.find({id: jwet_payload.id},function(err, user) {
            if (err){
                return done(err, false);
            }
            if(user) {
                return done (null,user);
            }
            else{
                return done(null,false);
            }
        })
    }))
}

module.exports = passport;