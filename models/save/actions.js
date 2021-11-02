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
    getFolderById: (req, res) => {
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
}

module.exports = actions;