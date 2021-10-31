const Folders = require('./folders');

const actions = {
    addNew: (req, res) => {
        const body = req.body;
        if( ! req.title || ! req.userId ) {
            return res.json({success: false, msg: 'Please enter all fields!'});
        }

        const newFolder = Folders({title: req.title, userId: req.userId});

        newFolder.save((err, data)=> {
            console.log( 'debug',err, newFolder);
            if ( err) {
                res.json({success: false, error: err, msg: 'Failed to create folder!'});
            } else {
                res.json({success: true, mesg: 'Successfully created folder!', data: meme});
            }
        })
    }
}