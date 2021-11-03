const Save = require('./save');
const AWS = require('aws-sdk');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const actions = {
    addNew: (req, res) =>  {
        const body = req.body;

        if (! body.userId || ! body.memeId || ! body.folderId ) {
            return res.status(403).send({success: false, error: {}, msg: 'Invalid request!'});
        } else {
            const data = {
                userId: body.userId,
                memeId: body.memeId,
                folderId: body.folderId ,
            };

            const folder = Save(data);

            folder.save((err, newFolder) => {
                if ( err) {
                    res.status(400).send({success: false, error: err, msg: 'Failed to save meme!'});
                } else {
                    res.json(folder);
                }
            });
        }
    },
    getSave: (req, res) => {
        Save.aggregate([
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
                    "from": "folders",
                    "localField": "folderId",
                    "foreignField": "_id",
                    "as": "folders"
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
    getSaveById: (req, res) => {
        Save.aggregate([
            {
                "$match": { '_id': { $eq: ObjectId(req?.params?.id) } }
            },
            {
                "$lookup": {
                    "from": "memes",
                    "localField": "_id",
                    "foreignField": "folderId",
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

    deleteSaveByMemeId: (req, res) => {
        console.log(req.user.id);

        Save.deleteOne({
            userId: { $eq: ObjectId(req?.user?.id) },
            memeId: { $eq: ObjectId(req?.params?.id) }
        }, function(err, result ){
            if ( err || result.deletedCount <= 0 ) {
                res.status(400).send({success: false, error: err});
            } else {
                res.send({success: true, data: result, msg: 'Un-saved successfully'});
            }
        });
    },
}

module.exports = actions;