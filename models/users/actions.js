require('dotenv').config();

// auth + jwt methods
const auth = require('../auth/actions');
const User = require( './user'); 

const actions = {
    addNew: (req, res) => {
        const body = req.body;
        // name/email/password field missing?
        if ( ! body.name  || ! body.password || ! body.email ) {
            return res.json({ success: false, error: {}, msg: 'Enter all fields!'})
        } else {
            const newUser = User({
                name: body.name,
                email: body.email,
                password: body.password,
            });

            newUser.save((err, newUser) => {
                if ( err) {
                    res.json({success: false, error: err, msg: 'Failed to save', });
                } else {
                    res.json({success: true, msg: 'Succesfully saved!', data: newUser });
                }
            })
        }
    },
    authenticate: (req, res) => {
        User.findOne({
            email: req.body.email 
        }, (err, user)=>{
            if ( err) throw err;
            if ( ! user ) {
                res.status(403).send({success:false, msg: 'Authentication failed, user not found!'});
            }else {
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if ( isMatch  && ! err ) {
                        // create user object by user id
                        const userObj = {id: user?._id?.toString()};

                        res.json({
                             success: true,
                             id: user?._id?.toString(),
                             accessToken: auth.generateAccessToken( userObj ),
                             refreshToken: auth.generateRefreshToken( userObj )
                            });
                    } else {
                        return res.status(403).send({success: false, msg: 'Authentication failed, wrong password!'})
                    }
                })
            }

        })
    }
}

module.exports = actions;