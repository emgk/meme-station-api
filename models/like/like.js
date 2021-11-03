const mongoose = require('mongoose');

const likeScheama = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    memeId: {
        type: mongoose.Types.ObjectId,
        require: String,
    },
});

likeScheama.set('timestamps',true);

module.exports = mongoose.model('Like', likeScheama);