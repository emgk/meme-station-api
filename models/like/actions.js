const Like = require('./like');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const actions = {
    addNew: (req, res) =>  {
        const body = req.body;

        if (! body.userId || ! body.memeId ) {
            return res.status(403).send({success: false, error: {}, msg: 'Invalid request!'});
        } else {
            const data = {
                userId: body.userId,
                memeId: body.memeId,
            };

            const like = Like(data);

            like.save((err, newLike) => {
                if ( err) {
                    res.status(400).send({success: false, error: err, msg: 'Failed to save meme!'});
                } else {
                    res.json(like);
                }
            });
        }
    },
    getLikes: (req, res) => {
        Like.aggregate([
            { $match: { 'userId': { $eq: ObjectId(req?.user?.id) } } },
            ...(
                (req?.query?.memeId) ? [
                    { $match: { 'memeId': { $eq: ObjectId(req?.query?.memeId) } } }
                ]:
                []
            ),
            { $sort: { 'createdAt': -1 } },
            {
                "$lookup": {
                    "from": "memes",
                    "localField": "memeId",
                    "foreignField": "_id",
                    "as": "memes"
                  }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "userId",
                    "foreignField": "_id",
                    "as": "users"
                  }
            }
        ]).exec((err, result) => {
            if ( err) {
                res.status(400).send({success: false, error: err});
            }

            if ( result ) {
                res.send(result);
            }
        });
    },
    getLikeById: (req, res) => {
        Like.aggregate([
            {
                "$match": { '_id': { $eq: ObjectId(req?.params?.id) } }
            },
            {
                "$lookup": {
                    "from": "memes",
                    "localField": "memeId",
                    "foreignField": "_id",
                    "as": "memes"
                  }
            }
        ]).exec((err, result) => {
            if ( err) {
                res.status(400).send({success: false, error: err});
            }

            if ( result ) {
                res.send(result?.[0]);
            }
        });
    },

    deleteLikeByMemeId: (req, res) => {
        Like.deleteOne({
            userId: { $eq: ObjectId(req?.user?.id) },
            memeId: { $eq: ObjectId(req?.param?.id) }
        }, function(err, result ){
            if ( err || result.deletedCount <= 0 ) {
                res.status(400).send({success: false, error: err});
            } else {
                res.send({success: true, data: result, msg: 'Unliked successfully'});
            }
        });
    },
}

module.exports = actions;