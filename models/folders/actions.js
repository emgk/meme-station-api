const Folder = require('./folder');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;

const S3 = new AWS.S3({
    accessKeyId: process.env.AMAZON_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_KEY,
});

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const actions = {
    addNew: (req, res) =>  {
        const body = req.body;

        if (! body.userId || ! body.title || ! body.privacy ) {
            return res.status(403).send({success: false, error: {}, msg: 'Enter all fields!'});
        } else {
            const data = {
                userId: body.userId,
                title: body.title,
                description: body.description || '',
                tags: body.tags || '',
                folderId: body.folderId,
                // imageUrl: data.Location,
            };

            if (!! req.file ) {
                // split file name by dot
                let imageFile = req.file.originalname.split('.');
                // get file type extension
                const fileType = imageFile[imageFile.length - 1];

                const params = {
                    Bucket: process.env.AMAZON_BUCKET_NAME,
                    Key: `${uuid()}.${fileType}`,
                    Body: req.file.buffer
                }

                S3.upload(params,(error, data) => {
                    const folder = Folder({
                        userId: body.userId,
                        title: body.title,
                        description: body.description || '',
                        tags: body.tags || '',
                        folderId: body.folderId,
                        imageUrl: data.Location,
                    });

                    folder.save((err, newFolder) => {
                        if ( err) {
                            res.json({success: false, error: err, msg: 'Failed to create folder'});
                        } else {
                            res.json({success: true, msg: 'Folder created successfully!', data: folder});
                        }
                    });
                });

            } else {
                const folder = Folder({
                    userId: body.userId,
                    title: body.title,
                    description: body.description || '',
                    tags: body.tags || '',
                    folderId: body.folderId,
                    imageUrl: '',
                });

                folder.save((err, newFolder) => {
                    if ( err) {
                        res.status(400).send({success: false, error: err, msg: 'Failed to create folder!'});
                    } else {
                        res.json(folder);
                    }
                });
            }
        }
    },
    getFolders: (req, res) => {
        const { body, query } = req;

        Folder.aggregate([
            { $sort: { 'createdAt': -1 } },
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
                res.send(result);
            }
        });
    },
    getFolderById: (req, res) => {
        Folder.aggregate([
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