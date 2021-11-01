require('dotenv').config();

// auth + jwt methods
const auth = require('../auth/actions');
const User = require( './user');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const actions = {
    addNew: (req, res) => {
        const body = req.body;
        // name/email/password field missing?
        if ( ! body.name  || ! body.password || ! body.email ) {
            return res.json({ success: false, error: {}, msg: 'Enter all fields!'})
        } else {


            User.findOne({ email: body.email }, (err, user )=>{
                if ( user ) {
                    return res.status(400).send({success: false, error: err, msg: 'Email already exists, please try with different one.', });
                } else {
                    const newUser = User({
                        name: body.name,
                        email: body.email,
                        password: body.password,
                        gender: body.gender,
                    });

                    newUser.save((err, newUser) => {
                        if ( err) {
                            res.status(400).send({success: false, error: err, msg: 'Failed to save', });
                        } else {
                            res.json({success: true, msg: 'Account created succesfully!', data: newUser });
                        }
                    })
                }
            });
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
    },
    getCurrentUser: (req, res) => {
        User.aggregate([
            {
                "$match": { '_id': { $eq: ObjectId(req?.user?.id) } }
            },
            {
                '$lookup': {
                    "from": 'memes',
                    "localField": '_id',
                    "foreignField": 'userId',
                    "as": 'memes'
                }
            },
            {
                '$lookup': {
                    "from": 'folders',
                    "localField": '_id',
                    "foreignField": 'userId',
                    "as": 'folders'
                }
            }
        ]).exec((err, result) => {
            if ( err) {
                res.send(err);
            }

            if ( result ) {
                res.send({success: true, error: {}, data: result});
            }
        });
    },
    getUserById: (id) =>  {
        User.aggregate([
            {
                "$match": { '_id': { $eq: ObjectId(id) } }
            },
            {
                '$lookup': {
                    "from": 'memes',
                    "localField": '_id',
                    "foreignField": 'userId',
                    "as": 'memes'
                }
            },
            {
                '$lookup': {
                    "from": 'folders',
                    "localField": '_id',
                    "foreignField": 'userId',
                    "as": 'folders'
                }
            }
        ]).exec((err, result) => {
            if ( err) {
                res.send(err);
            }

            if ( result ) {
                res.send({success: true, error: {}, data: result});
            }
        });
    },
}

module.exports = actions;