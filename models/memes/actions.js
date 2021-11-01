const AWS = require('aws-sdk');
const uuid = require('uuid').v4;

const S3 = new AWS.S3({
    accessKeyId: process.env.AMAZON_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_KEY,
});

const Meme = require('./meme');
const userActions = require('../users/actions');

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
            Meme.findById(query?.id).sort({createdAt: 'descending'}).exec(function(err, meme) { 
                if ( err ) {
                    return res.status(403).send({success: false, error: {}, msg: 'Could not fetch,please try again'});
                }

                userActions.getUserById(meme.userId).then((user)=>{
                    return res.send(meme);
                }).catch((err)=>{
                    return res.status(403).send({success: false, error: {}, msg: 'Could not fetch,please try again'});
                });
            });
        } else {

            Meme.find(mongoQuery).sort({createdAt: 'descending'}).exec(function(err, memes) { 
                if ( err ) {
                    return res.status(403).send({success: false, error: {}, msg: 'Could not fetch,please try again'});
                }
                var memesMap = [];
                memes?.forEach(function(meme){
                    memesMap.push(meme);
                });

                res.send(memesMap);
            });
        }
    },
}

module.exports = actions;