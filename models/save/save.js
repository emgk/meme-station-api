const mongoose = require('mongoose');

const saveScheama = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    memeId: {
        type: mongoose.Types.ObjectId,
        require: String,
    },
    folderId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
});

saveScheama.set('timestamps',true);

module.exports = mongoose.model('Save', saveScheama);