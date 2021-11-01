const Meme = require('./meme');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;

const S3 = new AWS.S3({
    accessKeyId: process.env.AMAZON_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_KEY,
});

const actions = {
    addNew: (req, res) => {
        const body = req.body;

        if (! body.userId || ! body.title || ! body.folderId ) {
            return res.status(403).send({success: false, error: {}, msg: 'Enter all fields!'});
        } else {
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
                if ( error ) return next(err);

                const meme = Meme({
                    userId: body.userId,
                    title: body.title,
                    description: body.description || '',
                    tags: body.tags || '',
                    folderId: body.folderId,
                    imageUrl: data.Location,
                });

                meme.save((err, newMeme) => {
                    if ( err) {
                        res.json({success: false, error: err, msg: 'Failed to post meme!'});
                    } else {
                        res.json({success: true, msg: 'Successfully posted meme!', data: meme});
                    }
                });
            });
        }
    },
    getMemes: (req, res) => {
        const { body, query } = req;

        let mongoQuery = {};

        // get by user id
        if ( !! query?.userId ) {
            mongoQuery = { ...mongoQuery, ...{ 'userId': query?.userId } };
        }

        // get by folder id
        if ( !! query?.folderId ) {
            mongoQuery = { ...mongoQuery, ...{ 'folderId': query?.folderId } };
        }

        // get by id
        if ( !! query?.id ) {
            Meme.findById(query?.id, function (err, meme){
                res.send(meme);
            });
        } else {
            Meme.find(mongoQuery, function(err, memes){
                var memesMap = [];
                memes?.forEach(function(meme){
                    memesMap.push(meme);
                });

                res.send(memesMap);
            })
        }
    },
}

module.exports = actions;