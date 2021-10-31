const Memes = require('./memes');
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
            return res.json({success: false, error: {}, msg: 'Enter all fields!'});
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

                const meme = Memes({
                    userId: body.userId,
                    title: body.title,
                    description: body.description || '',
                    tags: body.tags || '',
                    folderId: body.folderId,
                    imageUrl: data.Location,
                });

                meme.save((err, newMeme) => {
                    console.log( 'debug',err, newMeme);
                    if ( err) {
                        res.json({success: false, error: err, msg: 'Failed to post meme!'});
                    } else {
                        res.json({success: true, mesg: 'Successfully posted meme!', data: meme});
                    }
                });
            });
        }
    }
}

module.exports = actions;